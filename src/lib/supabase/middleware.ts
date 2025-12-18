import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Refresh session if expired - with timeout protection
    let user = null
    try {
        const { data, error } = await supabase.auth.getUser()
        if (!error) {
            user = data.user
        }
    } catch (e) {
        // If auth check fails (timeout, network error), allow request to continue
        // The page-level auth check will handle it
        console.error('Middleware auth check failed:', e)
    }

    // Protected routes
    const protectedPaths = ['/dashboard', '/upload', '/chat', '/subscription']
    const isProtectedPath = protectedPaths.some(path =>
        request.nextUrl.pathname.startsWith(path)
    )

    if (isProtectedPath && !user) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // Redirect logged in users from login to dashboard
    if (request.nextUrl.pathname === '/login' && user) {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}
