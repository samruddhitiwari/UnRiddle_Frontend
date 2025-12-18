import Link from 'next/link'
import { FileText, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Unriddle</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/pricing"
                className="text-slate-400 hover:text-white transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/login"
                className="text-slate-400 hover:text-white transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-sm mb-8">
            <Sparkles className="w-4 h-4" />
            AI-Powered Document Intelligence
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Chat with your
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Documents
            </span>
          </h1>

          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Upload any PDF and have intelligent conversations. Get instant answers,
            discover insights, and navigate complex documents with AI.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold transition-all shadow-lg shadow-indigo-500/30 flex items-center gap-2"
            >
              Start for Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-all"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything you need for document intelligence
            </h2>
            <p className="text-slate-400 text-lg">
              Powerful features to extract knowledge from your documents
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 hover:border-indigo-500/30 transition-all">
              <div className="w-14 h-14 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Instant Processing</h3>
              <p className="text-slate-400">
                Upload your PDF and start chatting in seconds. Our AI processes
                documents lightning fast.
              </p>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 hover:border-purple-500/30 transition-all">
              <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center mb-6">
                <Sparkles className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Semantic Search</h3>
              <p className="text-slate-400">
                Ask questions in natural language. Our AI understands context
                and finds the most relevant answers.
              </p>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 hover:border-emerald-500/30 transition-all">
              <div className="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Secure & Private</h3>
              <p className="text-slate-400">
                Your documents are encrypted and never shared.
                Enterprise-grade security for peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-3xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to unlock your documents?
            </h2>
            <p className="text-slate-400 text-lg mb-8">
              Start with 50 free queries. No credit card required.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold transition-all shadow-lg shadow-indigo-500/30"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-semibold">Unriddle</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/terms" className="text-slate-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-slate-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/refund" className="text-slate-400 hover:text-white transition-colors">
                Refund Policy
              </Link>
            </div>
          </div>
          <div className="text-center text-slate-500 text-sm">
            © {new Date().getFullYear()} Volta Labs. All rights reserved. Payments processed by Paddle.com
          </div>
        </div>
      </footer>
    </div>
  )
}
