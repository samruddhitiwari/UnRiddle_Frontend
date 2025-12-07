'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Check, Zap, Crown, Building2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Plan {
    id: string
    name: string
    price: number
    period: string
    description: string
    features: string[]
    icon: any
    gradient: string
    popular?: boolean
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
            'Email support',
        ],
    },
    {
        id: 'pro',
        name: 'Pro',
        price: 19,
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
        price: 99,
        period: 'month',
        description: 'For teams and organizations',
        icon: Building2,
        gradient: 'from-purple-500 to-pink-600',
        features: [
            'Unlimited documents',
            'Unlimited queries',
            '100MB max file size',
            'Dedicated support',
            'Custom integrations',
            'SSO authentication',
            'Team collaboration',
        ],
    },
]

export default function SubscriptionPage() {
    const [currentPlan, setCurrentPlan] = useState<string>('free')
    const [loading, setLoading] = useState<string | null>(null)
    const [userData, setUserData] = useState<any>(null)
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
            }
        }

        fetchUserData()
    }, [])

    const handleSubscribe = async (planId: string) => {
        if (planId === 'free' || planId === currentPlan) return

        setLoading(planId)

        try {
            const { data: { session } } = await supabase.auth.getSession()

            // Get plan ID from your PayPal configuration
            const planMapping: Record<string, string> = {
                pro: process.env.NEXT_PUBLIC_PAYPAL_PRO_PLAN_ID || 'P-PRO',
                enterprise: process.env.NEXT_PUBLIC_PAYPAL_ENTERPRISE_PLAN_ID || 'P-ENT',
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/paypal/create-subscription`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session?.access_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    plan_id: planMapping[planId],
                    user_id: userData.id,
                }),
            })

            const data = await response.json()

            // Redirect to PayPal approval URL
            const approvalLink = data.links?.find((link: any) => link.rel === 'approve')
            if (approvalLink) {
                window.location.href = approvalLink.href
            }
        } catch (err) {
            console.error('Subscription error:', err)
        } finally {
            setLoading(null)
        }
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-3xl font-bold text-white">Choose your plan</h1>
                <p className="text-slate-400 mt-2">Unlock the full power of document intelligence</p>
            </div>

            {/* Usage Stats */}
            {userData && (
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-white font-semibold mb-4">Your current usage</h3>
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
                            <div className="text-2xl font-bold text-white capitalize">{userData.subscription_status || 'Active'}</div>
                            <div className="text-sm text-slate-400">Status</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Plans */}
            <div className="grid md:grid-cols-3 gap-6">
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
                            <span className="text-4xl font-bold text-white">${plan.price}</span>
                            <span className="text-slate-400">/{plan.period}</span>
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

                        <button
                            onClick={() => handleSubscribe(plan.id)}
                            disabled={loading !== null || currentPlan === plan.id}
                            className={cn(
                                "w-full py-3 rounded-xl font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2",
                                currentPlan === plan.id
                                    ? "bg-slate-800 text-slate-400 cursor-not-allowed"
                                    : plan.popular
                                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/30"
                                        : "bg-slate-800 hover:bg-slate-700 text-white"
                            )}
                        >
                            {loading === plan.id && <Loader2 className="w-4 h-4 animate-spin" />}
                            {currentPlan === plan.id
                                ? 'Current Plan'
                                : plan.id === 'free'
                                    ? 'Downgrade'
                                    : 'Upgrade Now'
                            }
                        </button>
                    </div>
                ))}
            </div>

            {/* FAQ */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4">Frequently Asked Questions</h3>
                <div className="space-y-4 text-sm">
                    <div>
                        <div className="text-white font-medium mb-1">Can I upgrade or downgrade at any time?</div>
                        <div className="text-slate-400">Yes, you can change your plan at any time. Changes take effect at the start of your next billing cycle.</div>
                    </div>
                    <div>
                        <div className="text-white font-medium mb-1">What payment methods do you accept?</div>
                        <div className="text-slate-400">We accept PayPal and all major credit cards through our secure payment processor.</div>
                    </div>
                    <div>
                        <div className="text-white font-medium mb-1">Is my data secure?</div>
                        <div className="text-slate-400">Absolutely. All documents are encrypted at rest and in transit. We never share your data with third parties.</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
