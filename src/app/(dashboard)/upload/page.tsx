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
                <h1 className="text-3xl font-bold text-white">Upload Document</h1>
                <p className="text-slate-400 mt-1">Upload a PDF to start chatting with your document</p>
            </div>

            {/* Upload Zone */}
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={cn(
                    "relative border-2 border-dashed rounded-2xl p-12 transition-all",
                    dragActive
                        ? "border-indigo-500 bg-indigo-500/10"
                        : "border-slate-700 hover:border-slate-600",
                    file && "border-solid border-indigo-500/50 bg-indigo-500/5"
                )}
            >
                {!file ? (
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-800 flex items-center justify-center mb-6">
                            <Upload className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                            Drop your PDF here
                        </h3>
                        <p className="text-slate-400 mb-6">
                            or click to browse from your computer
                        </p>
                        <label className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium cursor-pointer transition-colors">
                            <Upload className="w-5 h-5" />
                            Choose File
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>
                        <p className="text-sm text-slate-500 mt-4">
                            Maximum file size: 10MB for Free, 50MB for Pro
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                                <File className="w-7 h-7 text-indigo-400" />
                            </div>
                            <div className="flex-1">
                                <div className="text-white font-medium">{file.name}</div>
                                <div className="text-sm text-slate-400">{formatBytes(file.size)}</div>
                            </div>
                            {!uploading && !success && (
                                <button
                                    onClick={() => setFile(null)}
                                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        {/* Progress Bar */}
                        {uploading && (
                            <div className="space-y-2">
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400">{processingStage || 'Processing...'}</span>
                                    <span className="text-indigo-400 font-medium">{progress}%</span>
                                </div>
                            </div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                                <CheckCircle className="w-5 h-5 text-emerald-400" />
                                <span className="text-emerald-400">Upload successful! Redirecting to chat...</span>
                            </div>
                        )}

                        {/* Upload Button */}
                        {!uploading && !success && (
                            <button
                                onClick={handleUpload}
                                className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2"
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
                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <span className="text-red-400">{error}</span>
                </div>
            )}

            {/* Info */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-3">What happens next?</h3>
                <ul className="space-y-2 text-slate-400 text-sm">
                    <li className="flex items-start gap-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">1</span>
                        Your PDF is securely uploaded and stored
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">2</span>
                        We extract and process the text content
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">3</span>
                        AI creates searchable embeddings for fast retrieval
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">4</span>
                        Start chatting with your document instantly
                    </li>
                </ul>
            </div>
        </div>
    )
}
