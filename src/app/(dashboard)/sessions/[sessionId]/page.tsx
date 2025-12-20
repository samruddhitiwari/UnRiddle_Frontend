'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
    Send, Loader2, FileText, ArrowLeft, AlertCircle, Bot, User,
    Sparkles, BookOpen, HelpCircle, GraduationCap, Briefcase,
    Shield, ShieldCheck, ShieldAlert, Plus, X, Download, Zap,
    ChevronDown, ChevronUp, Lock
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    sources?: { chunk_id: string; text: string; similarity: number; page_number?: number; document_id?: string }[]
    confidence?: string
    groundingWarning?: string
}

interface SessionDocument {
    id: string
    title: string
    file_path: string
    status: string
}

interface IntelligenceMode {
    id: string
    name: string
    description: string
    icon: any
}

const INTELLIGENCE_MODES: IntelligenceMode[] = [
    { id: 'default', name: 'Default', description: 'Balanced, accurate answers', icon: Bot },
    { id: 'eli5', name: 'Explain Simply', description: 'Simple explanations', icon: HelpCircle },
    { id: 'technical', name: 'Technical', description: 'Detailed technical', icon: Sparkles },
    { id: 'exam', name: 'Exam-Oriented', description: 'Testable concepts', icon: GraduationCap },
    { id: 'executive', name: 'Executive', description: 'High-level insights', icon: Briefcase },
]

