"use client";

import Link from 'next/link'
import { Check, Zap, Crown, Building2, ArrowLeft, FileText, Timer, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Plan {
  id: string
  name: string
  price: number | string
  period: string
  description: string
  features: string[]
  icon: any
  gradient: string
  popular?: boolean
  oneTime?: boolean
  contactSales?: boolean
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Perfect for trying out Unriddle',
    icon: Zap,
    gradient: 'from-slate-600 to-slate-700',
    features: [
      '5 documents',
      '50 queries per month',
      '10MB max file size',
      'Basic chat interface',
      'Community support',
    ],
  },
  {
    id: 'starter',
    name: 'Starter Pass',
    price: 3,
    period: '14 days',
    description: 'Full access trial - no subscription',
    icon: Timer,
    gradient: 'from-emerald-500 to-teal-600',
    oneTime: true,
    features: [
      '50 documents',
      '500 queries',
      '50MB max file size',
      'Priority processing',
      'Source citations',
      'No auto-renewal',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 6,
    period: 'month',
    description: 'For professionals who need more',
    icon: Crown,
    gradient: 'from-indigo-500 to-purple-600',
    popular: true,
    features: [
      '50 documents',
      '500 queries per month',
      '50MB max file size',
      'Priority processing',
      'Source citations',
      'Priority support',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For teams and organizations',
    icon: Building2,
    gradient: 'from-purple-500 to-pink-600',
    contactSales: true,
    features: [
      'Unlimited documents',
      'Unlimited queries',
      '100MB max file size',
      'Dedicated support',
      'Custom integrations',
      'SSO authentication',
      'Team collaboration',
    ],
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <FileText className="w-6 h-6 text-indigo-600" />
              Unriddle
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/signin" className="text-gray-600 hover:text-gray-900 transition-colors">
                Sign in
              </Link>
              <Link href="/signup" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
        
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-gray-600">
            Start free and upgrade when you need more. No hidden fees, cancel anytime.
          </p>
        </div>
      </div>

      {/* Plans */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const Icon = plan.icon
            return (
              <div
                key={plan.id}
                className={cn(
                  "relative bg-white rounded-2xl border-2 transition-all hover:shadow-xl hover:-translate-y-1",
                  plan.popular ? "border-indigo-500 shadow-lg" : "border-gray-200"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-6">
                  {/* Icon */}
                  <div className={cn(
                    "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4",
                    plan.gradient
                  )}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Header */}
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{plan.description}</p>

                  {/* Price */}
                  <div className="mb-6">
                    {typeof plan.price === 'number' ? (
                      <>
                        <span className="text-4xl font-bold">${plan.price}</span>
                        {plan.period && <span className="text-gray-600">/{plan.period}</span>}
                        {plan.oneTime && <span className="text-emerald-600 text-sm ml-2 font-semibold">one-time</span>}
                      </>
                    ) : (
                      <span className="text-4xl font-bold">{plan.price}</span>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  {plan.contactSales ? (
                    <Link
                      href="/contact"
                      className="block w-full py-3 rounded-xl font-semibold text-center transition-all border-2 border-purple-500 text-purple-600 hover:bg-purple-50"
                    >
                      <Mail className="w-4 h-4 inline mr-2" />
                      Contact Sales
                    </Link>
                  ) : plan.id === "pro" ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.location.assign(
                          "https://checkout.dodopayments.com/buy/pdt_0NVJl7v7rUIYOFuhWmwZl?quantity=1"
                        );
                      }}
                      className="block w-full py-4 rounded-xl font-semibold text-center transition-all bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/30"
                    >
                      Upgrade to Pro
                    </button>

                  ) : (
                    <Link
                      href={plan.id === "free" ? "/signup" : "/checkout"}
                      className={cn(
                        "block w-full py-3 rounded-xl font-semibold text-center transition-all",
                        plan.id === "starter"
                          ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/30"
                          : "border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      {plan.id === "free" ? "Get Started Free" : "Buy Starter Pass"}
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-slate-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              {
                q: "Can I upgrade or downgrade at any time?",
                a: "Yes! You can change your plan at any time. When upgrading, you'll be charged the prorated difference. When downgrading, the change takes effect at your next billing cycle."
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept PayPal and all major credit/debit cards through our secure payment processor. Enterprise customers can also pay via invoice."
              },
              {
                q: "Is my data secure?",
                a: "Absolutely. All documents are encrypted at rest and in transit using AES-256 encryption. We never share your data with third parties and you can delete your data at any time."
              },
              {
                q: "What happens when I reach my limit?",
                a: "You'll receive a notification when you're close to your limit. Once reached, you can upgrade your plan or wait for the monthly reset to continue querying."
              },
              {
                q: "Do you offer refunds?",
                a: "Yes, we offer a 14-day money-back guarantee for all paid plans. If you're not satisfied, contact us for a full refund."
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-2">{item.q}</h3>
                <p className="text-gray-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of users who are already chatting with their documents.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/30"
          >
            Start Free Trial
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-slate-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 font-bold text-xl">
              <FileText className="w-6 h-6 text-indigo-600" />
              Unriddle
            </div>
            <p className="text-gray-600 text-sm">
              © 2024 Unriddle. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
