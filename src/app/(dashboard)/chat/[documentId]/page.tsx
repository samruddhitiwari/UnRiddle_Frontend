'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
    Send, Loader2, FileText, ArrowLeft, AlertCircle, Bot, User,
    Sparkles, BookOpen, HelpCircle, GraduationCap, Briefcase,
    Shield, ShieldCheck, ShieldAlert, Zap, Lock,
    ChevronDown, ChevronUp
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    sources?: { chunk_id: string; text: string; similarity: number; page_number?: number }[]
    confidence?: string
    groundingWarning?: string
}

interface IntelligenceMode {
    id: string
    name: string
    description: string
    icon: any
}

const INTELLIGENCE_MODES: IntelligenceMode[] = [
    { id: 'default', name: 'Default', description: 'Balanced, accurate answers', icon: Bot },
    { id: 'eli5', name: 'Explain Simply', description: 'Simple explanations with analogies', icon: HelpCircle },
    { id: 'technical', name: 'Technical', description: 'Detailed technical explanations', icon: Sparkles },
    { id: 'exam', name: 'Exam-Oriented', description: 'Focus on testable concepts', icon: GraduationCap },
    { id: 'executive', name: 'Executive', description: 'Concise, high-level insights', icon: Briefcase },
    { id: 'legal', name: 'Legal/Technical', description: 'Precise legal terminology', icon: FileText },
]

