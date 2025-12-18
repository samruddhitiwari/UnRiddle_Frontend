import Link from 'next/link'
import { FileText, ArrowLeft } from 'lucide-react'

export const metadata = {
    title: 'Terms of Service | Unriddle',
    description: 'Terms of Service for Unriddle - AI-powered document analysis',
}

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

                    <h1 className="text-4xl font-bold text-white mb-2">Terms of Service</h1>
                    <p className="text-slate-400 mb-8">Last updated: December 2024</p>

                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 space-y-8 text-slate-300 leading-relaxed">

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">1. Introduction</h2>
                            <p>
                                Welcome to Unriddle. Unriddle is operated by Volta Labs. By accessing or using our service at{' '}
                                <a href="https://unriddle.voltalabs.space" className="text-indigo-400 hover:underline">unriddle.voltalabs.space</a>,
                                you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">2. Description of Service</h2>
                            <p>
                                Unriddle is an AI-powered document analysis platform that allows users to upload PDF documents and interact with them using natural language queries. Our service uses artificial intelligence to process, analyze, and provide insights from your documents.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">3. Eligibility</h2>
                            <p>
                                You must be at least 18 years of age to use Unriddle. By using our service, you represent and warrant that you are at least 18 years old and have the legal capacity to enter into these Terms. If you are using the service on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">4. Account Responsibilities</h2>
                            <p className="mb-3">
                                When you create an account with Unriddle, you agree to:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Provide accurate and complete information during registration</li>
                                <li>Maintain the security of your account credentials</li>
                                <li>Promptly notify us of any unauthorized access to your account</li>
                                <li>Accept responsibility for all activities that occur under your account</li>
                                <li>Not share your account with others or transfer it to another party</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">5. Subscription Plans and Billing</h2>
                            <p className="mb-3">Unriddle offers the following plans:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                                <li><strong className="text-white">Free Plan:</strong> Limited access with usage restrictions, available at no cost</li>
                                <li><strong className="text-white">Starter Pass:</strong> A one-time payment of $3 USD providing full access for 14 days. This is not a subscription and does not automatically renew</li>
                                <li><strong className="text-white">Pro Plan:</strong> A monthly subscription at $6 USD per month with full access to all features. This subscription automatically renews each month until cancelled</li>
                                <li><strong className="text-white">Enterprise:</strong> Custom pricing for organizations with specific needs. Contact us for details</li>
                            </ul>
                            <p className="mb-3">
                                All payments are processed by Paddle.com, our Merchant of Record. By making a purchase, you agree to Paddle&apos;s terms of service and authorize them to charge your selected payment method. Paddle handles all billing, taxes, and payment processing on our behalf.
                            </p>
                            <p>
                                Subscription renewals will be charged to your payment method on file at the then-current rate. You may cancel your subscription at any time through your account settings or the Paddle customer portal.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">6. Third-Party Services</h2>
                            <p className="mb-3">
                                Unriddle integrates with third-party services to provide its functionality:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li><strong className="text-white">AI Processing:</strong> Your documents are processed using third-party AI systems to enable document analysis and question-answering capabilities. Document content is sent to these providers solely for processing purposes</li>
                                <li><strong className="text-white">Payment Processing:</strong> Paddle.com serves as our Merchant of Record and handles all payment transactions, billing, and related tax compliance</li>
                                <li><strong className="text-white">Authentication:</strong> We use third-party authentication services to securely manage user sign-in</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">7. Acceptable Use</h2>
                            <p className="mb-3">You agree not to use Unriddle to:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Upload, store, or process any illegal, harmful, or offensive content</li>
                                <li>Violate any applicable laws, regulations, or third-party rights</li>
                                <li>Attempt to gain unauthorized access to our systems or other users&apos; accounts</li>
                                <li>Interfere with or disrupt the integrity or performance of the service</li>
                                <li>Reverse engineer, decompile, or attempt to extract the source code of our software</li>
                                <li>Use automated systems or bots to access the service without our permission</li>
                                <li>Resell, redistribute, or sublicense access to the service</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">8. Intellectual Property</h2>
                            <p className="mb-3">
                                <strong className="text-white">Your Content:</strong> You retain all ownership rights to the documents and content you upload to Unriddle. By uploading content, you grant us a limited license to process, analyze, and store your content solely to provide the service to you.
                            </p>
                            <p>
                                <strong className="text-white">Our Service:</strong> Unriddle, including its design, features, and underlying technology, is owned by Volta Labs. You may not copy, modify, or create derivative works based on our service without our express permission.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">9. Service Availability</h2>
                            <p>
                                We strive to maintain reliable service, but we do not guarantee uninterrupted or error-free access. The service may be temporarily unavailable due to maintenance, updates, or circumstances beyond our control. We reserve the right to modify, suspend, or discontinue any aspect of the service at any time with reasonable notice when possible.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">10. Termination and Suspension</h2>
                            <p className="mb-3">
                                We may suspend or terminate your access to Unriddle if:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                                <li>You violate these Terms of Service</li>
                                <li>Your payment fails and is not resolved within a reasonable period</li>
                                <li>We believe your use poses a security risk or may harm other users</li>
                                <li>Required by law or legal process</li>
                            </ul>
                            <p>
                                You may terminate your account at any time by contacting us. Upon termination, your right to use the service ceases, and we may delete your data in accordance with our Privacy Policy.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">11. Disclaimer of Warranties</h2>
                            <p>
                                UNRIDDLE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE, OR THAT ANY DEFECTS WILL BE CORRECTED. AI-GENERATED RESPONSES MAY NOT ALWAYS BE ACCURATE, AND YOU SHOULD VERIFY IMPORTANT INFORMATION INDEPENDENTLY.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">12. Limitation of Liability</h2>
                            <p>
                                TO THE MAXIMUM EXTENT PERMITTED BY LAW, VOLTA LABS AND ITS OPERATORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM YOUR USE OF OR INABILITY TO USE THE SERVICE. OUR TOTAL LIABILITY FOR ANY CLAIMS ARISING FROM THESE TERMS OR YOUR USE OF THE SERVICE SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE TWELVE MONTHS PRECEDING THE CLAIM.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">13. Changes to Terms</h2>
                            <p>
                                We may update these Terms of Service from time to time. When we make material changes, we will notify you by updating the date at the top of this page and, where appropriate, provide additional notice via email or through the service. Your continued use of Unriddle after changes become effective constitutes your acceptance of the revised terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">14. Governing Law and Disputes</h2>
                            <p>
                                These Terms shall be governed by and construed in accordance with applicable laws. Any disputes arising from these Terms or your use of the service shall be resolved through good-faith negotiation. If a resolution cannot be reached, disputes may be submitted to binding arbitration or the appropriate legal venue as determined by applicable law.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">15. Contact Us</h2>
                            <p>
                                If you have any questions about these Terms of Service, please contact us at:{' '}
                                <a href="mailto:legal@voltalabs.space" className="text-indigo-400 hover:underline">legal@voltalabs.space</a>
                            </p>
                        </section>
                    </div>

                    {/* Footer Links */}
                    <div className="mt-12 pt-8 border-t border-slate-800">
                        <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
                            <Link href="/terms" className="text-indigo-400">Terms of Service</Link>
                            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
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
