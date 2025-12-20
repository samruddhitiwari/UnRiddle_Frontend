'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
    Send, Loader2, FileText, ArrowLeft, AlertCircle, Bot, User,
    Sparkles, BookOpen, HelpCircle, GraduationCap, Briefcase,
    Shield, ShieldCheck, ShieldAlert, Download, Zap, Lock,
    FileDown, ChevronDown, ChevronUp
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

            const data = await response.json()
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
                groundingWarning,
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
                <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">Document not found</h2>
                <p className="text-slate-400 mb-6">This document may have been deleted or you don't have access.</p>
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
            {/* Header with Intelligence Mode */}
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard"
                        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                            <h1 className="text-white font-semibold">
                                {document?.file_path?.split('/').pop() || 'Document'}
                            </h1>
                            <div className={cn(
                                "text-xs px-2 py-0.5 rounded-full inline-block",
                                document?.status === 'ready'
                                    ? "bg-emerald-500/20 text-emerald-400"
                                    : "bg-amber-500/20 text-amber-400"
                            )}>
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
                            className={cn(
                                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all",
                                intelligenceMode !== 'default'
                                    ? "bg-indigo-500/20 text-indigo-400"
                                    : "bg-slate-800 text-slate-400 hover:text-white"
                            )}
                        >
                            <Sparkles className="w-4 h-4" />
                            <span className="hidden sm:inline">
                                {INTELLIGENCE_MODES.find(m => m.id === intelligenceMode)?.name}
                            </span>
                            {showModeSelector ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        {showModeSelector && (
                            <div className="absolute right-0 top-full mt-2 w-64 bg-slate-800 rounded-xl border border-slate-700 shadow-xl z-50">
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
                                            className={cn(
                                                "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-700/50 transition-colors first:rounded-t-xl last:rounded-b-xl",
                                                intelligenceMode === mode.id ? "bg-indigo-500/20" : ""
                                            )}
                                        >
                                            <ModeIcon className={cn(
                                                "w-5 h-5",
                                                intelligenceMode === mode.id ? "text-indigo-400" : "text-slate-400"
                                            )} />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className={cn(
                                                        "font-medium",
                                                        intelligenceMode === mode.id ? "text-indigo-400" : "text-white"
                                                    )}>
                                                        {mode.name}
                                                    </span>
                                                    {needsPremium && (
                                                        <Lock className="w-3 h-3 text-amber-400" />
                                                    )}
                                                </div>
                                                <p className="text-xs text-slate-500">{mode.description}</p>
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
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm hover:from-indigo-600 hover:to-purple-700 transition-all disabled:opacity-50"
                        >
                            {generating ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Zap className="w-4 h-4" />
                            )}
                            <span className="hidden sm:inline">Generate</span>
                        </button>

                        {showGenerateMenu && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 rounded-xl border border-slate-700 shadow-xl z-50">
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
                                            className="w-full flex items-center gap-3 px-4 py-3 text-left text-white hover:bg-slate-700/50 transition-colors first:rounded-t-xl last:rounded-b-xl disabled:opacity-50"
                                        >
                                            <ItemIcon className="w-4 h-4 text-indigo-400" />
                                            <span>{item.name}</span>
                                            {!isPaidUser && <Lock className="w-3 h-3 text-amber-400 ml-auto" />}
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
                    <div className="text-center text-slate-400 py-12">
                        {document?.status === 'ready' ? (
                            <>
                                <Bot className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                                <h3 className="text-lg font-semibold text-white mb-2">Start a conversation</h3>
                                <p className="mb-4">Ask any question about your document</p>
                                <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
                                    {['Summarize this document', 'What are the key points?', 'Explain the main concepts'].map((suggestion) => (
                                        <button
                                            key={suggestion}
                                            onClick={() => setInput(suggestion)}
                                            className="px-3 py-1.5 text-sm rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </>
                        ) : document?.status === 'failed' ? (
                            <>
                                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
                                <h3 className="text-lg font-semibold text-white mb-2">Processing Failed</h3>
                                <p className="mb-4">{document?.error_message || 'An error occurred while processing'}</p>
                                <button
                                    onClick={handleProcessDocument}
                                    disabled={processing}
                                    className="px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-all disabled:opacity-50"
                                >
                                    {processing ? 'Retrying...' : 'Retry Processing'}
                                </button>
                            </>
                        ) : (
                            <>
                                <Loader2 className="w-16 h-16 mx-auto mb-4 text-indigo-400 animate-spin" />
                                <h3 className="text-lg font-semibold text-white mb-2">
                                    Document is {document?.status || 'loading'}...
                                </h3>
                                <p className="mb-4">This may take a minute for large documents</p>
                                {(document?.status === 'uploaded' || document?.status === 'indexing') && (
                                    <button
                                        onClick={handleProcessDocument}
                                        disabled={processing}
                                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium transition-all disabled:opacity-50"
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

                            {/* Confidence Badge */}
                            {message.confidence && message.role === 'assistant' && (
                                <div className="mt-3 flex items-center gap-2">
                                    {(() => {
                                        const ConfIcon = getConfidenceIcon(message.confidence)
                                        return (
                                            <span className={cn(
                                                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs",
                                                getConfidenceColor(message.confidence)
                                            )}>
                                                <ConfIcon className="w-3 h-3" />
                                                {message.confidence.charAt(0).toUpperCase() + message.confidence.slice(1)} confidence
                                            </span>
                                        )
                                    })()}
                                </div>
                            )}

                            {/* Grounding Warning */}
                            {message.groundingWarning && (
                                <div className="mt-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs">
                                    ⚠️ {message.groundingWarning}
                                </div>
                            )}

                            {/* Sources */}
                            {message.sources && message.sources.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-slate-700">
                                    <button
                                        onClick={() => setShowSources(showSources === message.id ? null : message.id)}
                                        className="text-xs text-indigo-400 hover:text-indigo-300"
                                    >
                                        {showSources === message.id ? 'Hide sources' : `View ${message.sources.length} source${message.sources.length > 1 ? 's' : ''}`}
                                    </button>

                                    {showSources === message.id && (
                                        <div className="mt-2 space-y-2">
                                            {message.sources.map((source, idx) => (
                                                <div
                                                    key={idx}
                                                    className="text-xs p-2 bg-slate-900 rounded-lg text-slate-400"
                                                >
                                                    <div className="flex items-center gap-2 text-indigo-400 mb-1">
                                                        <span>Relevance: {(source.similarity * 100).toFixed(1)}%</span>
                                                        {source.page_number && (
                                                            <span className="text-slate-500">• Page {source.page_number}</span>
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
                            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                <User className="w-4 h-4 text-purple-400" />
                            </div>
                        )}
                    </div>
                ))}

                {/* Streaming response */}
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

            {/* Error */}
            {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                    {error}
                </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="pt-4 border-t border-slate-800">
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
                        className="flex-1 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim() || document?.status !== 'ready'}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-indigo-500/30"
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
