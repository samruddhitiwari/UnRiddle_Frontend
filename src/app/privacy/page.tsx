import Link from 'next/link'
import { FileText, ArrowLeft } from 'lucide-react'

export const metadata = {
    title: 'Privacy Policy | Unriddle',
    description: 'Privacy Policy for Unriddle - How we collect, use, and protect your data',
}

export default function PrivacyPage() {
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

                    <h1 className="heading-lg mb-2">Privacy Policy</h1>
                    <p className="mb-8" style={{ color: 'var(--text-muted)' }}>Last updated: December 2025</p>

                    <div
                        className="brutalist-card p-8 space-y-8 leading-relaxed"
                        style={{ backgroundColor: 'var(--bg-white)', color: 'var(--text-body)' }}
                    >
                        <section>
                            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>1. Introduction</h2>
                            <p>
                                Unriddle is operated by Volta Labs. This Privacy Policy explains how we collect, use, disclose, and protect your information when you use our AI-powered document analysis service at{' '}
                                <a href="https://unriddle.voltalabs.space" className="font-medium hover:underline underline-offset-4" style={{ color: 'var(--accent-coral)' }}>unriddle.voltalabs.space</a>.
                                We are committed to protecting your privacy and handling your data responsibly.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>2. Information We Collect</h2>

                            <h3 className="text-lg font-medium mt-4 mb-2" style={{ color: 'var(--text-primary)' }}>Account Information</h3>
                            <p className="mb-3">When you create an account, we collect:</p>
                            <ul className="list-disc list-inside space-y-1 ml-4 mb-4">
                                <li>Email address</li>
                                <li>Authentication credentials (managed securely through our authentication provider)</li>
                            </ul>

                            <h3 className="text-lg font-medium mt-4 mb-2" style={{ color: 'var(--text-primary)' }}>Documents and Content</h3>
                            <p className="mb-3">When you use our service, we collect:</p>
                            <ul className="list-disc list-inside space-y-1 ml-4 mb-4">
                                <li>PDF documents you upload for analysis</li>
                                <li>Questions and queries you submit about your documents</li>
                                <li>AI-generated responses and analysis results</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>3. How We Use Your Information</h2>
                            <p className="mb-3">We use the information we collect to:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li><strong style={{ color: 'var(--text-primary)' }}>Provide the Service:</strong> Process your documents, respond to your queries, and deliver AI-powered analysis</li>
                                <li><strong style={{ color: 'var(--text-primary)' }}>Maintain Your Account:</strong> Authenticate your access and manage your subscription</li>
                                <li><strong style={{ color: 'var(--text-primary)' }}>Improve the Service:</strong> Analyze usage patterns to enhance features and user experience</li>
                                <li><strong style={{ color: 'var(--text-primary)' }}>Ensure Security:</strong> Detect and prevent fraud, abuse, and security incidents</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>4. AI Processing Disclosure</h2>
                            <p className="mb-3">
                                To provide our document analysis features, the content of your uploaded documents is processed by third-party AI systems. Your documents are not used to train AI models unless you explicitly consent.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>5. Data Sharing</h2>
                            <p className="mb-3">
                                We do not sell your personal information. We may share your information only in the following circumstances:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li><strong style={{ color: 'var(--text-primary)' }}>Service Providers:</strong> With third parties who assist in operating our service (AI processing, hosting, analytics), under confidentiality obligations</li>
                                <li><strong style={{ color: 'var(--text-primary)' }}>Payment Processing:</strong> With Paddle for billing and subscription management</li>
                                <li><strong style={{ color: 'var(--text-primary)' }}>Legal Requirements:</strong> When required by law, legal process, or to protect our rights and safety</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>6. Your Rights</h2>
                            <p className="mb-3">Depending on your location, you may have the following rights regarding your personal information:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li><strong style={{ color: 'var(--text-primary)' }}>Access:</strong> Request a copy of the personal information we hold about you</li>
                                <li><strong style={{ color: 'var(--text-primary)' }}>Correction:</strong> Request correction of inaccurate information</li>
                                <li><strong style={{ color: 'var(--text-primary)' }}>Deletion:</strong> Request deletion of your personal information and account</li>
                            </ul>
                            <p className="mt-4">
                                To exercise these rights, please contact us at{' '}
                                <a href="mailto:support@voltalabs.space" className="font-medium hover:underline underline-offset-4" style={{ color: 'var(--accent-coral)' }}>support@voltalabs.space</a>.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>7. Contact Us</h2>
                            <p>
                                If you have any questions about this Privacy Policy or our data practices, please contact us at:{' '}
                                <a href="mailto:support@voltalabs.space" className="font-medium hover:underline underline-offset-4" style={{ color: 'var(--accent-coral)' }}>support@voltalabs.space</a>
                            </p>
                        </section>
                    </div>

                    {/* Footer Links */}
                    <div className="mt-12 pt-8" style={{ borderTop: '2px solid var(--border-dark)' }}>
                        <div className="flex flex-wrap justify-center gap-6 text-sm">
                            <Link href="/terms" className="hover:underline underline-offset-4" style={{ color: 'var(--text-body)' }}>Terms of Service</Link>
                            <Link href="/privacy" className="font-semibold" style={{ color: 'var(--accent-coral)' }}>Privacy Policy</Link>
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
