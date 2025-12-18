import Link from 'next/link'
import { FileText, ArrowLeft } from 'lucide-react'

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

                    <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>

                    <div className="prose prose-invert prose-slate max-w-none">
                        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 space-y-6">
                            <section>
                                <h2 className="text-xl font-semibold text-white mb-4">1. Information We Collect</h2>
                                <p className="text-slate-400">
                                    We collect information you provide directly, including:
                                </p>
                                <ul className="list-disc list-inside text-slate-400 mt-2 space-y-1">
                                    <li>Email address (for account creation)</li>
                                    <li>Documents you upload for processing</li>
                                    <li>Queries and chat history</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
                                <p className="text-slate-400">
                                    Your information is used to:
                                </p>
                                <ul className="list-disc list-inside text-slate-400 mt-2 space-y-1">
                                    <li>Provide and improve the Service</li>
                                    <li>Process your documents with AI</li>
                                    <li>Communicate with you about your account</li>
                                    <li>Process payments through Paddle</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-white mb-4">3. Data Storage and Security</h2>
                                <p className="text-slate-400">
                                    Your documents and data are stored securely using industry-standard encryption:
                                </p>
                                <ul className="list-disc list-inside text-slate-400 mt-2 space-y-1">
                                    <li>All data is encrypted at rest and in transit</li>
                                    <li>Documents are stored in isolated user containers</li>
                                    <li>We use Supabase for secure data storage</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-white mb-4">4. Data Sharing</h2>
                                <p className="text-slate-400">
                                    We do NOT sell your personal data. We only share data with:
                                </p>
                                <ul className="list-disc list-inside text-slate-400 mt-2 space-y-1">
                                    <li>Paddle (payment processing)</li>
                                    <li>AI providers (document processing - text only, no PII)</li>
                                    <li>Law enforcement (only if legally required)</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-white mb-4">5. Your Rights</h2>
                                <p className="text-slate-400">
                                    You have the right to:
                                </p>
                                <ul className="list-disc list-inside text-slate-400 mt-2 space-y-1">
                                    <li>Access your personal data</li>
                                    <li>Delete your account and all associated data</li>
                                    <li>Export your data</li>
                                    <li>Opt out of marketing communications</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-white mb-4">6. Cookies</h2>
                                <p className="text-slate-400">
                                    We use essential cookies for authentication and session management. We do not use tracking cookies for advertising.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-white mb-4">7. Data Retention</h2>
                                <p className="text-slate-400">
                                    We retain your data for as long as your account is active. Upon account deletion, all your documents and data are permanently removed within 30 days.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-white mb-4">8. Contact</h2>
                                <p className="text-slate-400">
                                    For privacy inquiries, contact us at: privacy@unriddle.voltalabs.space
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
