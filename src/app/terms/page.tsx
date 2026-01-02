import Link from 'next/link'
import { FileText, ArrowLeft } from 'lucide-react'

export const metadata = {
    title: 'Terms of Service | Unriddle',
    description: 'Terms of Service for Unriddle - AI-powered document analysis',
}

export default function TermsPage() {
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

                    <h1 className="heading-lg mb-2">Terms of Service</h1>
                    <p className="mb-8" style={{ color: 'var(--text-muted)' }}>Last updated: December 2024</p>

                    <div
                        className="brutalist-card p-8 space-y-8 leading-relaxed"
                        style={{ backgroundColor: 'var(--bg-white)', color: 'var(--text-body)' }}
                    >
                        <section>
                            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>1. Introduction</h2>
                            <p>
                                Welcome to Unriddle. Unriddle is operated by Volta Labs. By accessing or using our service at{' '}
                                <a href="https://unriddle.voltalabs.space" className="font-medium hover:underline underline-offset-4" style={{ color: 'var(--accent-coral)' }}>unriddle.voltalabs.space</a>,
                                you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>2. Description of Service</h2>
                            <p>
                                Unriddle is an AI-powered document analysis platform that allows users to upload PDF documents and interact with them using natural language queries. Our service uses artificial intelligence to process, analyze, and provide insights from your documents.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>3. Eligibility</h2>
                            <p>
                                You must be at least 18 years of age to use Unriddle. By using our service, you represent and warrant that you are at least 18 years old and have the legal capacity to enter into these Terms. If you are using the service on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>4. Account Responsibilities</h2>
                            <p className="mb-3">When you create an account with Unriddle, you agree to:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Provide accurate and complete information during registration</li>
                                <li>Maintain the security of your account credentials</li>
                                <li>Promptly notify us of any unauthorized access to your account</li>
                                <li>Accept responsibility for all activities that occur under your account</li>
                                <li>Not share your account with others or transfer it to another party</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>5. Subscription Plans and Billing</h2>
                            <p className="mb-3">Unriddle offers the following plans:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                                <li><strong style={{ color: 'var(--text-primary)' }}>Free Plan:</strong> Limited access with usage restrictions, available at no cost</li>
                                <li><strong style={{ color: 'var(--text-primary)' }}>Starter Pass:</strong> A one-time payment of $3 USD providing full access for 14 days. This is not a subscription and does not automatically renew</li>
                                <li><strong style={{ color: 'var(--text-primary)' }}>Pro Plan:</strong> A monthly subscription at $6 USD per month with full access to all features. This subscription automatically renews each month until cancelled</li>
                                <li><strong style={{ color: 'var(--text-primary)' }}>Enterprise:</strong> Custom pricing for organizations with specific needs. Contact us for details</li>
                            </ul>
                            <p className="mb-3">
                                All payments are processed by Paddle.com, our Merchant of Record. By making a purchase, you agree to Paddle&apos;s terms of service and authorize them to charge your selected payment method.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>6. Acceptable Use</h2>
                            <p className="mb-3">You agree not to use Unriddle to:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Upload, store, or process any illegal, harmful, or offensive content</li>
                                <li>Violate any applicable laws, regulations, or third-party rights</li>
                                <li>Attempt to gain unauthorized access to our systems or other users&apos; accounts</li>
                                <li>Interfere with or disrupt the integrity or performance of the service</li>
                                <li>Reverse engineer, decompile, or attempt to extract the source code of our software</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>7. Disclaimer of Warranties</h2>
                            <p>
                                UNRIDDLE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE. AI-GENERATED RESPONSES MAY NOT ALWAYS BE ACCURATE, AND YOU SHOULD VERIFY IMPORTANT INFORMATION INDEPENDENTLY.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>8. Contact Us</h2>
                            <p>
                                If you have any questions about these Terms of Service, please contact us at:{' '}
                                <a href="mailto:support@voltalabs.space" className="font-medium hover:underline underline-offset-4" style={{ color: 'var(--accent-coral)' }}>support@voltalabs.space</a>
                            </p>
                        </section>
                    </div>

                    {/* Footer Links */}
                    <div className="mt-12 pt-8" style={{ borderTop: '2px solid var(--border-dark)' }}>
                        <div className="flex flex-wrap justify-center gap-6 text-sm">
                            <Link href="/terms" className="font-semibold" style={{ color: 'var(--accent-coral)' }}>Terms of Service</Link>
                            <Link href="/privacy" className="hover:underline underline-offset-4" style={{ color: 'var(--text-body)' }}>Privacy Policy</Link>
                            <Link href="/refund" className="hover:underline underline-offset-4" style={{ color: 'var(--text-body)' }}>Refund Policy</Link>
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
