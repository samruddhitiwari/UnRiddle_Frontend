import Link from 'next/link'
import { FileText, ArrowLeft } from 'lucide-react'

export const metadata = {
    title: 'Refund Policy | Unriddle',
    description: 'Refund Policy for Unriddle - Our fair approach to refunds and cancellations',
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
                    <p className="text-slate-400 mb-8">Last updated: December 2024</p>

                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 space-y-8 text-slate-300 leading-relaxed">

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">Overview</h2>
                            <p>
                                At Unriddle, operated by Volta Labs, we want you to be satisfied with your purchase. This Refund Policy outlines our approach to refunds for our paid plans. All payments and refunds are processed by Paddle.com, our Merchant of Record.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">Starter Pass ($3 One-Time Purchase)</h2>
                            <p className="mb-3">
                                The Starter Pass is a one-time payment of $3 USD that provides full access to Unriddle for 14 days. It does not automatically renew.
                            </p>
                            <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
                                <h3 className="text-lg font-medium text-white mb-2">Refund Eligibility</h3>
                                <ul className="list-disc list-inside space-y-1 ml-2">
                                    <li>Refund requests must be submitted within <strong className="text-white">48 hours</strong> of purchase</li>
                                    <li>You must not have used more than <strong className="text-white">10 queries</strong> on the service</li>
                                    <li>Refunds are not available after the 48-hour window or if usage exceeds 10 queries</li>
                                </ul>
                            </div>
                            <p>
                                Given the low cost of the Starter Pass, we ask that you evaluate whether the service meets your needs within the refund window before extensive use.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">Pro Subscription ($6/Month)</h2>
                            <p className="mb-3">
                                The Pro plan is a monthly subscription that automatically renews until cancelled.
                            </p>
                            <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
                                <h3 className="text-lg font-medium text-white mb-2">Refund Eligibility</h3>
                                <ul className="list-disc list-inside space-y-1 ml-2">
                                    <li>Refund requests must be submitted within <strong className="text-white">7 days</strong> of the initial subscription or any renewal charge</li>
                                    <li>You must not have used more than <strong className="text-white">25 queries</strong> in the current billing period</li>
                                </ul>
                            </div>

                            <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
                                <h3 className="text-lg font-medium text-white mb-2">Cancellation</h3>
                                <p>
                                    You may cancel your Pro subscription at any time through the Paddle customer portal or by contacting us. Upon cancellation:
                                </p>
                                <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                                    <li>You will retain access until the end of your current billing period</li>
                                    <li>No further charges will be made after cancellation</li>
                                    <li>We do not provide partial refunds for unused time within a billing period</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">Enterprise Plans</h2>
                            <p>
                                Enterprise plans have custom terms and pricing. Refund policies for Enterprise customers are outlined in individual agreements. Please contact us to discuss your specific situation.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">How to Request a Refund</h2>
                            <p className="mb-4">To request a refund, please follow these steps:</p>
                            <ol className="list-decimal list-inside space-y-3 ml-2">
                                <li>
                                    Email us at{' '}
                                    <a href="mailto:billing@voltalabs.space" className="text-indigo-400 hover:underline">billing@voltalabs.space</a>{' '}
                                    with the subject line &quot;Refund Request&quot;
                                </li>
                                <li>Include the email address associated with your Unriddle account</li>
                                <li>Briefly explain the reason for your refund request</li>
                                <li>We will review your request and respond within 3-5 business days</li>
                            </ol>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">Refund Processing</h2>
                            <p className="mb-3">
                                All refunds are processed by Paddle.com. Once approved:
                            </p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                                <li>Refunds are issued to the original payment method</li>
                                <li>Processing time is typically 5-10 business days, depending on your financial institution</li>
                                <li>You will receive confirmation from Paddle when the refund is processed</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">Exceptions</h2>
                            <p className="mb-3">We may decline a refund request in the following situations:</p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                                <li>The request is made outside the eligible refund window</li>
                                <li>Usage exceeds the limits specified above</li>
                                <li>We detect abuse of our refund policy (such as repeated purchases and refund requests)</li>
                                <li>The account has been terminated for violating our Terms of Service</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">Chargebacks</h2>
                            <p>
                                We encourage you to contact us directly if you have any billing concerns before initiating a chargeback with your bank or payment provider. We are committed to resolving issues fairly and promptly. Unauthorized chargebacks may result in account suspension.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">Contact Us</h2>
                            <p>
                                If you have any questions about our Refund Policy or need assistance with billing, please contact us at:{' '}
                                <a href="mailto:billing@voltalabs.space" className="text-indigo-400 hover:underline">billing@voltalabs.space</a>
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