export default function ChatPage() {
    const params = useParams()
    const router = useRouter()
    const documentId = params.documentId as string

    const [document, setDocument] = useState<any>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [processing, setProcessing] = useState(false)
    const [streamingContent, setStreamingContent] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [showSources, setShowSources] = useState<string | null>(null)

    // New commercial features state
    const [intelligenceMode, setIntelligenceMode] = useState('default')
    const [showModeSelector, setShowModeSelector] = useState(false)
    const [userPlan, setUserPlan] = useState<any>(null)
    const [generating, setGenerating] = useState<string | null>(null)
    const [showGenerateMenu, setShowGenerateMenu] = useState(false)
    const [latestConfidence, setLatestConfidence] = useState<string | null>(null)
    const [latestWarning, setLatestWarning] = useState<string | null>(null)

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const supabase = createClient()

    // Check if user has premium features
    const isPaidUser = userPlan?.plan_type && userPlan.plan_type !== 'free'

    useEffect(() => {
        const fetchDocument = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) return router.push('/login')

            // Fetch user plan info
            const { data: userData } = await supabase
                .from('users')
                .select('*')
                .eq('id', session.user.id)
                .single()
            setUserPlan(userData)

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/documents/${documentId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${session.access_token}`,
                    },
                }
            )

            if (!response.ok) {
                setError('Document not found')
                return
            }

            const data = await response.json()
            setDocument(data)
        }

        fetchDocument()
    }, [documentId])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, streamingContent])

    // Auto-refresh document status if not ready
    useEffect(() => {
        if (document && document.status !== 'ready' && document.status !== 'failed') {
            const interval = setInterval(async () => {
                const { data: { session } } = await supabase.auth.getSession()
                if (!session) return

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/documents/${documentId}`,
                    { headers: { 'Authorization': `Bearer ${session.access_token}` } }
                )
                if (response.ok) {
                    const data = await response.json()
                    setDocument(data)
                    if (data.status === 'ready' || data.status === 'failed') {
                        clearInterval(interval)
                    }
                }
            }, 3000)
            return () => clearInterval(interval)
        }
    }, [document, documentId])

    const handleProcessDocument = async () => {
        setProcessing(true)
        setError(null)

        try {
            const { data: { session } } = await supabase.auth.getSession()

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/documents/${documentId}/process`,
                {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${session?.access_token}` }
                }
            )

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.detail || 'Processing failed')
            }

            setDocument({ ...document, status: 'ready' })
        } catch (err: any) {
            setError(err.message)
        } finally {
            setProcessing(false)
        }
    }

    const handleGenerate = async (outputType: string) => {
        if (!isPaidUser) {
            router.push('/subscription')
            return
        }

        setGenerating(outputType)
        setShowGenerateMenu(false)

        try {
            const { data: { session } } = await supabase.auth.getSession()

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/generate/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session?.access_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    document_id: documentId,
                    output_type: outputType,
                }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                if (errorData.detail?.error === 'feature_locked') {
                    router.push('/subscription')
                    return
                }
                throw new Error(errorData.detail?.message || 'Generation failed')
            }

            const data = await response.json()

            // Add the generated content as a message
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
        setLatestConfidence(null)
        setLatestWarning(null)

        try {
            const { data: { session } } = await supabase.auth.getSession()

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/query/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session?.access_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    document_id: documentId,
                    user_query: userMessage.content,
                    intelligence_mode: intelligenceMode,
                    grounding_mode: 'document_only',
                }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                if (errorData.detail?.error === 'query_limit_exceeded' ||
                    errorData.detail?.error === 'message_limit_exceeded') {
                    router.push('/subscription')
                    return
                }
                if (errorData.detail?.error === 'feature_locked') {
                    setIntelligenceMode('default')
                    throw new Error('This feature requires a paid subscription')
                }
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

            setLatestConfidence(confidence)
            setLatestWarning(groundingWarning)

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

    const getConfidenceIcon = (confidence: string) => {
        switch (confidence) {
            case 'high': return ShieldCheck
            case 'medium': return Shield
            case 'low': return ShieldAlert
            default: return Shield
        }
    }

    if (error && !document) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <AlertCircle className="w-16 h-16 mb-4" style={{ color: '#CC0000' }} />
                <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Document not found</h2>
                <p className="mb-6" style={{ color: 'var(--text-body)' }}>This document may have been deleted or you don&apos;t have access.</p>
                <Link href="/dashboard" className="btn-primary">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
            {/* Header with Intelligence Mode */}
            <div
                className="flex items-center justify-between gap-4 pb-4"
                style={{ borderBottom: '2px solid var(--border-dark)' }}
            >
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard"
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        style={{
                            border: '2px solid var(--border-dark)',
                            color: 'var(--text-body)'
                        }}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 flex items-center justify-center"
                            style={{
                                backgroundColor: 'var(--bg-peach)',
                                border: '2px solid var(--border-dark)',
                                borderRadius: '8px'
                            }}
                        >
                            <FileText className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
                        </div>
                        <div>
                            <h1 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                                {document?.file_path?.split('/').pop() || 'Document'}
                            </h1>
                            <div
                                className="text-xs px-2 py-0.5 inline-block font-semibold"
                                style={{
                                    backgroundColor: document?.status === 'ready' ? 'var(--bg-mint)' : 'var(--bg-pale-yellow)',
                                    border: '1.5px solid var(--border-dark)',
                                    borderRadius: '4px',
                                    color: 'var(--text-primary)'
                                }}
                            >
                                {document?.status || 'loading'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Intelligence Mode & Generate Buttons */}
                <div className="flex items-center gap-2">
                    {/* Intelligence Mode Selector */}
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
                            <span className="hidden sm:inline">
                                {INTELLIGENCE_MODES.find(m => m.id === intelligenceMode)?.name}
                            </span>
                            {showModeSelector ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        {showModeSelector && (
                            <div
                                className="brutalist-card absolute right-0 top-full mt-2 w-64 z-50"
                                style={{ backgroundColor: 'var(--bg-white)' }}
                            >
                                {INTELLIGENCE_MODES.map((mode) => {
                                    const ModeIcon = mode.icon
                                    const needsPremium = mode.id !== 'default' && !isPaidUser
                                    return (
                                        <button
                                            key={mode.id}
                                            onClick={() => {
                                                if (needsPremium) {
                                                    router.push('/subscription')
                                                } else {
                                                    setIntelligenceMode(mode.id)
                                                    setShowModeSelector(false)
                                                }
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                                            style={{
                                                backgroundColor: intelligenceMode === mode.id ? 'var(--bg-mint)' : 'transparent',
                                                borderBottom: '1px solid var(--border-dark)'
                                            }}
                                        >
                                            <ModeIcon className="w-5 h-5" style={{ color: 'var(--text-body)' }} />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                                                        {mode.name}
                                                    </span>
                                                    {needsPremium && (
                                                        <Lock className="w-3 h-3" style={{ color: 'var(--accent-coral)' }} />
                                                    )}
                                                </div>
                                                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{mode.description}</p>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    {/* Generate Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowGenerateMenu(!showGenerateMenu)}
                            disabled={document?.status !== 'ready'}
                            className="btn-primary text-sm py-2 px-3 disabled:opacity-50"
                        >
                            {generating ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Zap className="w-4 h-4" />
                            )}
                            <span className="hidden sm:inline">Generate</span>
                        </button>

                        {showGenerateMenu && (
                            <div
                                className="brutalist-card absolute right-0 top-full mt-2 w-48 z-50"
                                style={{ backgroundColor: 'var(--bg-white)' }}
                            >
                                {[
                                    { id: 'notes', name: 'Study Notes', icon: BookOpen },
                                    { id: 'flashcards', name: 'Flashcards', icon: FileText },
                                    { id: 'mcqs', name: 'MCQ Quiz', icon: GraduationCap },
                                    { id: 'faqs', name: 'FAQ', icon: HelpCircle },
                                ].map((item) => {
                                    const ItemIcon = item.icon
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => handleGenerate(item.id)}
                                            disabled={generating !== null}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors disabled:opacity-50"
                                            style={{
                                                color: 'var(--text-primary)',
                                                borderBottom: '1px solid var(--border-dark)'
                                            }}
                                        >
                                            <ItemIcon className="w-4 h-4" style={{ color: 'var(--accent-coral)' }} />
                                            <span>{item.name}</span>
                                            {!isPaidUser && <Lock className="w-3 h-3 ml-auto" style={{ color: 'var(--accent-coral)' }} />}
                                        </button>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto py-6 space-y-6">
                {messages.length === 0 && !loading && (
                    <div className="text-center py-12" style={{ color: 'var(--text-body)' }}>
                        {document?.status === 'ready' ? (
                            <>
                                <Bot className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
                                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Start a conversation</h3>
                                <p className="mb-4">Ask any question about your document</p>
                                <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
                                    {['Summarize this document', 'What are the key points?', 'Explain the main concepts'].map((suggestion) => (
                                        <button
                                            key={suggestion}
                                            onClick={() => setInput(suggestion)}
                                            className="px-3 py-1.5 text-sm transition-colors"
                                            style={{
                                                backgroundColor: 'var(--bg-white)',
                                                border: '2px solid var(--border-dark)',
                                                borderRadius: '999px',
                                                color: 'var(--text-primary)'
                                            }}
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </>
                        ) : document?.status === 'failed' ? (
                            <>
                                <AlertCircle className="w-16 h-16 mx-auto mb-4" style={{ color: '#CC0000' }} />
                                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Processing Failed</h3>
                                <p className="mb-4">{document?.error_message || 'An error occurred while processing'}</p>
                                <button
                                    onClick={handleProcessDocument}
                                    disabled={processing}
                                    className="btn-primary disabled:opacity-50"
                                >
                                    {processing ? 'Retrying...' : 'Retry Processing'}
                                </button>
                            </>
                        ) : (
                            <>
                                <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin" style={{ color: 'var(--accent-coral)' }} />
                                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                                    Document is {document?.status || 'loading'}...
                                </h3>
                                <p className="mb-4">This may take a minute for large documents</p>
                                {(document?.status === 'uploaded' || document?.status === 'indexing') && (
                                    <button
                                        onClick={handleProcessDocument}
                                        disabled={processing}
                                        className="btn-primary disabled:opacity-50"
                                    >
                                        {processing ? 'Processing...' : document?.status === 'indexing' ? 'Retry Processing' : 'Process Now'}
                                    </button>
                                )}
                            </>
                        )}
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

                            {/* Confidence Badge */}
                            {message.confidence && message.role === 'assistant' && (
                                <div className="mt-3 flex items-center gap-2">
                                    {(() => {
                                        const ConfIcon = getConfidenceIcon(message.confidence)
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
                                                <ConfIcon className="w-3 h-3" />
                                                {message.confidence.charAt(0).toUpperCase() + message.confidence.slice(1)} confidence
                                            </span>
                                        )
                                    })()}
                                </div>
                            )}

                            {/* Grounding Warning */}
                            {message.groundingWarning && (
                                <div
                                    className="mt-2 p-2 text-xs"
                                    style={{
                                        backgroundColor: 'var(--bg-pale-yellow)',
                                        border: '1.5px solid var(--border-dark)',
                                        borderRadius: '6px',
                                        color: 'var(--text-primary)'
                                    }}
                                >
                                    ⚠️ {message.groundingWarning}
                                </div>
                            )}

                            {/* Sources */}
                            {message.sources && message.sources.length > 0 && (
                                <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border-dark)' }}>
                                    <button
                                        onClick={() => setShowSources(showSources === message.id ? null : message.id)}
                                        className="text-xs font-medium hover:underline underline-offset-4"
                                        style={{ color: 'var(--accent-coral)' }}
                                    >
                                        {showSources === message.id ? 'Hide sources' : `View ${message.sources.length} source${message.sources.length > 1 ? 's' : ''}`}
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
                                                    <div className="flex items-center gap-2 mb-1 font-medium" style={{ color: 'var(--accent-coral)' }}>
                                                        <span>Relevance: {(source.similarity * 100).toFixed(1)}%</span>
                                                        {source.page_number && (
                                                            <span style={{ color: 'var(--text-muted)' }}>• Page {source.page_number}</span>
                                                        )}
                                                    </div>
                                                    <div className="line-clamp-3">{source.text}</div>
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

                {/* Streaming response */}
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

            {/* Error */}
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

            {/* Input */}
            <form onSubmit={handleSubmit} className="pt-4" style={{ borderTop: '2px solid var(--border-dark)' }}>
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={
                            !document
                                ? "Loading document..."
                                : document.status !== 'ready'
                                    ? `Document is ${document.status}... Please wait.`
                                    : "Ask a question about your document..."
                        }
                        disabled={loading || (document && document.status !== 'ready')}
                        className="flex-1 px-4 py-3 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                            backgroundColor: 'var(--bg-white)',
                            border: '2px solid var(--border-dark)',
                            borderRadius: '8px',
                            color: 'var(--text-primary)'
                        }}
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim() || document?.status !== 'ready'}
                        className="btn-primary disabled:opacity-50"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}
