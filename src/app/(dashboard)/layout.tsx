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
    FileText,
    ChevronRight
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
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
            {/* Mobile sidebar */}
            <div className={cn(
                "fixed inset-0 z-50 lg:hidden",
                sidebarOpen ? "block" : "hidden"
            )}>
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
                <div className="fixed inset-y-0 left-0 w-72 bg-slate-900 border-r border-slate-800">
                    <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-bold text-white">Unriddle</span>
                        </div>
                        <button onClick={() => setSidebarOpen(false)} className="text-slate-400">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <nav className="p-4 space-y-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                                    pathname === item.href
                                        ? "bg-indigo-500/20 text-indigo-400"
                                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                                )}
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
                <div className="flex flex-col h-full bg-slate-900/50 backdrop-blur-xl border-r border-slate-800">
                    {/* Logo */}
                    <div className="flex items-center gap-3 h-16 px-6 border-b border-slate-800">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <FileText className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-bold text-white">Unriddle</span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                                    pathname === item.href
                                        ? "bg-indigo-500/20 text-indigo-400 shadow-lg shadow-indigo-500/10"
                                        : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                                )}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* User section */}
                    <div className="p-4 border-t border-slate-800">
                        {userPlan && (
                            <div className="mb-4 p-3 rounded-xl bg-slate-800/50">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-slate-500">Current Plan</span>
                                    <span className={cn(
                                        "text-xs font-semibold px-2 py-0.5 rounded-full",
                                        userPlan.plan_type === 'pro'
                                            ? "bg-indigo-500/20 text-indigo-400"
                                            : userPlan.plan_type === 'enterprise'
                                                ? "bg-purple-500/20 text-purple-400"
                                                : "bg-slate-700 text-slate-400"
                                    )}>
                                        {userPlan.plan_type?.toUpperCase()}
                                    </span>
                                </div>
                                <div className="text-xs text-slate-400">
                                    {userPlan.query_count_month} / {userPlan.plan_type === 'free' ? '50' : '500'} queries
                                </div>
                            </div>
                        )}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
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
                <div className="sticky top-0 z-30 h-16 bg-slate-900/50 backdrop-blur-xl border-b border-slate-800 flex items-center px-4 lg:px-8">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="flex-1 flex items-center justify-end gap-4">
                        <div className="text-sm text-slate-400">
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
