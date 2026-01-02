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
                <h1 className="heading-lg">Dashboard</h1>
                <p className="body-md mt-1" style={{ color: 'var(--text-muted)' }}>
                    Manage your documents and track usage
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Documents */}
                <div className="brutalist-card p-6" style={{ backgroundColor: 'var(--bg-white)' }}>
                    <div className="flex items-center justify-between mb-4">
                        <div
                            className="w-12 h-12 flex items-center justify-center"
                            style={{
                                backgroundColor: 'var(--bg-peach)',
                                border: '2px solid var(--border-dark)',
                                borderRadius: '8px'
                            }}
                        >
                            <FileText className="w-6 h-6" style={{ color: 'var(--text-primary)' }} />
                        </div>
                        <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                            {userData?.doc_count || 0}
                        </span>
                    </div>
                    <div className="font-medium" style={{ color: 'var(--text-body)' }}>Documents</div>
                    <div className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                        {userData?.doc_count || 0} / {limits.docs === Infinity ? '∞' : limits.docs} used
                    </div>
                    <div
                        className="mt-3 h-2 rounded-full overflow-hidden"
                        style={{ backgroundColor: 'var(--bg-cream)' }}
                    >
                        <div
                            className="h-full rounded-full"
                            style={{
                                backgroundColor: 'var(--accent-coral)',
                                width: `${Math.min((userData?.doc_count || 0) / (limits.docs === Infinity ? 1 : limits.docs) * 100, 100)}%`
                            }}
                        />
                    </div>
                </div>

                {/* Queries */}
                <div className="brutalist-card p-6" style={{ backgroundColor: 'var(--bg-white)' }}>
                    <div className="flex items-center justify-between mb-4">
                        <div
                            className="w-12 h-12 flex items-center justify-center"
                            style={{
                                backgroundColor: 'var(--bg-mint)',
                                border: '2px solid var(--border-dark)',
                                borderRadius: '8px'
                            }}
                        >
                            <MessageSquare className="w-6 h-6" style={{ color: 'var(--text-primary)' }} />
                        </div>
                        <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                            {userData?.query_count_month || 0}
                        </span>
                    </div>
                    <div className="font-medium" style={{ color: 'var(--text-body)' }}>Queries this month</div>
                    <div className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                        {userData?.query_count_month || 0} / {limits.queries === Infinity ? '∞' : limits.queries} used
                    </div>
                    <div
                        className="mt-3 h-2 rounded-full overflow-hidden"
                        style={{ backgroundColor: 'var(--bg-cream)' }}
                    >
                        <div
                            className="h-full rounded-full"
                            style={{
                                backgroundColor: 'var(--accent-teal)',
                                width: `${Math.min((userData?.query_count_month || 0) / (limits.queries === Infinity ? 1 : limits.queries) * 100, 100)}%`
                            }}
                        />
                    </div>
                </div>

                {/* Plan */}
                <div className="brutalist-card p-6" style={{ backgroundColor: 'var(--bg-white)' }}>
                    <div className="flex items-center justify-between mb-4">
                        <div
                            className="w-12 h-12 flex items-center justify-center"
                            style={{
                                backgroundColor: 'var(--bg-lavender)',
                                border: '2px solid var(--border-dark)',
                                borderRadius: '8px'
                            }}
                        >
                            <Sparkles className="w-6 h-6" style={{ color: 'var(--text-primary)' }} />
                        </div>
                        <span
                            className="text-xl font-bold uppercase px-3 py-1"
                            style={{
                                backgroundColor: userData?.plan_type === 'pro' ? 'var(--accent-coral)' : 'var(--bg-cream)',
                                border: '2px solid var(--border-dark)',
                                borderRadius: '6px',
                                color: 'var(--text-primary)'
                            }}
                        >
                            {userData?.plan_type || 'Free'}
                        </span>
                    </div>
                    <div className="font-medium" style={{ color: 'var(--text-body)' }}>Current Plan</div>
                    {userData?.plan_type === 'free' && (
                        <Link
                            href="/subscription"
                            className="mt-4 inline-flex items-center gap-2 text-sm font-medium hover:underline underline-offset-4"
                            style={{ color: 'var(--accent-coral)' }}
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
                    className="brutalist-card p-6 group"
                    style={{ backgroundColor: 'var(--bg-peach)' }}
                >
                    <div className="flex items-center gap-4">
                        <div
                            className="w-14 h-14 flex items-center justify-center group-hover:scale-105 transition-transform"
                            style={{
                                backgroundColor: 'var(--bg-white)',
                                border: '2px solid var(--border-dark)',
                                borderRadius: '12px'
                            }}
                        >
                            <Upload className="w-7 h-7" style={{ color: 'var(--text-primary)' }} />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                                Upload Document
                            </h3>
                            <p style={{ color: 'var(--text-body)' }}>Upload a PDF to start chatting</p>
                        </div>
                    </div>
                </Link>

                {documents && documents.length > 0 && (
                    <Link
                        href={`/chat/${documents[0].id}`}
                        className="brutalist-card p-6 group"
                        style={{ backgroundColor: 'var(--bg-mint)' }}
                    >
                        <div className="flex items-center gap-4">
                            <div
                                className="w-14 h-14 flex items-center justify-center group-hover:scale-105 transition-transform"
                                style={{
                                    backgroundColor: 'var(--bg-white)',
                                    border: '2px solid var(--border-dark)',
                                    borderRadius: '12px'
                                }}
                            >
                                <MessageSquare className="w-7 h-7" style={{ color: 'var(--text-primary)' }} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                                    Continue Chatting
                                </h3>
                                <p style={{ color: 'var(--text-body)' }}>Resume your last conversation</p>
                            </div>
                        </div>
                    </Link>
                )}
            </div>

            {/* Recent Documents */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="heading-md">Recent Documents</h2>
                </div>

                {documents && documents.length > 0 ? (
                    <div className="space-y-3">
                        {documents.map((doc: any) => (
                            <Link
                                key={doc.id}
                                href={doc.status === 'ready' ? `/chat/${doc.id}` : '#'}
                                className="brutalist-card flex items-center gap-4 p-4"
                                style={{ backgroundColor: 'var(--bg-white)' }}
                            >
                                <div
                                    className="w-10 h-10 flex items-center justify-center"
                                    style={{
                                        backgroundColor: 'var(--bg-cream)',
                                        border: '2px solid var(--border-dark)',
                                        borderRadius: '8px'
                                    }}
                                >
                                    <FileText className="w-5 h-5" style={{ color: 'var(--text-body)' }} />
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                                        {doc.file_path?.split('/').pop() || 'Document'}
                                    </div>
                                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                        {formatBytes(doc.file_size)} • {formatDate(doc.created_at)}
                                    </div>
                                </div>
                                <div
                                    className="px-3 py-1 text-xs font-semibold"
                                    style={{
                                        backgroundColor: doc.status === 'ready'
                                            ? 'var(--bg-mint)'
                                            : doc.status === 'indexing'
                                                ? 'var(--bg-pale-yellow)'
                                                : doc.status === 'failed'
                                                    ? '#FFF0F0'
                                                    : 'var(--bg-cream)',
                                        border: '1.5px solid var(--border-dark)',
                                        borderRadius: '4px',
                                        color: 'var(--text-primary)'
                                    }}
                                >
                                    {doc.status}
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div
                        className="brutalist-card text-center py-12"
                        style={{ backgroundColor: 'var(--bg-white)' }}
                    >
                        <FileText className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
                        <p style={{ color: 'var(--text-body)' }}>No documents yet</p>
                        <Link
                            href="/upload"
                            className="mt-4 inline-flex items-center gap-2 font-medium hover:underline underline-offset-4"
                            style={{ color: 'var(--accent-coral)' }}
                        >
                            Upload your first document <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
