import Link from 'next/link'
import { FileText, ArrowLeft } from 'lucide-react'

export default function RefundPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                <FileText className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">Unriddle</span>
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="pt-28 pb-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to home
                    </Link>

                    <h1 className="text-4xl font-bold text-white mb-8">Refund Policy</h1>

                    <div className="prose prose-invert prose-slate max-w-none">
                        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 space-y-6">
                            <section>
                                <h2 className="text-xl font-semibold text-white mb-4">Our Commitment</h2>
                                <p className="text-slate-400">
                                    We want you to be completely satisfied with Unriddle. If you&apos;re not happy with your purchase, we offer refunds under the following conditions.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-white mb-4">Starter Pass ($3 One-Time)</h2>
                                <div className="text-slate-400 space-y-2">
                                    <p><strong className="text-white">Refund Window:</strong> 48 hours from purchase</p>
                                    <p><strong className="text-white">Conditions:</strong></p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Less than 10 queries used</li>
                                        <li>Request submitted via email</li>
                                    </ul>
                                    <p className="text-amber-400 text-sm mt-2">
                                        Note: Starter Pass is a one-time purchase with no auto-renewal.
                                    </p>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-white mb-4">Pro Subscription ($6/month)</h2>
                                <div className="text-slate-400 space-y-2">
                                    <p><strong className="text-white">Refund Window:</strong> 7 days from initial purchase or renewal</p>
                                    <p><strong className="text-white">Conditions:</strong></p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Less than 50 queries used in current billing period</li>
                                        <li>Request submitted via email</li>
                                    </ul>
                                    <p><strong className="text-white">Cancellation:</strong></p>
                                    <p>You can cancel your subscription at any time through the billing portal. Access continues until the end of your current billing period.</p>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-white mb-4">How to Request a Refund</h2>
                                <ol className="list-decimal list-inside text-slate-400 space-y-2">
                                    <li>Email us at: billing@unriddle.voltalabs.space</li>
                                    <li>Include your account email and reason for refund</li>
                                    <li>We&apos;ll process your request within 3-5 business days</li>
                                </ol>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-white mb-4">Payment Processing</h2>
                                <p className="text-slate-400">
                                    All payments are processed by Paddle.com, our Merchant of Record. Refunds are issued to the original payment method and may take 5-10 business days to appear on your statement.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-white mb-4">Exceptions</h2>
                                <p className="text-slate-400">
                                    Refunds may be denied in cases of:
                                </p>
                                <ul className="list-disc list-inside text-slate-400 mt-2 space-y-1">
                                    <li>Abuse of the refund policy</li>
                                    <li>Terms of Service violations</li>
                                    <li>Excessive usage before refund request</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-white mb-4">Contact</h2>
                                <p className="text-slate-400">
                                    For billing questions, contact: billing@unriddle.voltalabs.space
                                </p>
                            </section>

                            <p className="text-slate-500 text-sm mt-8">
                                Last updated: December 2024
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
