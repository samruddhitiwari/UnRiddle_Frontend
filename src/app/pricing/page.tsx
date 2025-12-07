import Link from 'next/link'
import { Check, Zap, Crown, Building2, ArrowLeft, FileText } from 'lucide-react'
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

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                <FileText className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">Unriddle</span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <Link
                                href="/login"
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                Sign in
                            </Link>
                            <Link
                                href="/login"
                                className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-colors"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="pt-32 pb-20 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to home
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Simple, transparent pricing
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                            Start free and upgrade when you need more. No hidden fees, cancel anytime.
                        </p>
                    </div>

                    {/* Plans */}
                    <div className="grid md:grid-cols-3 gap-8 mb-20">
                        {plans.map((plan) => (
                            <div
                                key={plan.id}
                                className={cn(
                                    "relative bg-slate-900/50 backdrop-blur-xl border rounded-2xl p-8 transition-all hover:scale-105",
                                    plan.popular
                                        ? "border-indigo-500/50 shadow-xl shadow-indigo-500/20"
                                        : "border-slate-800 hover:border-slate-700"
                                )}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold shadow-lg">
                                        Most Popular
                                    </div>
                                )}

                                <div className={cn(
                                    "w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-gradient-to-br",
                                    plan.gradient
                                )}>
                                    <plan.icon className="w-7 h-7 text-white" />
                                </div>

                                <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                                <p className="text-slate-400 mt-2">{plan.description}</p>

                                <div className="mt-6 mb-8">
                                    <span className="text-5xl font-bold text-white">${plan.price}</span>
                                    <span className="text-slate-400 text-lg">/{plan.period}</span>
                                </div>

                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center gap-3 text-slate-300">
                                            <div className={cn(
                                                "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0",
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

                                <Link
                                    href="/login"
                                    className={cn(
                                        "block w-full py-4 rounded-xl font-semibold text-center transition-all",
                                        plan.popular
                                            ? "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/30"
                                            : "bg-slate-800 hover:bg-slate-700 text-white"
                                    )}
                                >
                                    {plan.id === 'free' ? 'Get Started Free' : `Start ${plan.name} Plan`}
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* FAQ */}
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-2xl font-bold text-white text-center mb-10">
                            Frequently Asked Questions
                        </h2>
                        <div className="space-y-6">
                            {[
                                {
                                    q: "Can I upgrade or downgrade at any time?",
                                    a: "Yes! You can change your plan at any time. When upgrading, you'll be charged the prorated difference. When downgrading, the change takes effect at your next billing cycle."
                                },
                                {
                                    q: "What payment methods do you accept?",
                                    a: "We accept PayPal and all major credit/debit cards through our secure payment processor. Enterprise customers can also pay via invoice."
                                },
                                {
                                    q: "Is my data secure?",
                                    a: "Absolutely. All documents are encrypted at rest and in transit using AES-256 encryption. We never share your data with third parties and you can delete your data at any time."
                                },
                                {
                                    q: "What happens when I reach my limit?",
                                    a: "You'll receive a notification when you're close to your limit. Once reached, you can upgrade your plan or wait for the monthly reset to continue querying."
                                },
                                {
                                    q: "Do you offer refunds?",
                                    a: "Yes, we offer a 14-day money-back guarantee for all paid plans. If you're not satisfied, contact us for a full refund."
                                }
                            ].map((item, idx) => (
                                <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                                    <h3 className="text-white font-semibold mb-2">{item.q}</h3>
                                    <p className="text-slate-400">{item.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-20 text-center">
                        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-3xl p-12">
                            <h2 className="text-3xl font-bold text-white mb-4">
                                Ready to get started?
                            </h2>
                            <p className="text-slate-400 text-lg mb-8">
                                Join thousands of users who are already chatting with their documents.
                            </p>
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold transition-all shadow-lg shadow-indigo-500/30"
                            >
                                Start Free Trial
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-slate-800 py-12 px-4">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <FileText className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white font-semibold">Unriddle</span>
                    </div>
                    <p className="text-slate-500 text-sm">
                        © 2024 Unriddle. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}
