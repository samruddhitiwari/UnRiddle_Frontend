import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FileText, MessageSquare, Upload, ArrowRight, Sparkles } from 'lucide-react'
import { formatBytes, formatDate } from '@/lib/utils'

export default async function DashboardPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Get user data
    const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

    // Get documents
    const { data: documents } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

    const planLimits = {
        free: { queries: 50, docs: 5 },
        pro: { queries: 500, docs: 50 },
        enterprise: { queries: Infinity, docs: Infinity }
    }

    const limits = planLimits[userData?.plan_type as keyof typeof planLimits] || planLimits.free

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-slate-400 mt-1">Manage your documents and track usage</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Documents */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-indigo-400" />
                        </div>
                        <span className="text-3xl font-bold text-white">{userData?.doc_count || 0}</span>
                    </div>
                    <div className="text-slate-400">Documents</div>
                    <div className="mt-2 text-sm text-slate-500">
                        {userData?.doc_count || 0} / {limits.docs === Infinity ? '∞' : limits.docs} used
                    </div>
                    <div className="mt-3 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                            style={{ width: `${Math.min((userData?.doc_count || 0) / (limits.docs === Infinity ? 1 : limits.docs) * 100, 100)}%` }}
                        />
                    </div>
                </div>

                {/* Queries */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                            <MessageSquare className="w-6 h-6 text-purple-400" />
                        </div>
                        <span className="text-3xl font-bold text-white">{userData?.query_count_month || 0}</span>
                    </div>
                    <div className="text-slate-400">Queries this month</div>
                    <div className="mt-2 text-sm text-slate-500">
                        {userData?.query_count_month || 0} / {limits.queries === Infinity ? '∞' : limits.queries} used
                    </div>
                    <div className="mt-3 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                            style={{ width: `${Math.min((userData?.query_count_month || 0) / (limits.queries === Infinity ? 1 : limits.queries) * 100, 100)}%` }}
                        />
                    </div>
                </div>

                {/* Plan */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-emerald-400" />
                        </div>
                        <span className="text-xl font-bold text-white uppercase">{userData?.plan_type || 'Free'}</span>
                    </div>
                    <div className="text-slate-400">Current Plan</div>
                    {userData?.plan_type === 'free' && (
                        <Link
                            href="/subscription"
                            className="mt-4 inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300"
                        >
                            Upgrade to Pro <ArrowRight className="w-4 h-4" />
                        </Link>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link
                    href="/upload"
                    className="group bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-6 hover:border-indigo-500/40 transition-all"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Upload className="w-7 h-7 text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">Upload Document</h3>
                            <p className="text-slate-400">Upload a PDF to start chatting</p>
                        </div>
                    </div>
                </Link>

                {documents && documents.length > 0 && (
                    <Link
                        href={`/chat/${documents[0].id}`}
                        className="group bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/40 transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <MessageSquare className="w-7 h-7 text-purple-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">Continue Chatting</h3>
                                <p className="text-slate-400">Resume your last conversation</p>
                            </div>
                        </div>
                    </Link>
                )}
            </div>

            {/* Recent Documents */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-white">Recent Documents</h2>
                </div>

                {documents && documents.length > 0 ? (
                    <div className="space-y-3">
                        {documents.map((doc: any) => (
                            <Link
                                key={doc.id}
                                href={doc.status === 'ready' ? `/chat/${doc.id}` : '#'}
                                className="flex items-center gap-4 p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-slate-700 transition-all"
                            >
                                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-slate-400" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-white font-medium truncate">
                                        {doc.file_path?.split('/').pop() || 'Document'}
                                    </div>
                                    <div className="text-sm text-slate-500">
                                        {formatBytes(doc.file_size)} • {formatDate(doc.created_at)}
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-medium ${doc.status === 'ready'
                                        ? 'bg-emerald-500/20 text-emerald-400'
                                        : doc.status === 'indexing'
                                            ? 'bg-amber-500/20 text-amber-400'
                                            : doc.status === 'failed'
                                                ? 'bg-red-500/20 text-red-400'
                                                : 'bg-slate-700 text-slate-400'
                                    }`}>
                                    {doc.status}
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-slate-900/50 border border-slate-800 rounded-2xl">
                        <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400">No documents yet</p>
                        <Link
                            href="/upload"
                            className="mt-4 inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300"
                        >
                            Upload your first document <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
