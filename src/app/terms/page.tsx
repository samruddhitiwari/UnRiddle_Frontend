import Link from 'next/link'
import { FileText, ArrowLeft } from 'lucide-react'

export default function TermsPage() {
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

                    <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>

                    <div className="prose prose-invert prose-slate max-w-none">
                        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 space-y-6">
                            <section>
                                <h2 className="text-xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                                <p className="text-slate-400">
                                    By accessing and using Unriddle (&quot;the Service&quot;), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-white mb-4">2. Description of Service</h2>
                                <p className="text-slate-400">
                                    Unriddle provides AI-powered document analysis and chat functionality. Users can upload PDF documents and interact with them using natural language queries.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-white mb-4">3. User Accounts</h2>
                                <p className="text-slate-400">
                                    You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-white mb-4">4. Subscription and Billing</h2>
                                <p className="text-slate-400">
                                    Paid subscriptions are billed through Paddle.com as our Merchant of Record. By subscribing, you authorize Paddle to charge your payment method. Subscription terms:
                                </p>
                                <ul className="list-disc list-inside text-slate-400 mt-2 space-y-1">
                                    <li>Starter Pass: One-time $3 payment for 14 days of full access</li>
                                    <li>Pro: $6/month recurring subscription</li>
                                    <li>Enterprise: Custom pricing, contact sales</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-white mb-4">5. Acceptable Use</h2>
                                <p className="text-slate-400">
                                    You agree not to upload illegal content, attempt to breach security, or use the service for any unlawful purpose. We reserve the right to terminate accounts that violate these terms.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-white mb-4">6. Intellectual Property</h2>
                                <p className="text-slate-400">
                                    You retain ownership of documents you upload. We do not claim any intellectual property rights over your content. Our AI processing is solely for providing the Service.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-white mb-4">7. Limitation of Liability</h2>
                                <p className="text-slate-400">
                                    The Service is provided &quot;as is&quot; without warranties. We are not liable for any indirect, incidental, or consequential damages arising from your use of the Service.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-white mb-4">8. Changes to Terms</h2>
                                <p className="text-slate-400">
                                    We may update these terms from time to time. Continued use of the Service after changes constitutes acceptance of the new terms.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-white mb-4">9. Contact</h2>
                                <p className="text-slate-400">
                                    For questions about these Terms, contact us at: support@unriddle.voltalabs.space
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
