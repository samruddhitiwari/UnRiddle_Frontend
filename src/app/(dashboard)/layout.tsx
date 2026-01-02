'use client'

import { useState, useEffect, ReactNode } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
    LayoutDashboard,
    Upload,
    MessageSquare,
    CreditCard,
    LogOut,
    Menu,
    X,
    FileText
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
    children: ReactNode
}

interface NavItem {
    name: string
    href: string
    icon: any
}

const navigation: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Upload', href: '/upload', icon: Upload },
    { name: 'Sessions', href: '/sessions', icon: MessageSquare },
    { name: 'Subscription', href: '/subscription', icon: CreditCard },
]

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [userPlan, setUserPlan] = useState<any>(null)
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)

            if (user) {
                const { data: userData } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', user.id)
                    .single()
                setUserPlan(userData)
            }
        }
        getUser()
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-cream)' }}>
            {/* Mobile sidebar */}
            <div className={cn(
                "fixed inset-0 z-50 lg:hidden",
                sidebarOpen ? "block" : "hidden"
            )}>
                <div
                    className="fixed inset-0"
                    style={{ backgroundColor: 'rgba(255, 251, 245, 0.9)' }}
                    onClick={() => setSidebarOpen(false)}
                />
                <div
                    className="fixed inset-y-0 left-0 w-72"
                    style={{
                        backgroundColor: 'var(--bg-white)',
                        borderRight: '2px solid var(--border-dark)'
                    }}
                >
                    <div
                        className="flex items-center justify-between h-16 px-6"
                        style={{ borderBottom: '2px solid var(--border-dark)' }}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="w-9 h-9 flex items-center justify-center"
                                style={{
                                    backgroundColor: 'var(--accent-coral)',
                                    border: '2px solid var(--border-dark)',
                                    borderRadius: '8px'
                                }}
                            >
                                <FileText className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
                            </div>
                            <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                                Unriddle
                            </span>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            style={{ color: 'var(--text-body)' }}
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <nav className="p-4 space-y-2">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 font-medium transition-all",
                                    pathname === item.href
                                        ? "brutalist-card"
                                        : "hover:bg-gray-100"
                                )}
                                style={{
                                    borderRadius: '8px',
                                    color: pathname === item.href ? 'var(--text-primary)' : 'var(--text-body)',
                                    backgroundColor: pathname === item.href ? 'var(--bg-peach)' : 'transparent'
                                }}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-72 lg:block">
                <div
                    className="flex flex-col h-full"
                    style={{
                        backgroundColor: 'var(--bg-white)',
                        borderRight: '2px solid var(--border-dark)'
                    }}
                >
                    {/* Logo */}
                    <div
                        className="flex items-center gap-3 h-16 px-6"
                        style={{ borderBottom: '2px solid var(--border-dark)' }}
                    >
                        <div
                            className="w-9 h-9 flex items-center justify-center"
                            style={{
                                backgroundColor: 'var(--accent-coral)',
                                border: '2px solid var(--border-dark)',
                                borderRadius: '8px'
                            }}
                        >
                            <FileText className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
                        </div>
                        <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                            Unriddle
                        </span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 font-medium transition-all",
                                    pathname === item.href
                                        ? ""
                                        : "hover:bg-gray-100"
                                )}
                                style={{
                                    borderRadius: '8px',
                                    color: pathname === item.href ? 'var(--text-primary)' : 'var(--text-body)',
                                    backgroundColor: pathname === item.href ? 'var(--bg-peach)' : 'transparent',
                                    border: pathname === item.href ? '2px solid var(--border-dark)' : '2px solid transparent',
                                    boxShadow: pathname === item.href ? '2px 2px 0 var(--border-dark)' : 'none'
                                }}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* User section */}
                    <div className="p-4" style={{ borderTop: '2px solid var(--border-dark)' }}>
                        {userPlan && (
                            <div
                                className="mb-4 p-3"
                                style={{
                                    backgroundColor: 'var(--bg-mint)',
                                    border: '2px solid var(--border-dark)',
                                    borderRadius: '8px'
                                }}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                                        Current Plan
                                    </span>
                                    <span
                                        className="text-xs font-bold px-2 py-0.5"
                                        style={{
                                            backgroundColor: userPlan.plan_type === 'pro'
                                                ? 'var(--accent-coral)'
                                                : userPlan.plan_type === 'enterprise'
                                                    ? 'var(--bg-lavender)'
                                                    : 'var(--bg-cream)',
                                            border: '1.5px solid var(--border-dark)',
                                            borderRadius: '4px',
                                            color: 'var(--text-primary)'
                                        }}
                                    >
                                        {userPlan.plan_type?.toUpperCase()}
                                    </span>
                                </div>
                                <div className="text-xs" style={{ color: 'var(--text-body)' }}>
                                    {userPlan.query_count_month} / {userPlan.plan_type === 'free' ? '50' : '500'} queries
                                </div>
                            </div>
                        )}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-3 font-medium transition-all hover:bg-gray-100"
                            style={{
                                borderRadius: '8px',
                                color: 'var(--text-body)'
                            }}
                        >
                            <LogOut className="w-5 h-5" />
                            Sign out
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-72">
                {/* Top bar */}
                <div
                    className="sticky top-0 z-30 h-16 flex items-center px-4 lg:px-8"
                    style={{
                        backgroundColor: 'var(--bg-cream)',
                        borderBottom: '2px solid var(--border-dark)'
                    }}
                >
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                        style={{ color: 'var(--text-body)' }}
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="flex-1 flex items-center justify-end gap-4">
                        <div className="text-sm" style={{ color: 'var(--text-body)' }}>
                            {user?.email}
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <main className="p-4 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
