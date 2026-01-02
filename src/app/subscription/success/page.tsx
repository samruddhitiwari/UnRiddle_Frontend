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
        <div
            className="min-h-screen flex items-center justify-center px-4"
            style={{ backgroundColor: 'var(--bg-cream)' }}
        >
            <div className="max-w-md w-full text-center">
                <div
                    className="w-20 h-20 flex items-center justify-center mx-auto mb-6"
                    style={{
                        backgroundColor: 'var(--bg-mint)',
                        border: '3px solid var(--border-dark)',
                        borderRadius: '50%'
                    }}
                >
                    <CheckCircle className="w-10 h-10" style={{ color: 'var(--accent-teal)' }} />
                </div>

                <h1 className="heading-lg mb-4">
                    Payment Received!
                </h1>

                <p className="mb-6" style={{ color: 'var(--text-body)' }}>
                    Thank you for your purchase. Your payment is being processed and your account will be upgraded shortly.
                </p>

                {/* Processing Notice */}
                <div
                    className="brutalist-card p-4 mb-6"
                    style={{ backgroundColor: 'var(--bg-pale-yellow)' }}
                >
                    <div className="flex items-center justify-center gap-2 mb-2" style={{ color: 'var(--text-primary)' }}>
                        <AlertTriangle className="w-4 h-4" />
                        <span className="font-semibold text-sm">Processing may take a moment</span>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--text-body)' }}>
                        If your plan hasn&apos;t updated after a few minutes, please refresh the page or contact support.
                    </p>
                </div>

                <div
                    className="brutalist-card p-6 mb-8"
                    style={{ backgroundColor: 'var(--bg-white)' }}
                >
                    <div className="flex items-center justify-center gap-2" style={{ color: 'var(--text-body)' }}>
                        <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'var(--accent-coral)' }} />
                        <span>Redirecting to dashboard in {countdown}...</span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/dashboard" className="btn-primary">
                        Go to Dashboard
                    </Link>
                    <Link href="/subscription" className="btn-secondary">
                        View Subscription
                    </Link>
                </div>

                <p className="mt-8 text-sm" style={{ color: 'var(--text-muted)' }}>
                    Questions? Contact us at support@unriddle.voltalabs.space
                </p>
            </div>
        </div>
    )
}
