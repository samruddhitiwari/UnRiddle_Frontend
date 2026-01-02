'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Upload, File, X, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { cn, formatBytes } from '@/lib/utils'

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [dragActive, setDragActive] = useState(false)

    const [processingStage, setProcessingStage] = useState<string>('')

    const router = useRouter()
    const supabase = createClient()

    // Helper to get processing stage description based on progress
    const getProcessingStage = (progress: number): string => {
        if (progress < 20) return 'Starting processing...'
        if (progress < 30) return 'Downloading document...'
        if (progress < 40) return 'Extracting text from PDF...'
        if (progress < 50) return 'Cleaning and preparing text...'
        if (progress < 95) return 'Creating AI embeddings...'
        return 'Finalizing...'
    }

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        setError(null)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0]
            if (droppedFile.type === 'application/pdf') {
                setFile(droppedFile)
            } else {
                setError('Only PDF files are allowed')
            }
        }
    }, [])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null)
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0]
            if (selectedFile.type === 'application/pdf') {
                setFile(selectedFile)
            } else {
                setError('Only PDF files are allowed')
            }
        }
    }

    // Poll for document status
    const pollDocumentStatus = async (documentId: string, accessToken: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            const poll = async () => {
                try {
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_BACKEND_URL}/documents/${documentId}/status`,
                        {
                            headers: {
                                'Authorization': `Bearer ${accessToken}`,
                            },
                        }
                    )

                    if (!response.ok) {
                        throw new Error('Failed to get document status')
                    }

                    const data = await response.json()
                    const progress = data.progress_percentage || 0

                    setProgress(progress)
                    setProcessingStage(getProcessingStage(progress))

                    if (data.status === 'ready') {
                        setProgress(100)
                        resolve()
                    } else if (data.status === 'failed') {
                        reject(new Error(data.error_message || 'Processing failed'))
                    } else {
                        // Continue polling every 2 seconds
                        setTimeout(poll, 2000)
                    }
                } catch (err) {
                    reject(err)
                }
            }

            // Start polling
            poll()
        })
    }

    const handleUpload = async () => {
        if (!file) return

        setUploading(true)
        setProgress(0)
        setProcessingStage('Uploading document...')
        setError(null)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                throw new Error('Please sign in to upload documents')
            }

            const formData = new FormData()
            formData.append('file', file)

            const { data: { session } } = await supabase.auth.getSession()

            // Upload file
            setProgress(5)
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/documents/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session?.access_token}`,
                },
                body: formData,
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.detail?.message || data.detail || 'Upload failed')
            }

            const data = await response.json()
            setProgress(10)
            setProcessingStage('Document uploaded. Starting processing...')

            // Poll for processing status
            await pollDocumentStatus(data.id, session?.access_token || '')

            setSuccess(true)

            // Redirect to chat after delay
            setTimeout(() => {
                router.push(`/chat/${data.id}`)
            }, 1500)

        } catch (err: any) {
            setError(err.message)
            setProgress(0)
            setProcessingStage('')
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="heading-lg">Upload Document</h1>
                <p className="body-md mt-1" style={{ color: 'var(--text-muted)' }}>
                    Upload a PDF to start chatting with your document
                </p>
            </div>

            {/* Upload Zone */}
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={cn(
                    "brutalist-card relative p-12 transition-all",
                    dragActive && "translate-x-[-2px] translate-y-[-2px]"
                )}
                style={{
                    backgroundColor: file ? 'var(--bg-mint)' : 'var(--bg-white)',
                    borderStyle: file ? 'solid' : 'dashed'
                }}
            >
                {!file ? (
                    <div className="text-center">
                        <div
                            className="w-16 h-16 mx-auto flex items-center justify-center mb-6"
                            style={{
                                backgroundColor: 'var(--bg-cream)',
                                border: '2px solid var(--border-dark)',
                                borderRadius: '12px'
                            }}
                        >
                            <Upload className="w-8 h-8" style={{ color: 'var(--text-body)' }} />
                        </div>
                        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                            Drop your PDF here
                        </h3>
                        <p className="mb-6" style={{ color: 'var(--text-body)' }}>
                            or click to browse from your computer
                        </p>
                        <label className="btn-primary cursor-pointer inline-flex">
                            <Upload className="w-5 h-5" />
                            Choose File
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>
                        <p className="text-sm mt-4" style={{ color: 'var(--text-muted)' }}>
                            Maximum file size: 10MB for Free, 50MB for Pro
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div
                                className="w-14 h-14 flex items-center justify-center"
                                style={{
                                    backgroundColor: 'var(--bg-white)',
                                    border: '2px solid var(--border-dark)',
                                    borderRadius: '12px'
                                }}
                            >
                                <File className="w-7 h-7" style={{ color: 'var(--accent-coral)' }} />
                            </div>
                            <div className="flex-1">
                                <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{file.name}</div>
                                <div className="text-sm" style={{ color: 'var(--text-body)' }}>{formatBytes(file.size)}</div>
                            </div>
                            {!uploading && !success && (
                                <button
                                    onClick={() => setFile(null)}
                                    className="p-2 rounded-lg hover:bg-white/50 transition-colors"
                                    style={{
                                        border: '1.5px solid var(--border-dark)',
                                        color: 'var(--text-body)'
                                    }}
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        {/* Progress Bar */}
                        {uploading && (
                            <div className="space-y-2">
                                <div
                                    className="h-3 rounded-full overflow-hidden"
                                    style={{
                                        backgroundColor: 'var(--bg-white)',
                                        border: '2px solid var(--border-dark)'
                                    }}
                                >
                                    <div
                                        className="h-full transition-all duration-300"
                                        style={{
                                            backgroundColor: 'var(--accent-coral)',
                                            width: `${progress}%`
                                        }}
                                    />
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span style={{ color: 'var(--text-body)' }}>{processingStage || 'Processing...'}</span>
                                    <span className="font-semibold" style={{ color: 'var(--accent-coral)' }}>{progress}%</span>
                                </div>
                            </div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <div
                                className="flex items-center gap-3 p-4"
                                style={{
                                    backgroundColor: 'var(--bg-white)',
                                    border: '2px solid var(--border-dark)',
                                    borderRadius: '8px'
                                }}
                            >
                                <CheckCircle className="w-5 h-5" style={{ color: 'var(--accent-teal)' }} />
                                <span style={{ color: 'var(--text-primary)' }}>Upload successful! Redirecting to chat...</span>
                            </div>
                        )}

                        {/* Upload Button */}
                        {!uploading && !success && (
                            <button
                                onClick={handleUpload}
                                className="btn-primary w-full justify-center"
                            >
                                <Upload className="w-5 h-5" />
                                Upload & Process
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div
                    className="flex items-center gap-3 p-4"
                    style={{
                        backgroundColor: '#FFF0F0',
                        border: '2px solid #FF6B6B',
                        borderRadius: '8px'
                    }}
                >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#CC0000' }} />
                    <span style={{ color: '#CC0000' }}>{error}</span>
                </div>
            )}

            {/* Info */}
            <div className="brutalist-card p-6" style={{ backgroundColor: 'var(--bg-white)' }}>
                <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>What happens next?</h3>
                <ul className="space-y-2 text-sm" style={{ color: 'var(--text-body)' }}>
                    {[
                        'Your PDF is securely uploaded and stored',
                        'We extract and process the text content',
                        'AI creates searchable embeddings for fast retrieval',
                        'Start chatting with your document instantly'
                    ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                            <span
                                className="w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                                style={{
                                    backgroundColor: 'var(--bg-peach)',
                                    border: '1.5px solid var(--border-dark)',
                                    borderRadius: '4px',
                                    color: 'var(--text-primary)'
                                }}
                            >
                                {idx + 1}
                            </span>
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
