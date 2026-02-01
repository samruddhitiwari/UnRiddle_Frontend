"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Check,
  Zap,
  Crown,
  Building2,
  Timer,
  Clock,
  AlertTriangle,
  Mail,
} from "lucide-react";
import Link from "next/link";

/* ------------------ CONFIG ------------------ */

const DODO_PRO_CHECKOUT =
  "https://checkout.dodopayments.com/buy/pdt_0NVJl7v7rUIYOFuhWmwZl?quantity=1";

const DODO_STARTER_CHECKOUT =
  "https://checkout.dodopayments.com/buy/pdt_0NXZIO5U1Po7oCj7R7O73?quantity=1";

const SUPPORT_EMAIL = "support@unriddle.voltalabs.space";

/* ------------------ TYPES ------------------ */

interface Plan {
  id: string;
  name: string;
  price: number | string;
  period: string;
  description: string;
  features: string[];
  icon: any;
  bgColor: string;
  popular?: boolean;
  oneTime?: boolean;
  contactSales?: boolean;
}

/* ------------------ PLANS ------------------ */

const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "forever",
    description: "Perfect for trying out Unriddle",
    icon: Zap,
    bgColor: "var(--bg-cream)",
    features: [
      "5 documents",
      "50 queries per month",
      "10MB max file size",
      "Basic chat interface",
      "Community support",
    ],
  },
  {
    id: "starter",
    name: "Starter Pass",
    price: 3,
    period: "14 days",
    description: "Full access trial (no auto-renewal)",
    icon: Timer,
    bgColor: "var(--bg-mint)",
    oneTime: true,
    features: [
      "50 documents",
      "500 queries",
      "50MB max file size",
      "Priority processing",
      "Source citations",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 6,
    period: "month",
    description: "For professionals who need more",
    icon: Crown,
    bgColor: "var(--bg-peach)",
    popular: true,
    features: [
      "50 documents",
      "500 queries per month",
      "50MB max file size",
      "Priority processing",
      "Source citations",
      "Priority support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For teams and organizations",
    icon: Building2,
    bgColor: "var(--bg-lavender)",
    contactSales: true,
    features: [
      "Unlimited documents",
      "Unlimited queries",
      "100MB max file size",
      "Dedicated support",
      "Custom integrations",
      "SSO authentication",
    ],
  },
];

/* ------------------ PAGE ------------------ */

export default function SubscriptionPage() {
  const supabase = createClient();

  const [currentPlan, setCurrentPlan] = useState("free");
  const [subscriptionStatus, setSubscriptionStatus] = useState("active");
  const [userData, setUserData] = useState<any>(null);
  const [starterDaysRemaining, setStarterDaysRemaining] = useState<number | null>(
    null
  );

  /* ---------- LOAD USER ---------- */

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!data) return;

      setUserData(data);
      setCurrentPlan(data.plan_type || "free");
      setSubscriptionStatus(data.subscription_status || "active");

      if (data.plan_type === "starter" && data.starter_pass_expires_at) {
        const expiresAt = new Date(data.starter_pass_expires_at);
        const now = new Date();
        const days = Math.max(
          0,
          Math.ceil(
            (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
          )
        );
        setStarterDaysRemaining(days);
      }
    };

    loadUser();
  }, []);

  /* ---------- HELPERS ---------- */

  const redirectToDodo = () => {
    window.location.assign(DODO_PRO_CHECKOUT);
  };

  const redirectToStarterCheckout = () => {
    window.location.assign(DODO_STARTER_CHECKOUT);
  };

  const hasSubscriptionIssue = ["past_due", "cancelled", "expired", "paused"].includes(
    subscriptionStatus
  );

  /* ------------------ UI ------------------ */

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="heading-lg">Choose your plan</h1>
        <p className="body-md mt-2" style={{ color: 'var(--text-muted)' }}>
          Unlock the full power of document intelligence
        </p>
      </div>

      {/* Subscription Issue Banner */}
      {hasSubscriptionIssue && (
        <div
          className="brutalist-card p-4 flex gap-4"
          style={{ backgroundColor: '#FFF0F0' }}
        >
          <AlertTriangle className="w-6 h-6" style={{ color: '#CC0000' }} />
          <div className="flex-1">
            <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              Subscription issue detected
            </div>
            <div className="text-sm mt-1" style={{ color: 'var(--text-body)' }}>
              Please contact support to resolve billing issues.
            </div>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="btn-primary inline-flex mt-3 text-sm py-2 px-4"
            >
              <Mail className="w-4 h-4" />
              Contact Support
            </a>
          </div>
        </div>
      )}

      {/* Starter Expiry */}
      {currentPlan === "starter" &&
        starterDaysRemaining !== null &&
        starterDaysRemaining <= 3 && (
          <div
            className="brutalist-card p-4 flex items-center gap-4"
            style={{ backgroundColor: 'var(--bg-pale-yellow)' }}
          >
            <Clock className="w-6 h-6" style={{ color: 'var(--text-primary)' }} />
            <div className="flex-1">
              <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                Starter Pass expiring soon
              </div>
              <div className="text-sm" style={{ color: 'var(--text-body)' }}>
                Upgrade to Pro to keep your access.
              </div>
            </div>
            <button
              onClick={redirectToDodo}
              className="btn-primary text-sm py-2 px-4"
            >
              Upgrade to Pro
            </button>
          </div>
        )}

      {/* Plans */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="brutalist-card relative p-6"
            style={{
              backgroundColor: plan.bgColor,
              boxShadow: currentPlan === plan.id ? '6px 6px 0 var(--border-dark)' : undefined
            }}
          >
            {plan.popular && (
              <div
                className="absolute -top-3 left-4 px-3 py-1 text-sm font-semibold"
                style={{
                  backgroundColor: 'var(--accent-coral)',
                  border: '2px solid var(--border-dark)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)'
                }}
              >
                Most Popular
              </div>
            )}

            <div
              className="w-12 h-12 flex items-center justify-center mb-4"
              style={{
                backgroundColor: 'var(--bg-white)',
                border: '2px solid var(--border-dark)',
                borderRadius: '8px'
              }}
            >
              <plan.icon className="w-6 h-6" style={{ color: 'var(--text-primary)' }} />
            </div>

            <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{plan.name}</h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{plan.description}</p>

            <div className="mt-4 mb-6">
              {typeof plan.price === "number" ? (
                <>
                  <span className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    ${plan.price}
                  </span>
                  {plan.period && (
                    <span style={{ color: 'var(--text-muted)' }}>/{plan.period}</span>
                  )}
                  {plan.oneTime && (
                    <span
                      className="ml-2 text-xs font-semibold px-2 py-0.5"
                      style={{
                        backgroundColor: 'var(--accent-teal)',
                        border: '1px solid var(--border-dark)',
                        borderRadius: '4px',
                        color: 'var(--text-primary)'
                      }}
                    >
                      one-time
                    </span>
                  )}
                </>
              ) : (
                <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {plan.price}
                </span>
              )}
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((f, i) => (
                <li key={i} className="flex gap-2 text-sm" style={{ color: 'var(--text-body)' }}>
                  <Check className="w-4 h-4" style={{ color: 'var(--accent-teal)' }} /> {f}
                </li>
              ))}
            </ul>

            {plan.contactSales ? (
              <a
                href={`mailto:sales@unriddle.voltalabs.space`}
                className="btn-secondary w-full justify-center text-sm"
              >
                <Mail className="w-4 h-4" />
                Contact Sales
              </a>
            ) : plan.id === "pro" ? (
              <button
                onClick={redirectToDodo}
                className="btn-primary w-full justify-center text-sm"
              >
                Upgrade to Pro
              </button>
            ) : plan.id === "starter" ? (
              <a
                href={currentPlan === "starter" || currentPlan === "pro" ? undefined : DODO_STARTER_CHECKOUT}
                className={`btn-primary w-full justify-center text-sm inline-flex ${currentPlan === "starter" || currentPlan === "pro" ? "cursor-not-allowed opacity-50 pointer-events-none" : ""}`}
              >
                {currentPlan === "starter" ? "Current Plan" : "Buy Starter Pass"}
              </a>
            ) : (
              <button
                disabled
                className="btn-secondary w-full justify-center text-sm cursor-not-allowed opacity-50"
              >
                {currentPlan === plan.id ? "Current Plan" : "Get Started Free"}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Legal */}
      <div className="text-center text-sm" style={{ color: 'var(--text-muted)' }}>
        <Link href="/terms" className="hover:underline underline-offset-4">Terms</Link>
        {" · "}
        <Link href="/privacy" className="hover:underline underline-offset-4">Privacy</Link>
        {" · "}
        <Link href="/refund" className="hover:underline underline-offset-4">Refund</Link>
        {" · Payments processed securely"}
      </div>
    </div>
  );
}
