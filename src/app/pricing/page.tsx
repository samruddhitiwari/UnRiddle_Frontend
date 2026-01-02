"use client";

import Link from 'next/link'
import { Check, Zap, Crown, Building2, ArrowLeft, FileText, Timer, Mail } from 'lucide-react'

interface Plan {
  id: string
  name: string
  price: number | string
  period: string
  description: string
  features: string[]
  icon: any
  bgColor: string
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
    bgColor: 'var(--bg-cream)',
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
    bgColor: 'var(--bg-mint)',
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
    bgColor: 'var(--bg-peach)',
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
    bgColor: 'var(--bg-lavender)',
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
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-cream)' }}>
      {/* Navigation */}
      <nav
        className="sticky top-0 z-50 px-4 py-4"
        style={{
          backgroundColor: 'var(--bg-cream)',
          borderBottom: '2px solid var(--border-dark)'
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div
              className="w-10 h-10 flex items-center justify-center"
              style={{
                backgroundColor: 'var(--accent-coral)',
                border: '2px solid var(--border-dark)',
                borderRadius: '8px'
              }}
            >
              <FileText className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
            </div>
            <span className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Unriddle
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium hover:underline underline-offset-4"
              style={{ color: 'var(--text-body)' }}
            >
              Sign in
            </Link>
            <Link href="/login" className="btn-primary text-sm py-2 px-4">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium mb-8 hover:underline underline-offset-4"
          style={{ color: 'var(--text-body)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <div className="max-w-2xl">
          <h1 className="heading-xl mb-4">
            Simple, honest pricing
          </h1>
          <p className="body-lg">
            Start free. Upgrade when you need more. No hidden fees.
          </p>
        </div>
      </div>

      {/* Plans */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const Icon = plan.icon
            return (
              <div
                key={plan.id}
                className="brutalist-card relative"
                style={{ backgroundColor: plan.bgColor }}
              >
                {plan.popular && (
                  <div
                    className="absolute -top-3 left-4 px-3 py-1 text-sm font-semibold"
                    style={{
                      backgroundColor: 'var(--accent-coral)',
                      border: '2px solid var(--border-dark)',
                      borderRadius: '6px'
                    }}
                  >
                    Most Popular
                  </div>
                )}

                <div className="p-6">
                  {/* Icon */}
                  <div
                    className="w-12 h-12 flex items-center justify-center mb-4"
                    style={{
                      backgroundColor: 'var(--bg-white)',
                      border: '2px solid var(--border-dark)',
                      borderRadius: '8px'
                    }}
                  >
                    <Icon className="w-6 h-6" style={{ color: 'var(--text-primary)' }} />
                  </div>

                  {/* Header */}
                  <h3 className="heading-md mb-2">{plan.name}</h3>
                  <p className="body-md mb-4" style={{ color: 'var(--text-muted)' }}>
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mb-6">
                    {typeof plan.price === 'number' ? (
                      <>
                        <span className="text-4xl font-bold">${plan.price}</span>
                        {plan.period && (
                          <span style={{ color: 'var(--text-muted)' }}>/{plan.period}</span>
                        )}
                        {plan.oneTime && (
                          <span
                            className="ml-2 text-sm font-semibold"
                            style={{ color: 'var(--accent-teal)' }}
                          >
                            one-time
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-4xl font-bold">{plan.price}</span>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check
                          className="w-5 h-5 flex-shrink-0 mt-0.5"
                          style={{ color: 'var(--accent-teal)' }}
                        />
                        <span className="text-sm" style={{ color: 'var(--text-body)' }}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  {plan.contactSales ? (
                    <Link
                      href="/contact"
                      className="btn-secondary w-full justify-center text-sm"
                    >
                      <Mail className="w-4 h-4" />
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
                      className="btn-primary w-full justify-center text-sm"
                    >
                      Upgrade to Pro
                    </button>
                  ) : (
                    <Link
                      href={plan.id === "free" ? "/login" : "/checkout"}
                      className={plan.id === "starter" ? "btn-primary w-full justify-center text-sm" : "btn-secondary w-full justify-center text-sm"}
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
      <div className="py-16" style={{ backgroundColor: 'var(--bg-white)' }}>
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="heading-lg mb-12">Common questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "Can I upgrade or downgrade at any time?",
                a: "Yes! You can change your plan whenever you need. Upgrades take effect immediately, downgrades at your next billing cycle."
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept PayPal and all major credit/debit cards through our secure payment processor."
              },
              {
                q: "Is my data secure?",
                a: "Yes. All documents are encrypted at rest and in transit. We never share your data, and you can delete everything anytime."
              },
              {
                q: "What happens when I hit my limit?",
                a: "You'll get a notification. You can upgrade your plan or wait for the monthly reset to continue."
              },
              {
                q: "Do you offer refunds?",
                a: "Yes, we have a 14-day money-back guarantee for all paid plans. No questions asked."
              }
            ].map((item, idx) => (
              <div key={idx} className="brutalist-card p-6">
                <h3 className="font-semibold text-lg mb-2">{item.q}</h3>
                <p style={{ color: 'var(--text-body)' }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-16" style={{ backgroundColor: 'var(--bg-peach)' }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="brutalist-card p-12" style={{ backgroundColor: 'var(--bg-white)' }}>
            <h2 className="heading-lg mb-4">Ready to get started?</h2>
            <p className="body-lg mb-8">
              Join people who are already chatting with their documents.
            </p>
            <Link href="/login" className="btn-primary inline-flex">
              Start Free Trial
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="px-4 py-8"
        style={{
          backgroundColor: 'var(--bg-cream)',
          borderTop: '2px solid var(--border-dark)'
        }}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 flex items-center justify-center"
              style={{
                backgroundColor: 'var(--accent-coral)',
                border: '2px solid var(--border-dark)',
                borderRadius: '6px'
              }}
            >
              <FileText className="w-4 h-4" style={{ color: 'var(--text-primary)' }} />
            </div>
            <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
              Unriddle
            </span>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} Volta Labs. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
