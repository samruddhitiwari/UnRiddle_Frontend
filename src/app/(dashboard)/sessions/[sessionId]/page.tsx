'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
    Send, Loader2, FileText, ArrowLeft, AlertCircle, Bot, User,
    Sparkles, BookOpen, HelpCircle, GraduationCap, Briefcase,
    Shield, Zap, ChevronDown, ChevronUp
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

    const getConfidenceStyle = (confidence: string) => {
        switch (confidence) {
            case 'high': return { bg: 'var(--bg-mint)', color: 'var(--accent-teal)' }
            case 'medium': return { bg: 'var(--bg-pale-yellow)', color: 'var(--text-primary)' }
            case 'low': return { bg: '#FFF0F0', color: '#CC0000' }
            default: return { bg: 'var(--bg-cream)', color: 'var(--text-muted)' }
        }
    }

    if (error && !session) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <AlertCircle className="w-16 h-16 mb-4" style={{ color: '#CC0000' }} />
                <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Session not found</h2>
                <Link href="/sessions" className="btn-primary">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Sessions
                </Link>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
            {/* Header */}
            <div
                className="flex items-center justify-between gap-4 pb-4"
                style={{ borderBottom: '2px solid var(--border-dark)' }}
            >
                <div className="flex items-center gap-4">
                    <Link
                        href="/sessions"
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        style={{
                            border: '2px solid var(--border-dark)',
                            color: 'var(--text-body)'
                        }}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{session?.name || 'Session'}</h1>
                        <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
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
                            className="flex items-center gap-2 px-3 py-2 text-sm transition-all"
                            style={{
                                backgroundColor: intelligenceMode !== 'default' ? 'var(--bg-mint)' : 'var(--bg-white)',
                                border: '2px solid var(--border-dark)',
                                borderRadius: '8px',
                                color: 'var(--text-primary)'
                            }}
                        >
                            <Sparkles className="w-4 h-4" />
                            {showModeSelector ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        {showModeSelector && (
                            <div
                                className="brutalist-card absolute right-0 top-full mt-2 w-56 z-50"
                                style={{ backgroundColor: 'var(--bg-white)' }}
                            >
                                {INTELLIGENCE_MODES.map((mode) => {
                                    const ModeIcon = mode.icon
                                    return (
                                        <button
                                            key={mode.id}
                                            onClick={() => {
                                                setIntelligenceMode(mode.id)
                                                setShowModeSelector(false)
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                                            style={{
                                                backgroundColor: intelligenceMode === mode.id ? 'var(--bg-mint)' : 'transparent',
                                                borderBottom: '1px solid var(--border-dark)'
                                            }}
                                        >
                                            <ModeIcon className="w-4 h-4" style={{ color: 'var(--text-body)' }} />
                                            <div>
                                                <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{mode.name}</div>
                                                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{mode.description}</div>
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
                            className="btn-primary text-sm py-2 px-3"
                        >
                            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                        </button>

                        {showGenerateMenu && (
                            <div
                                className="brutalist-card absolute right-0 top-full mt-2 w-40 z-50"
                                style={{ backgroundColor: 'var(--bg-white)' }}
                            >
                                {['notes', 'flashcards', 'mcqs', 'faqs'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => handleGenerate(type)}
                                        disabled={generating !== null}
                                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 disabled:opacity-50"
                                        style={{
                                            color: 'var(--text-primary)',
                                            borderBottom: '1px solid var(--border-dark)'
                                        }}
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
            <div className="py-3 overflow-x-auto" style={{ borderBottom: '2px solid var(--border-dark)' }}>
                <div className="flex items-center gap-2">
                    {documents.map((doc) => (
                        <div
                            key={doc.id}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm"
                            style={{
                                backgroundColor: 'var(--bg-lavender)',
                                border: '2px solid var(--border-dark)',
                                borderRadius: '8px'
                            }}
                        >
                            <FileText className="w-3 h-3" style={{ color: 'var(--text-primary)' }} />
                            <span className="truncate max-w-[150px]" style={{ color: 'var(--text-primary)' }}>
                                {doc.file_path?.split('/').pop() || doc.title}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto py-6 space-y-6">
                {messages.length === 0 && !loading && (
                    <div className="text-center py-12" style={{ color: 'var(--text-body)' }}>
                        <Bot className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
                        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Start chatting</h3>
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
                            <div
                                className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                                style={{
                                    backgroundColor: 'var(--bg-mint)',
                                    border: '2px solid var(--border-dark)',
                                    borderRadius: '8px'
                                }}
                            >
                                <Bot className="w-4 h-4" style={{ color: 'var(--text-primary)' }} />
                            </div>
                        )}
                        <div
                            className="max-w-[80%] px-4 py-3"
                            style={{
                                backgroundColor: message.role === 'user' ? 'var(--accent-coral)' : 'var(--bg-white)',
                                border: '2px solid var(--border-dark)',
                                borderRadius: '12px',
                                boxShadow: 'var(--shadow-offset-sm)',
                                color: 'var(--text-primary)'
                            }}
                        >
                            <div className="whitespace-pre-wrap">{message.content}</div>

                            {message.confidence && message.role === 'assistant' && (
                                <div className="mt-2">
                                    {(() => {
                                        const style = getConfidenceStyle(message.confidence)
                                        return (
                                            <span
                                                className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold"
                                                style={{
                                                    backgroundColor: style.bg,
                                                    border: '1.5px solid var(--border-dark)',
                                                    borderRadius: '4px',
                                                    color: style.color
                                                }}
                                            >
                                                <Shield className="w-3 h-3" />
                                                {message.confidence} confidence
                                            </span>
                                        )
                                    })()}
                                </div>
                            )}

                            {message.sources && message.sources.length > 0 && (
                                <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border-dark)' }}>
                                    <button
                                        onClick={() => setShowSources(showSources === message.id ? null : message.id)}
                                        className="text-xs font-medium hover:underline underline-offset-4"
                                        style={{ color: 'var(--accent-coral)' }}
                                    >
                                        {showSources === message.id ? 'Hide sources' : `${message.sources.length} sources`}
                                    </button>

                                    {showSources === message.id && (
                                        <div className="mt-2 space-y-2">
                                            {message.sources.map((source, idx) => (
                                                <div
                                                    key={idx}
                                                    className="text-xs p-2"
                                                    style={{
                                                        backgroundColor: 'var(--bg-cream)',
                                                        border: '1px solid var(--border-dark)',
                                                        borderRadius: '6px',
                                                        color: 'var(--text-body)'
                                                    }}
                                                >
                                                    <div className="mb-1 font-medium" style={{ color: 'var(--accent-coral)' }}>
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
                            <div
                                className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                                style={{
                                    backgroundColor: 'var(--bg-lavender)',
                                    border: '2px solid var(--border-dark)',
                                    borderRadius: '8px'
                                }}
                            >
                                <User className="w-4 h-4" style={{ color: 'var(--text-primary)' }} />
                            </div>
                        )}
                    </div>
                ))}

                {streamingContent && (
                    <div className="flex gap-4">
                        <div
                            className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                            style={{
                                backgroundColor: 'var(--bg-mint)',
                                border: '2px solid var(--border-dark)',
                                borderRadius: '8px'
                            }}
                        >
                            <Bot className="w-4 h-4" style={{ color: 'var(--text-primary)' }} />
                        </div>
                        <div
                            className="max-w-[80%] px-4 py-3"
                            style={{
                                backgroundColor: 'var(--bg-white)',
                                border: '2px solid var(--border-dark)',
                                borderRadius: '12px',
                                color: 'var(--text-primary)'
                            }}
                        >
                            <div className="whitespace-pre-wrap">{streamingContent}</div>
                        </div>
                    </div>
                )}

                {loading && !streamingContent && (
                    <div className="flex gap-4">
                        <div
                            className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                            style={{
                                backgroundColor: 'var(--bg-mint)',
                                border: '2px solid var(--border-dark)',
                                borderRadius: '8px'
                            }}
                        >
                            <Bot className="w-4 h-4" style={{ color: 'var(--text-primary)' }} />
                        </div>
                        <div
                            className="px-4 py-3"
                            style={{
                                backgroundColor: 'var(--bg-white)',
                                border: '2px solid var(--border-dark)',
                                borderRadius: '12px'
                            }}
                        >
                            <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--accent-coral)' }} />
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {error && (
                <div
                    className="mb-4 p-3 text-sm"
                    style={{
                        backgroundColor: '#FFF0F0',
                        border: '2px solid #FF6B6B',
                        borderRadius: '8px',
                        color: '#CC0000'
                    }}
                >
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="pt-4" style={{ borderTop: '2px solid var(--border-dark)' }}>
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask across all documents..."
                        disabled={loading}
                        className="flex-1 px-4 py-3 focus:outline-none disabled:opacity-50"
                        style={{
                            backgroundColor: 'var(--bg-white)',
                            border: '2px solid var(--border-dark)',
                            borderRadius: '8px',
                            color: 'var(--text-primary)'
                        }}
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="btn-primary disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                </div>
            </form>
        </div>
    )
}
