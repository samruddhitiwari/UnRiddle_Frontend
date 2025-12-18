'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Loader2, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

/**
 * IMPORTANT: This page is UI-only.
 * Plan activation happens ONLY via Paddle webhooks.
 * This page just confirms the checkout was initiated successfully.
 */
export default function SubscriptionSuccessPage() {
    const router = useRouter()
    const [countdown, setCountdown] = useState(8)

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer)
                    router.push('/dashboard')
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [router])

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-emerald-400" />
                </div>

                <h1 className="text-3xl font-bold text-white mb-4">
                    Payment Received!
                </h1>

                <p className="text-slate-400 mb-6">
                    Thank you for your purchase. Your payment is being processed and your account will be upgraded shortly.
                </p>

                {/* Processing Notice */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-center gap-2 text-amber-400 mb-2">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="font-medium text-sm">Processing may take a moment</span>
                    </div>
                    <p className="text-slate-500 text-sm">
                        If your plan hasn&apos;t updated after a few minutes, please refresh the page or contact support.
                    </p>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 mb-8">
                    <div className="flex items-center justify-center gap-2 text-slate-400">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Redirecting to dashboard in {countdown}...</span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold transition-all"
                    >
                        Go to Dashboard
                    </Link>
                    <Link
                        href="/subscription"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-all"
                    >
                        View Subscription
                    </Link>
                </div>

                <p className="mt-8 text-slate-500 text-sm">
                    Questions? Contact us at support@unriddle.voltalabs.space
                </p>
            </div>
        </div>
    )
}
