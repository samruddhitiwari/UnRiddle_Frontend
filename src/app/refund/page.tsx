import Link from 'next/link'
import { FileText, ArrowLeft } from 'lucide-react'

export const metadata = {
    title: 'Refund Policy | Unriddle',
    description: 'Refund Policy for Unriddle - 14-day refund policy for all purchases',
}

export default function RefundPage() {
    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-cream)' }}>
            {/* Navigation */}
            <nav
                className="fixed top-0 left-0 right-0 z-50"
                style={{
                    backgroundColor: 'var(--bg-white)',
                    borderBottom: '2px solid var(--border-dark)'
                }}
            >
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="flex items-center gap-3">
                            <div
                                className="w-9 h-9 flex items-center justify-center"
                                style={{
                                    backgroundColor: 'var(--accent-coral)',
                                    border: '2px solid var(--border-dark)',
                                    borderRadius: '8px'
                                }}
                            >
                                <FileText className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
                            </div>
                            <span className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Unriddle</span>
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="pt-28 pb-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 mb-6 font-medium hover:underline underline-offset-4"
                        style={{ color: 'var(--text-body)' }}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to home
                    </Link>

                    <h1 className="heading-lg mb-2">Refund Policy</h1>
                    <p className="mb-8" style={{ color: 'var(--text-muted)' }}>Last updated: December 2025</p>

                    <div
                        className="brutalist-card p-8 space-y-8 leading-relaxed"
                        style={{ backgroundColor: 'var(--bg-white)', color: 'var(--text-body)' }}
                    >
                        <section>
                            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Introduction</h2>
                            <p className="mb-3">
                                Unriddle is operated by Volta Labs. You can access our service at{' '}
                                <a href="https://unriddle.voltalabs.space" className="font-medium hover:underline underline-offset-4" style={{ color: 'var(--accent-coral)' }}>
                                    https://unriddle.voltalabs.space
                                </a>.
                            </p>
                            <p>
                                All payments for Unriddle are processed by Paddle.com, which acts as the Merchant of Record for all transactions.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>14-Day Refund Policy</h2>
                            <p className="mb-4">
                                We offer a 14-day refund policy for all purchases made through Unriddle. If you are not satisfied with your purchase, you may request a full refund within 14 days of the original purchase date.
                            </p>
                            <div
                                className="p-4 mb-4"
                                style={{
                                    backgroundColor: 'var(--bg-mint)',
                                    border: '2px solid var(--border-dark)',
                                    borderRadius: '8px'
                                }}
                            >
                                <h3 className="text-lg font-medium mb-3" style={{ color: 'var(--text-primary)' }}>This policy applies to:</h3>
                                <ul className="list-disc list-inside space-y-2 ml-2">
                                    <li>
                                        <strong style={{ color: 'var(--text-primary)' }}>Starter Pass</strong> — $3 one-time purchase for 14 days of access
                                    </li>
                                    <li>
                                        <strong style={{ color: 'var(--text-primary)' }}>Pro Subscription</strong> — $6/month subscription (initial subscription period)
                                    </li>
                                </ul>
                            </div>
                            <p>
                                To request a refund, simply contact us within 14 days of your purchase. No additional conditions apply.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Subscription Cancellations</h2>
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
                            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>How Refunds Are Processed</h2>
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
                            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Contact Us</h2>
                            <p>
                                If you would like to request a refund or have any questions about this policy, please contact us at:{' '}
                                <a href="mailto:support@voltalabs.space" className="font-medium hover:underline underline-offset-4" style={{ color: 'var(--accent-coral)' }}>
                                    support@voltalabs.space
                                </a>
                            </p>
                        </section>
                    </div>

                    {/* Footer Links */}
                    <div className="mt-12 pt-8" style={{ borderTop: '2px solid var(--border-dark)' }}>
                        <div className="flex flex-wrap justify-center gap-6 text-sm">
                            <Link href="/terms" className="hover:underline underline-offset-4" style={{ color: 'var(--text-body)' }}>Terms of Service</Link>
                            <Link href="/privacy" className="hover:underline underline-offset-4" style={{ color: 'var(--text-body)' }}>Privacy Policy</Link>
                            <Link href="/refund" className="font-semibold" style={{ color: 'var(--accent-coral)' }}>Refund Policy</Link>
                        </div>
                        <p className="text-center text-sm mt-4" style={{ color: 'var(--text-muted)' }}>
                            © {new Date().getFullYear()} Volta Labs. Payments processed by Paddle.com
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
