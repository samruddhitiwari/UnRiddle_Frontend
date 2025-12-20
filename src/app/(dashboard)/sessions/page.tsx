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
                setDocuments(data.filter((d: Document) => d.status === 'ready'))
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
                <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Multi-PDF Sessions</h1>
                    <p className="text-slate-400">Chat with multiple documents in a single conversation</p>
                </div>
                <button
                    onClick={() => isPaidUser ? setShowCreateModal(true) : router.push('/subscription')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:from-indigo-600 hover:to-purple-700 transition-all"
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
                <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white mb-2">
                                Unlock Multi-PDF Sessions
                            </h3>
                            <p className="text-slate-400 mb-4">
                                Chat across multiple documents simultaneously. Perfect for research, studying, and comparing content.
                            </p>
                            <Link
                                href="/subscription"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition-colors"
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
                            className="group p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-indigo-500/50 transition-all"
                        >
                            <div className="flex items-center justify-between">
                                <Link
                                    href={`/sessions/${session.id}`}
                                    className="flex-1 flex items-center gap-4"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                                        <MessageSquare className="w-6 h-6 text-indigo-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-white font-medium group-hover:text-indigo-400 transition-colors">
                                            {session.name}
                                        </h3>
                                        <div className="flex items-center gap-3 text-sm text-slate-400">
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
                                    <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                                </Link>
                                <button
                                    onClick={() => handleDeleteSession(session.id)}
                                    className="ml-4 p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : isPaidUser ? (
                <div className="text-center py-16">
                    <MessageSquare className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                    <h3 className="text-lg font-semibold text-white mb-2">No sessions yet</h3>
                    <p className="text-slate-400 mb-6">Create your first multi-PDF session to get started</p>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Create Session
                    </button>
                </div>
            ) : null}

            {/* Create Session Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="w-full max-w-lg mx-4 bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl">
                        <div className="p-6 border-b border-slate-700">
                            <h2 className="text-xl font-semibold text-white">Create New Session</h2>
                            <p className="text-slate-400 text-sm">Select documents to include in this session</p>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Session Name</label>
                                <input
                                    type="text"
                                    value={sessionName}
                                    onChange={(e) => setSessionName(e.target.value)}
                                    placeholder="My Research Session"
                                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-slate-400 mb-2">
                                    Select Documents ({selectedDocs.length} selected)
                                </label>
                                <div className="max-h-64 overflow-y-auto space-y-2">
                                    {documents.map((doc) => (
                                        <label
                                            key={doc.id}
                                            className={cn(
                                                "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                                                selectedDocs.includes(doc.id)
                                                    ? "bg-indigo-500/20 border border-indigo-500/50"
                                                    : "bg-slate-800 border border-slate-700 hover:border-slate-600"
                                            )}
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
                                                className="sr-only"
                                            />
                                            <div className={cn(
                                                "w-5 h-5 rounded border-2 flex items-center justify-center",
                                                selectedDocs.includes(doc.id)
                                                    ? "bg-indigo-500 border-indigo-500"
                                                    : "border-slate-600"
                                            )}>
                                                {selectedDocs.includes(doc.id) && (
                                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </div>
                                            <FileText className="w-4 h-4 text-slate-400" />
                                            <span className="text-white text-sm truncate">
                                                {doc.file_path.split('/').pop()}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-700 flex items-center justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowCreateModal(false)
                                    setSelectedDocs([])
                                    setSessionName('')
                                }}
                                className="px-4 py-2 rounded-lg text-slate-400 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateSession}
                                disabled={selectedDocs.length === 0 || creating}
                                className="px-4 py-2 rounded-lg bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition-colors disabled:opacity-50"
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