export default function SessionChatPage() {
    const params = useParams()
    const router = useRouter()
    const sessionId = params.sessionId as string

    const [session, setSession] = useState<any>(null)
    const [documents, setDocuments] = useState<SessionDocument[]>([])
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [streamingContent, setStreamingContent] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [showSources, setShowSources] = useState<string | null>(null)

    const [intelligenceMode, setIntelligenceMode] = useState('default')
    const [showModeSelector, setShowModeSelector] = useState(false)
    const [generating, setGenerating] = useState<string | null>(null)
    const [showGenerateMenu, setShowGenerateMenu] = useState(false)

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const supabase = createClient()

    useEffect(() => {
        fetchSession()
    }, [sessionId])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, streamingContent])

    const fetchSession = async () => {
        const { data: { session: authSession } } = await supabase.auth.getSession()
        if (!authSession) return router.push('/login')

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/sessions/${sessionId}`,
                {
                    headers: { 'Authorization': `Bearer ${authSession.access_token}` }
                }
            )

            if (!response.ok) {
                setError('Session not found')
                return
            }

            const data = await response.json()
            setSession(data)
            setDocuments(data.documents || [])

            // Fetch chat history
            const historyResponse = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/query/history/${sessionId}`,
                {
                    headers: { 'Authorization': `Bearer ${authSession.access_token}` }
                }
            )

            if (historyResponse.ok) {
                const historyData = await historyResponse.json()
                const loadedMessages: Message[] = (historyData.messages || []).map((msg: any) => ({
                    id: msg.id,
                    role: msg.role,
                    content: msg.content,
                    sources: msg.citations,
                    confidence: msg.confidence_score > 0.7 ? 'high' : msg.confidence_score > 0.4 ? 'medium' : 'low',
                }))
                setMessages(loadedMessages)
            }
        } catch (e: any) {
            setError(e.message)
        }
    }

    const handleGenerate = async (outputType: string) => {
        setGenerating(outputType)
        setShowGenerateMenu(false)

        try {
            const { data: { session: authSession } } = await supabase.auth.getSession()

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/generate/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authSession?.access_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    session_id: sessionId,
                    output_type: outputType,
                }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.detail?.message || 'Generation failed')
            }

            const data = await response.json()

            const generatedMessage: Message = {
                id: Date.now().toString(),
                role: 'assistant',
                content: `**📚 Generated ${outputType.charAt(0).toUpperCase() + outputType.slice(1)}:**\n\n${typeof data.content === 'string'
                    ? data.content
                    : JSON.stringify(data.content, null, 2)
                    }`,
            }
            setMessages(prev => [...prev, generatedMessage])

        } catch (err: any) {
            setError(err.message)
        } finally {
            setGenerating(null)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || loading) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
        }

        setMessages(prev => [...prev, userMessage])
        setInput('')
        setLoading(true)
        setError(null)
        setStreamingContent('')

        try {
            const { data: { session: authSession } } = await supabase.auth.getSession()

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/query/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authSession?.access_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    session_id: sessionId,
                    user_query: userMessage.content,
                    intelligence_mode: intelligenceMode,
                }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.detail?.message || 'Query failed')
            }

            const reader = response.body?.getReader()
            const decoder = new TextDecoder()
            let fullContent = ''
            let sources: any[] = []
            let confidence = 'medium'
            let groundingWarning: string | null = null

            while (reader) {
                const { done, value } = await reader.read()
                if (done) break

                const chunk = decoder.decode(value)
                const lines = chunk.split('\n')

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6))
                            if (data.chunk) {
                                fullContent += data.chunk
                                setStreamingContent(fullContent)
                            }
                            if (data.done) {
                                if (data.source_chunks) sources = data.source_chunks
                                if (data.confidence) confidence = data.confidence
                                if (data.grounding_warning) groundingWarning = data.grounding_warning
                            }
                        } catch { }
                    }
                }
            }

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: fullContent,
                sources,
                confidence,
                groundingWarning: groundingWarning || undefined,
            }

            setMessages(prev => [...prev, assistantMessage])
            setStreamingContent('')

        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const getConfidenceColor = (confidence: string) => {
        switch (confidence) {
            case 'high': return 'text-emerald-400 bg-emerald-500/20'
            case 'medium': return 'text-amber-400 bg-amber-500/20'
            case 'low': return 'text-red-400 bg-red-500/20'
            default: return 'text-slate-400 bg-slate-500/20'
        }
    }

    if (error && !session) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">Session not found</h2>
                <Link
                    href="/sessions"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Sessions
                </Link>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-4">
                    <Link
                        href="/sessions"
                        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-white font-semibold">{session?.name || 'Session'}</h1>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                            <FileText className="w-3 h-3" />
                            {documents.length} document{documents.length !== 1 ? 's' : ''}
                        </div>
                    </div>
                </div>

                {/* Tools */}
                <div className="flex items-center gap-2">
                    {/* Intelligence Mode */}
                    <div className="relative">
                        <button
                            onClick={() => setShowModeSelector(!showModeSelector)}
                            className={cn(
                                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all",
                                intelligenceMode !== 'default'
                                    ? "bg-indigo-500/20 text-indigo-400"
                                    : "bg-slate-800 text-slate-400 hover:text-white"
                            )}
                        >
                            <Sparkles className="w-4 h-4" />
                            {showModeSelector ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        {showModeSelector && (
                            <div className="absolute right-0 top-full mt-2 w-56 bg-slate-800 rounded-xl border border-slate-700 shadow-xl z-50">
                                {INTELLIGENCE_MODES.map((mode) => {
                                    const ModeIcon = mode.icon
                                    return (
                                        <button
                                            key={mode.id}
                                            onClick={() => {
                                                setIntelligenceMode(mode.id)
                                                setShowModeSelector(false)
                                            }}
                                            className={cn(
                                                "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-700/50 transition-colors first:rounded-t-xl last:rounded-b-xl",
                                                intelligenceMode === mode.id ? "bg-indigo-500/20" : ""
                                            )}
                                        >
                                            <ModeIcon className="w-4 h-4 text-slate-400" />
                                            <div>
                                                <div className="text-sm font-medium text-white">{mode.name}</div>
                                                <div className="text-xs text-slate-500">{mode.description}</div>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    {/* Generate */}
                    <div className="relative">
                        <button
                            onClick={() => setShowGenerateMenu(!showGenerateMenu)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm"
                        >
                            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                        </button>

                        {showGenerateMenu && (
                            <div className="absolute right-0 top-full mt-2 w-40 bg-slate-800 rounded-xl border border-slate-700 shadow-xl z-50">
                                {['notes', 'flashcards', 'mcqs', 'faqs'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => handleGenerate(type)}
                                        disabled={generating !== null}
                                        className="w-full px-4 py-2 text-left text-sm text-white hover:bg-slate-700/50 first:rounded-t-xl last:rounded-b-xl"
                                    >
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Documents Bar */}
            <div className="py-3 border-b border-slate-800 overflow-x-auto">
                <div className="flex items-center gap-2">
                    {documents.map((doc) => (
                        <div
                            key={doc.id}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 text-sm"
                        >
                            <FileText className="w-3 h-3 text-indigo-400" />
                            <span className="text-slate-300 truncate max-w-[150px]">
                                {doc.file_path?.split('/').pop() || doc.title}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto py-6 space-y-6">
                {messages.length === 0 && !loading && (
                    <div className="text-center text-slate-400 py-12">
                        <Bot className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                        <h3 className="text-lg font-semibold text-white mb-2">Start chatting</h3>
                        <p>Ask questions about your {documents.length} documents</p>
                    </div>
                )}

                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={cn(
                            "flex gap-4",
                            message.role === 'user' ? "justify-end" : "justify-start"
                        )}
                    >
                        {message.role === 'assistant' && (
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                                <Bot className="w-4 h-4 text-indigo-400" />
                            </div>
                        )}
                        <div
                            className={cn(
                                "max-w-[80%] rounded-2xl px-4 py-3",
                                message.role === 'user'
                                    ? "bg-indigo-500 text-white"
                                    : "bg-slate-800 text-slate-200"
                            )}
                        >
                            <div className="whitespace-pre-wrap">{message.content}</div>

                            {message.confidence && message.role === 'assistant' && (
                                <div className="mt-2">
                                    <span className={cn(
                                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs",
                                        getConfidenceColor(message.confidence)
                                    )}>
                                        <Shield className="w-3 h-3" />
                                        {message.confidence} confidence
                                    </span>
                                </div>
                            )}

                            {message.sources && message.sources.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-slate-700">
                                    <button
                                        onClick={() => setShowSources(showSources === message.id ? null : message.id)}
                                        className="text-xs text-indigo-400 hover:text-indigo-300"
                                    >
                                        {showSources === message.id ? 'Hide sources' : `${message.sources.length} sources`}
                                    </button>

                                    {showSources === message.id && (
                                        <div className="mt-2 space-y-2">
                                            {message.sources.map((source, idx) => (
                                                <div key={idx} className="text-xs p-2 bg-slate-900 rounded-lg text-slate-400">
                                                    <div className="text-indigo-400 mb-1">
                                                        {(source.similarity * 100).toFixed(1)}% match
                                                        {source.page_number && ` • Page ${source.page_number}`}
                                                    </div>
                                                    <div className="line-clamp-2">{source.text}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        {message.role === 'user' && (
                            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                <User className="w-4 h-4 text-purple-400" />
                            </div>
                        )}
                    </div>
                ))}

                {streamingContent && (
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 text-indigo-400" />
                        </div>
                        <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-slate-800 text-slate-200">
                            <div className="whitespace-pre-wrap">{streamingContent}</div>
                        </div>
                    </div>
                )}

                {loading && !streamingContent && (
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 text-indigo-400" />
                        </div>
                        <div className="rounded-2xl px-4 py-3 bg-slate-800">
                            <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="pt-4 border-t border-slate-800">
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask across all documents..."
                        disabled={loading}
                        className="flex-1 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                </div>
            </form>
        </div>
    )
}
