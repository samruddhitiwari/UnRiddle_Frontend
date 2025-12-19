import Link from 'next/link'
import { FileText, ArrowLeft } from 'lucide-react'

export const metadata = {
    title: 'Refund Policy | Unriddle',
    description: 'Refund Policy for Unriddle - 14-day refund policy for all purchases',
}

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

                    <h1 className="text-4xl font-bold text-white mb-2">Refund Policy</h1>
                    <p className="text-slate-400 mb-8">Last updated: December 2025</p>

                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 space-y-8 text-slate-300 leading-relaxed">

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">Introduction</h2>
                            <p className="mb-3">
                                Unriddle is operated by Volta Labs. You can access our service at{' '}
                                <a href="https://unriddle.voltalabs.space" className="text-indigo-400 hover:underline">
                                    https://unriddle.voltalabs.space
                                </a>.
                            </p>
                            <p>
                                All payments for Unriddle are processed by Paddle.com, which acts as the Merchant of Record for all transactions. Paddle handles billing, payment processing, and refunds on our behalf.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">14-Day Refund Policy</h2>
                            <p className="mb-4">
                                We offer a 14-day refund policy for all purchases made through Unriddle. If you are not satisfied with your purchase, you may request a full refund within 14 days of the original purchase date.
                            </p>
                            <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
                                <h3 className="text-lg font-medium text-white mb-3">This policy applies to:</h3>
                                <ul className="list-disc list-inside space-y-2 ml-2">
                                    <li>
                                        <strong className="text-white">Starter Pass</strong> — $3 one-time purchase for 14 days of access
                                    </li>
                                    <li>
                                        <strong className="text-white">Pro Subscription</strong> — $6/month subscription (initial subscription period)
                                    </li>
                                </ul>
                            </div>
                            <p>
                                To request a refund, simply contact us within 14 days of your purchase. No additional conditions apply.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">Subscription Cancellations</h2>
                            <p className="mb-4">
                                You may cancel your Pro subscription at any time through the Paddle customer portal or by contacting us directly.
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-2">
                                <li>Upon cancellation, you will retain access until the end of your current billing period</li>
                                <li>No further charges will be made after cancellation</li>
                                <li>Refunds are available within the 14-day period from the initial subscription purchase</li>
                                <li>After the 14-day refund period, cancellations will stop future billing but no refund will be issued for the current period</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">How Refunds Are Processed</h2>
                            <p className="mb-4">
                                All refunds are processed by Paddle.com, our Merchant of Record.
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-2">
                                <li>Refunds are issued to your original payment method</li>
                                <li>Processing time is typically 5-10 business days, depending on your financial institution</li>
                                <li>You will receive confirmation from Paddle when the refund is processed</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">Contact Us</h2>
                            <p>
                                If you would like to request a refund or have any questions about this policy, please contact us at:{' '}
                                <a href="mailto:support@voltalabs.space" className="text-indigo-400 hover:underline">
                                    support@voltalabs.space
                                </a>
                            </p>
                        </section>
                    </div>

                    {/* Footer Links */}
                    <div className="mt-12 pt-8 border-t border-slate-800">
                        <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
                            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                            <Link href="/refund" className="text-indigo-400">Refund Policy</Link>
                        </div>
                        <p className="text-center text-slate-500 text-sm mt-4">
                            © {new Date().getFullYear()} Volta Labs. Payments processed by Paddle.com
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
