import Link from 'next/link'
import { FileText, ArrowLeft } from 'lucide-react'

export const metadata = {
    title: 'Privacy Policy | Unriddle',
    description: 'Privacy Policy for Unriddle - How we collect, use, and protect your data',
}

export default function PrivacyPage() {
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

                    <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
                    <p className="text-slate-400 mb-8">Last updated: December 2024</p>

                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 space-y-8 text-slate-300 leading-relaxed">

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">1. Introduction</h2>
                            <p>
                                Unriddle is operated by Volta Labs. This Privacy Policy explains how we collect, use, disclose, and protect your information when you use our AI-powered document analysis service at{' '}
                                <a href="https://unriddle.voltalabs.space" className="text-indigo-400 hover:underline">unriddle.voltalabs.space</a>.
                                We are committed to protecting your privacy and handling your data responsibly.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">2. Information We Collect</h2>

                            <h3 className="text-lg font-medium text-white mt-4 mb-2">Account Information</h3>
                            <p className="mb-3">When you create an account, we collect:</p>
                            <ul className="list-disc list-inside space-y-1 ml-4 mb-4">
                                <li>Email address</li>
                                <li>Authentication credentials (managed securely through our authentication provider)</li>
                            </ul>

                            <h3 className="text-lg font-medium text-white mt-4 mb-2">Documents and Content</h3>
                            <p className="mb-3">When you use our service, we collect:</p>
                            <ul className="list-disc list-inside space-y-1 ml-4 mb-4">
                                <li>PDF documents you upload for analysis</li>
                                <li>Questions and queries you submit about your documents</li>
                                <li>AI-generated responses and analysis results</li>
                            </ul>

                            <h3 className="text-lg font-medium text-white mt-4 mb-2">Usage Data</h3>
                            <p className="mb-3">We automatically collect certain information about your use of the service:</p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                                <li>Date and time of access</li>
                                <li>Features used and actions taken</li>
                                <li>Device type and browser information</li>
                                <li>General location information (country/region level)</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
                            <p className="mb-3">We use the information we collect to:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li><strong className="text-white">Provide the Service:</strong> Process your documents, respond to your queries, and deliver AI-powered analysis</li>
                                <li><strong className="text-white">Maintain Your Account:</strong> Authenticate your access and manage your subscription</li>
                                <li><strong className="text-white">Improve the Service:</strong> Analyze usage patterns to enhance features and user experience</li>
                                <li><strong className="text-white">Communicate with You:</strong> Send service-related notifications, respond to inquiries, and provide customer support</li>
                                <li><strong className="text-white">Ensure Security:</strong> Detect and prevent fraud, abuse, and security incidents</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">4. AI Processing Disclosure</h2>
                            <p className="mb-3">
                                To provide our document analysis features, the content of your uploaded documents is processed by third-party AI systems. This processing is necessary to:
                            </p>
                            <ul className="list-disc list-inside space-y-1 ml-4 mb-4">
                                <li>Generate text embeddings for semantic search</li>
                                <li>Answer your questions about document content</li>
                                <li>Provide AI-powered insights and summaries</li>
                            </ul>
                            <p>
                                Document content is sent to AI providers solely for processing your requests. We select AI providers that maintain appropriate security and confidentiality standards. Your documents are not used to train AI models unless you explicitly consent.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">5. Payment Information</h2>
                            <p>
                                All payment transactions are processed by Paddle.com, our Merchant of Record. We do not collect, store, or have access to your credit card numbers, bank account details, or other sensitive payment information. Paddle handles all payment data in accordance with PCI-DSS standards. For information about how Paddle processes your payment data, please refer to{' '}
                                <a href="https://www.paddle.com/legal/privacy" className="text-indigo-400 hover:underline" target="_blank" rel="noopener noreferrer">Paddle&apos;s Privacy Policy</a>.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">6. Cookies and Analytics</h2>
                            <p className="mb-3">
                                We use cookies and similar technologies to:
                            </p>
                            <ul className="list-disc list-inside space-y-1 ml-4 mb-4">
                                <li>Maintain your authentication session</li>
                                <li>Remember your preferences</li>
                                <li>Understand how you use our service</li>
                            </ul>
                            <p>
                                We may use analytics services to help us understand usage patterns. These services collect information sent by your browser, including pages visited and other usage data. You can control cookies through your browser settings, though some features may not function properly without them.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">7. Data Sharing</h2>
                            <p className="mb-3">
                                We do not sell your personal information. We may share your information only in the following circumstances:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li><strong className="text-white">Service Providers:</strong> With third parties who assist in operating our service (AI processing, hosting, analytics), under confidentiality obligations</li>
                                <li><strong className="text-white">Payment Processing:</strong> With Paddle for billing and subscription management</li>
                                <li><strong className="text-white">Legal Requirements:</strong> When required by law, legal process, or to protect our rights and safety</li>
                                <li><strong className="text-white">Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, with appropriate notice</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">8. Data Retention</h2>
                            <p className="mb-3">We retain your information as follows:</p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                                <li><strong className="text-white">Account Data:</strong> Retained while your account is active and for a reasonable period after deletion for legal and operational purposes</li>
                                <li><strong className="text-white">Documents:</strong> Stored while your account is active. You may delete documents at any time</li>
                                <li><strong className="text-white">Usage Data:</strong> Retained in aggregated or anonymized form for analytics purposes</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">9. Your Rights</h2>
                            <p className="mb-3">Depending on your location, you may have the following rights regarding your personal information:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li><strong className="text-white">Access:</strong> Request a copy of the personal information we hold about you</li>
                                <li><strong className="text-white">Correction:</strong> Request correction of inaccurate information</li>
                                <li><strong className="text-white">Deletion:</strong> Request deletion of your personal information and account</li>
                                <li><strong className="text-white">Data Portability:</strong> Request an export of your data in a portable format</li>
                                <li><strong className="text-white">Withdraw Consent:</strong> Where processing is based on consent, withdraw that consent at any time</li>
                            </ul>
                            <p className="mt-4">
                                To exercise these rights, please contact us at{' '}
                                <a href="mailto:privacy@voltalabs.space" className="text-indigo-400 hover:underline">privacy@voltalabs.space</a>.
                                We will respond to your request within a reasonable timeframe.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">10. Security</h2>
                            <p>
                                We implement reasonable technical and organizational measures to protect your information against unauthorized access, alteration, disclosure, or destruction. These measures include encryption of data in transit and at rest, access controls, and regular security assessments. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">11. International Users</h2>
                            <p>
                                Unriddle is accessible to users globally. By using our service, you consent to the transfer and processing of your information in countries where we or our service providers operate. We take steps to ensure that your information receives an adequate level of protection regardless of where it is processed.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">12. Children&apos;s Privacy</h2>
                            <p>
                                Unriddle is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected information from a child, we will take steps to delete it promptly.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">13. Changes to This Policy</h2>
                            <p>
                                We may update this Privacy Policy from time to time. When we make material changes, we will update the date at the top of this page and, where appropriate, notify you via email or through the service. We encourage you to review this policy periodically.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">14. Contact Us</h2>
                            <p>
                                If you have any questions about this Privacy Policy or our data practices, please contact us at:{' '}
                                <a href="mailto:privacy@voltalabs.space" className="text-indigo-400 hover:underline">privacy@voltalabs.space</a>
                            </p>
                        </section>
                    </div>

                    {/* Footer Links */}
                    <div className="mt-12 pt-8 border-t border-slate-800">
                        <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
                            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                            <Link href="/privacy" className="text-indigo-400">Privacy Policy</Link>
                            <Link href="/refund" className="hover:text-white transition-colors">Refund Policy</Link>
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
