'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
    Plus, Loader2, FileText, MessageSquare, Trash2,
    ChevronRight, Lock, Sparkles, Calendar
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface Session {
    id: string
    name: string
    is_multi_pdf: boolean
    created_at: string
    updated_at: string
    document_count: number
}

interface Document {
    id: string
    file_path: string
    status: string
    created_at: string
}

export default function SessionsPage() {
    const router = useRouter()
    const supabase = createClient()

    const [sessions, setSessions] = useState<Session[]>([])
    const [documents, setDocuments] = useState<Document[]>([])
    const [loading, setLoading] = useState(true)
    const [creating, setCreating] = useState(false)
    const [userPlan, setUserPlan] = useState<any>(null)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [selectedDocs, setSelectedDocs] = useState<string[]>([])
    const [sessionName, setSessionName] = useState('')

    const isPaidUser = userPlan?.plan_type && userPlan.plan_type !== 'free'

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            router.push('/login')
            return
        }

        // Fetch user plan
        const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()
        setUserPlan(userData)

        // Fetch sessions
        try {
            const sessionsRes = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/sessions/`,
                {
                    headers: { 'Authorization': `Bearer ${session.access_token}` }
                }
            )
            if (sessionsRes.ok) {
                const data = await sessionsRes.json()
                setSessions(data.sessions || [])
            }
        } catch (e) {
            console.error('Error fetching sessions:', e)
        }

        // Fetch documents for creating new sessions
        try {
            const docsRes = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/documents/`,
                {
                    headers: { 'Authorization': `Bearer ${session.access_token}` }
                }
            )
            if (docsRes.ok) {
                const data = await docsRes.json()
                const docsArray = Array.isArray(data) ? data : (data.documents || [])
                setDocuments(docsArray.filter((d: Document) => d.status === 'ready'))
            }
        } catch (e) {
            console.error('Error fetching documents:', e)
        }

        setLoading(false)
    }

    const handleCreateSession = async () => {
        if (!isPaidUser) {
            router.push('/subscription')
            return
        }

        if (selectedDocs.length === 0) return

        setCreating(true)
        const { data: { session } } = await supabase.auth.getSession()

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sessions/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session?.access_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: sessionName || 'New Session',
                    document_ids: selectedDocs
                })
            })

            if (!response.ok) {
                const error = await response.json()
                if (error.detail?.error === 'feature_locked') {
                    router.push('/subscription')
                    return
                }
                throw new Error(error.detail?.message || 'Failed to create session')
            }

            const newSession = await response.json()
            router.push(`/sessions/${newSession.id}`)

        } catch (e: any) {
            console.error('Error creating session:', e)
        } finally {
            setCreating(false)
            setShowCreateModal(false)
        }
    }

    const handleDeleteSession = async (sessionId: string) => {
        const { data: { session } } = await supabase.auth.getSession()

        try {
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sessions/${sessionId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${session?.access_token}` }
            })
            setSessions(sessions.filter(s => s.id !== sessionId))
        } catch (e) {
            console.error('Error deleting session:', e)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--accent-coral)' }} />
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="heading-lg mb-2">Multi-PDF Sessions</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Chat with multiple documents in a single conversation</p>
                </div>
                <button
                    onClick={() => isPaidUser ? setShowCreateModal(true) : router.push('/subscription')}
                    className="btn-primary"
                >
                    {isPaidUser ? (
                        <>
                            <Plus className="w-5 h-5" />
                            New Session
                        </>
                    ) : (
                        <>
                            <Lock className="w-5 h-5" />
                            Upgrade to Use
                        </>
                    )}
                </button>
            </div>

            {/* Free User Banner */}
            {!isPaidUser && (
                <div
                    className="brutalist-card mb-8 p-6"
                    style={{ backgroundColor: 'var(--bg-lavender)' }}
                >
                    <div className="flex items-start gap-4">
                        <div
                            className="w-12 h-12 flex items-center justify-center flex-shrink-0"
                            style={{
                                backgroundColor: 'var(--bg-white)',
                                border: '2px solid var(--border-dark)',
                                borderRadius: '8px'
                            }}
                        >
                            <Sparkles className="w-6 h-6" style={{ color: 'var(--text-primary)' }} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                                Unlock Multi-PDF Sessions
                            </h3>
                            <p className="mb-4" style={{ color: 'var(--text-body)' }}>
                                Chat across multiple documents simultaneously. Perfect for research, studying, and comparing content.
                            </p>
                            <Link
                                href="/subscription"
                                className="btn-primary inline-flex text-sm"
                            >
                                Upgrade Now
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Sessions List */}
            {sessions.length > 0 ? (
                <div className="space-y-4">
                    {sessions.map((session) => (
                        <div
                            key={session.id}
                            className="brutalist-card group p-4"
                            style={{ backgroundColor: 'var(--bg-white)' }}
                        >
                            <div className="flex items-center justify-between">
                                <Link
                                    href={`/sessions/${session.id}`}
                                    className="flex-1 flex items-center gap-4"
                                >
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
                                    <div className="flex-1">
                                        <h3
                                            className="font-medium group-hover:underline underline-offset-4"
                                            style={{ color: 'var(--text-primary)' }}
                                        >
                                            {session.name}
                                        </h3>
                                        <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                                            <span className="flex items-center gap-1">
                                                <FileText className="w-3 h-3" />
                                                {session.document_count} document{session.document_count !== 1 ? 's' : ''}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(session.updated_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                                </Link>
                                <button
                                    onClick={() => handleDeleteSession(session.id)}
                                    className="ml-4 p-2 rounded-lg hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                                    style={{
                                        border: '1.5px solid transparent',
                                        color: 'var(--text-muted)'
                                    }}
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : isPaidUser ? (
                <div
                    className="brutalist-card text-center py-16"
                    style={{ backgroundColor: 'var(--bg-white)' }}
                >
                    <MessageSquare className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
                    <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>No sessions yet</h3>
                    <p className="mb-6" style={{ color: 'var(--text-body)' }}>Create your first multi-PDF session to get started</p>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="btn-primary inline-flex"
                    >
                        <Plus className="w-5 h-5" />
                        Create Session
                    </button>
                </div>
            ) : null}

            {/* Create Session Modal */}
            {showCreateModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ backgroundColor: 'rgba(255, 251, 245, 0.95)' }}
                >
                    <div className="brutalist-card w-full max-w-lg" style={{ backgroundColor: 'var(--bg-white)' }}>
                        <div className="p-6" style={{ borderBottom: '2px solid var(--border-dark)' }}>
                            <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>Create New Session</h2>
                            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Select documents to include in this session</p>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-body)' }}>Session Name</label>
                                <input
                                    type="text"
                                    value={sessionName}
                                    onChange={(e) => setSessionName(e.target.value)}
                                    placeholder="My Research Session"
                                    className="w-full px-4 py-3 focus:outline-none"
                                    style={{
                                        backgroundColor: 'var(--bg-white)',
                                        border: '2px solid var(--border-dark)',
                                        borderRadius: '8px',
                                        color: 'var(--text-primary)'
                                    }}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-body)' }}>
                                    Select Documents ({selectedDocs.length} selected)
                                </label>
                                <div className="max-h-64 overflow-y-auto space-y-2">
                                    {documents.map((doc) => (
                                        <label
                                            key={doc.id}
                                            className="flex items-center gap-3 p-3 cursor-pointer transition-colors"
                                            style={{
                                                backgroundColor: selectedDocs.includes(doc.id) ? 'var(--bg-mint)' : 'var(--bg-cream)',
                                                border: '2px solid var(--border-dark)',
                                                borderRadius: '8px'
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedDocs.includes(doc.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedDocs([...selectedDocs, doc.id])
                                                    } else {
                                                        setSelectedDocs(selectedDocs.filter(id => id !== doc.id))
                                                    }
                                                }}
                                                className="w-5 h-5"
                                                style={{ accentColor: 'var(--accent-coral)' }}
                                            />
                                            <FileText className="w-4 h-4" style={{ color: 'var(--text-body)' }} />
                                            <span className="text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                                                {doc.file_path.split('/').pop()}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 flex items-center justify-end gap-3" style={{ borderTop: '2px solid var(--border-dark)' }}>
                            <button
                                onClick={() => {
                                    setShowCreateModal(false)
                                    setSelectedDocs([])
                                    setSessionName('')
                                }}
                                className="btn-secondary text-sm py-2 px-4"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateSession}
                                disabled={selectedDocs.length === 0 || creating}
                                className="btn-primary text-sm py-2 px-4 disabled:opacity-50"
                            >
                                {creating ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    'Create Session'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
