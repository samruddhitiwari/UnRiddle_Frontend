'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Check, Zap, Crown, Building2, Timer, Loader2, ExternalLink, Clock, AlertTriangle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface Plan {
    id: string
    name: string
    price: number | string
    period: string
    description: string
    features: string[]
    icon: any
    gradient: string
    popular?: boolean
    oneTime?: boolean
    contactSales?: boolean
}

const plans: Plan[] = [
    {
        id: 'free',
        name: 'Free',
        price: 0,
        period: 'forever',
        description: 'Perfect for trying out Unriddle',
        icon: Zap,
        gradient: 'from-slate-600 to-slate-700',
        features: [
            '5 documents',
            '50 queries per month',
            '10MB max file size',
            'Basic chat interface',
            'Community support',
        ],
    },
    {
        id: 'starter',
        name: 'Starter Pass',
        price: 3,
        period: '14 days',
        description: 'Full access trial - no subscription',
        icon: Timer,
        gradient: 'from-emerald-500 to-teal-600',
        oneTime: true,
        features: [
            '50 documents',
            '500 queries',
            '50MB max file size',
            'Priority processing',
            'Source citations',
            'No auto-renewal',
        ],
    },
    {
        id: 'pro',
        name: 'Pro',
        price: 6,
        period: 'month',
        description: 'For professionals who need more',
        icon: Crown,
        gradient: 'from-indigo-500 to-purple-600',
        popular: true,
        features: [
            '50 documents',
            '500 queries per month',
            '50MB max file size',
            'Priority processing',
            'Source citations',
            'Priority support',
        ],
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        price: 'Custom',
        period: '',
        description: 'For teams and organizations',
        icon: Building2,
        gradient: 'from-purple-500 to-pink-600',
        contactSales: true,
        features: [
            'Unlimited documents',
            'Unlimited queries',
            '100MB max file size',
            'Dedicated support',
            'Custom integrations',
            'SSO authentication',
        ],
    },
]

export default function SubscriptionPage() {
    const [currentPlan, setCurrentPlan] = useState<string>('free')
    const [subscriptionStatus, setSubscriptionStatus] = useState<string>('active')
    const [loading, setLoading] = useState<string | null>(null)
    const [userData, setUserData] = useState<any>(null)
    const [starterDaysRemaining, setStarterDaysRemaining] = useState<number | null>(null)
    const [error, setError] = useState<string | null>(null)
    const supabase = createClient()

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single()

            if (data) {
                setUserData(data)
                setCurrentPlan(data.plan_type || 'free')
                setSubscriptionStatus(data.subscription_status || 'active')

                // Calculate days remaining for starter pass
                if (data.plan_type === 'starter' && data.starter_pass_expires_at) {
                    const expiresAt = new Date(data.starter_pass_expires_at)
                    const now = new Date()
                    const daysRemaining = Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
                    setStarterDaysRemaining(daysRemaining)
                }
            }
        }

        fetchUserData()
    }, [])

    const handleSubscribe = async (planId: string) => {
        if (planId === 'free' || planId === currentPlan || planId === 'enterprise') return

        setLoading(planId)
        setError(null)

        try {
            const { data: { session } } = await supabase.auth.getSession()

            // Determine which endpoint to call based on plan
            const endpoint = planId === 'starter'
                ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/paddle/checkout/starter`
                : `${process.env.NEXT_PUBLIC_BACKEND_URL}/paddle/checkout/pro`

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session?.access_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    success_url: `${window.location.origin}/subscription/success`,
                    cancel_url: `${window.location.origin}/subscription`,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                // Handle idempotency error
                if (data.detail?.error === 'plan_already_active') {
                    setError(data.detail.message)
                    return
                }
                throw new Error(data.detail?.message || data.detail || 'Failed to create checkout')
            }

            if (data.checkout_url) {
                // Redirect to Paddle checkout
                window.location.href = data.checkout_url
            } else {
                throw new Error('No checkout URL returned')
            }
        } catch (err: any) {
            console.error('Subscription error:', err)
            setError(err.message || 'Failed to start checkout. Please try again.')
        } finally {
            setLoading(null)
        }
    }

    const handleManageSubscription = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession()

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/paddle/customer-portal`, {
                headers: {
                    'Authorization': `Bearer ${session?.access_token}`,
                },
            })

            const data = await response.json()

            if (data.portal_url) {
                window.open(data.portal_url, '_blank')
            }
        } catch (err) {
            console.error('Portal error:', err)
        }
    }

    // Check if subscription has issues
    const hasSubscriptionIssue = ['past_due', 'cancelled', 'expired', 'paused'].includes(subscriptionStatus)

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-3xl font-bold text-white">Choose your plan</h1>
                <p className="text-slate-400 mt-2">Unlock the full power of document intelligence</p>
            </div>

            {/* Subscription Issue Banner */}
            {hasSubscriptionIssue && (
                <div className="p-4 rounded-xl border bg-red-500/10 border-red-500/30 flex items-start gap-4">
                    <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <div className="text-white font-semibold">
                            {subscriptionStatus === 'past_due' && 'Payment Failed'}
                            {subscriptionStatus === 'cancelled' && 'Subscription Cancelled'}
                            {subscriptionStatus === 'expired' && 'Subscription Expired'}
                            {subscriptionStatus === 'paused' && 'Subscription Paused'}
                        </div>
                        <div className="text-slate-400 text-sm mt-1">
                            {subscriptionStatus === 'past_due' && 'Your payment could not be processed. Please update your payment method to continue using premium features.'}
                            {subscriptionStatus === 'cancelled' && 'Your subscription has been cancelled. Upgrade again to restore access.'}
                            {subscriptionStatus === 'expired' && 'Your subscription has expired. Choose a plan below to continue.'}
                            {subscriptionStatus === 'paused' && 'Your subscription is paused. Resume it from the Paddle customer portal.'}
                        </div>
                        <button
                            onClick={handleManageSubscription}
                            className="mt-3 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors text-sm"
                        >
                            {subscriptionStatus === 'past_due' ? 'Update Payment Method' : 'Manage Subscription'}
                        </button>
                    </div>
                </div>
            )}

            {/* Starter Pass Expiry Banner */}
            {currentPlan === 'starter' && starterDaysRemaining !== null && subscriptionStatus === 'active' && (
                <div className={cn(
                    "p-4 rounded-xl border flex items-center gap-4",
                    starterDaysRemaining <= 3
                        ? "bg-amber-500/10 border-amber-500/30"
                        : "bg-emerald-500/10 border-emerald-500/30"
                )}>
                    <Clock className={cn(
                        "w-6 h-6",
                        starterDaysRemaining <= 3 ? "text-amber-400" : "text-emerald-400"
                    )} />
                    <div className="flex-1">
                        <div className="text-white font-semibold">
                            Starter Pass: {starterDaysRemaining} day{starterDaysRemaining !== 1 ? 's' : ''} remaining
                        </div>
                        <div className="text-slate-400 text-sm">
                            {starterDaysRemaining <= 3
                                ? "Your pass is expiring soon. Upgrade to Pro to keep your access!"
                                : "Enjoy full access to all features during your trial."
                            }
                        </div>
                    </div>
                    {starterDaysRemaining <= 3 && (
                        <button
                            onClick={() => handleSubscribe('pro')}
                            className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-colors"
                        >
                            Upgrade to Pro
                        </button>
                    )}
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="p-4 rounded-xl border bg-red-500/10 border-red-500/30 flex items-center gap-3">
                    <XCircle className="w-5 h-5 text-red-400" />
                    <span className="text-red-300">{error}</span>
                    <button onClick={() => setError(null)} className="ml-auto text-slate-400 hover:text-white">
                        ✕
                    </button>
                </div>
            )}

            {/* Usage Stats */}
            {userData && (
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-semibold">Your current usage</h3>
                        {(currentPlan === 'pro' || currentPlan === 'starter') && userData.paddle_customer_id && (
                            <button
                                onClick={handleManageSubscription}
                                className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                            >
                                Manage Billing <ExternalLink className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <div className="text-2xl font-bold text-white">{userData.doc_count || 0}</div>
                            <div className="text-sm text-slate-400">Documents</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">{userData.query_count_month || 0}</div>
                            <div className="text-sm text-slate-400">Queries this month</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white capitalize">{userData.plan_type || 'Free'}</div>
                            <div className="text-sm text-slate-400">Current plan</div>
                        </div>
                        <div>
                            <div className={cn(
                                "text-2xl font-bold capitalize",
                                hasSubscriptionIssue ? "text-red-400" : "text-white"
                            )}>
                                {subscriptionStatus || 'Active'}
                            </div>
                            <div className="text-sm text-slate-400">Status</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Plans */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className={cn(
                            "relative bg-slate-900/50 backdrop-blur-xl border rounded-2xl p-6 transition-all",
                            plan.popular
                                ? "border-indigo-500/50 shadow-lg shadow-indigo-500/20"
                                : "border-slate-800 hover:border-slate-700",
                            currentPlan === plan.id && "ring-2 ring-indigo-500"
                        )}
                    >
                        {plan.popular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold">
                                Most Popular
                            </div>
                        )}

                        <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br",
                            plan.gradient
                        )}>
                            <plan.icon className="w-6 h-6 text-white" />
                        </div>

                        <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                        <p className="text-slate-400 text-sm mt-1">{plan.description}</p>

                        <div className="mt-4 mb-6">
                            {typeof plan.price === 'number' ? (
                                <>
                                    <span className="text-4xl font-bold text-white">${plan.price}</span>
                                    {plan.period && <span className="text-slate-400">/{plan.period}</span>}
                                    {plan.oneTime && (
                                        <span className="ml-2 text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full">
                                            one-time
                                        </span>
                                    )}
                                </>
                            ) : (
                                <span className="text-3xl font-bold text-white">{plan.price}</span>
                            )}
                        </div>

                        <ul className="space-y-3 mb-6">
                            {plan.features.map((feature, idx) => (
                                <li key={idx} className="flex items-center gap-3 text-sm text-slate-300">
                                    <div className={cn(
                                        "w-5 h-5 rounded-full flex items-center justify-center",
                                        plan.popular ? "bg-indigo-500/20" : "bg-slate-800"
                                    )}>
                                        <Check className={cn(
                                            "w-3 h-3",
                                            plan.popular ? "text-indigo-400" : "text-slate-400"
                                        )} />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        {plan.contactSales ? (
                            <a
                                href="mailto:sales@unriddle.voltalabs.space?subject=Enterprise%20Inquiry"
                                className="block w-full py-3 rounded-xl font-semibold text-center transition-all bg-slate-800 hover:bg-slate-700 text-white"
                            >
                                Contact Sales
                            </a>
                        ) : (
                            <button
                                onClick={() => handleSubscribe(plan.id)}
                                disabled={loading !== null || currentPlan === plan.id || (currentPlan === 'pro' && plan.id === 'starter')}
                                className={cn(
                                    "w-full py-3 rounded-xl font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2",
                                    currentPlan === plan.id
                                        ? "bg-slate-800 text-slate-400 cursor-not-allowed"
                                        : plan.popular
                                            ? "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/30"
                                            : plan.oneTime
                                                ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/30"
                                                : "bg-slate-800 hover:bg-slate-700 text-white"
                                )}
                            >
                                {loading === plan.id && <Loader2 className="w-4 h-4 animate-spin" />}
                                {currentPlan === plan.id
                                    ? 'Current Plan'
                                    : plan.id === 'free'
                                        ? 'Downgrade'
                                        : plan.oneTime
                                            ? 'Buy Starter Pass'
                                            : 'Upgrade Now'
                                }
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* FAQ */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4">Frequently Asked Questions</h3>
                <div className="space-y-4 text-sm">
                    <div>
                        <div className="text-white font-medium mb-1">What is the Starter Pass?</div>
                        <div className="text-slate-400">A one-time $3 payment that gives you full Pro access for 14 days. No subscription, no auto-renewal.</div>
                    </div>
                    <div>
                        <div className="text-white font-medium mb-1">Can I upgrade to Pro after my Starter Pass expires?</div>
                        <div className="text-slate-400">Yes! You can upgrade to Pro at any time, even before your Starter Pass expires.</div>
                    </div>
                    <div>
                        <div className="text-white font-medium mb-1">What payment methods do you accept?</div>
                        <div className="text-slate-400">We accept all major credit cards, PayPal, and local payment methods through our secure payment processor (Paddle).</div>
                    </div>
                    <div>
                        <div className="text-white font-medium mb-1">Is my data secure?</div>
                        <div className="text-slate-400">Absolutely. All documents are encrypted at rest and in transit. We never share your data with third parties.</div>
                    </div>
                </div>
            </div>

            {/* Legal Links */}
            <div className="text-center text-sm text-slate-500">
                <Link href="/terms" className="hover:text-slate-300">Terms</Link>
                {' · '}
                <Link href="/privacy" className="hover:text-slate-300">Privacy</Link>
                {' · '}
                <Link href="/refund" className="hover:text-slate-300">Refund Policy</Link>
                {' · '}
                <span>Payments by Paddle.com</span>
            </div>
        </div>
    )
}
