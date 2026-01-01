"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Check,
  Zap,
  Crown,
  Building2,
  Timer,
  Loader2,
  Clock,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

/* ------------------ CONFIG ------------------ */

const DODO_PRO_CHECKOUT =
  "https://checkout.dodopayments.com/buy/pdt_0NVJl7v7rUIYOFuhWmwZl?quantity=1";

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
  gradient: string;
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
    gradient: "from-slate-600 to-slate-700",
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
    gradient: "from-emerald-500 to-teal-600",
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
    gradient: "from-indigo-500 to-purple-600",
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
    gradient: "from-purple-500 to-pink-600",
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
  const [error, setError] = useState<string | null>(null);

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

  const hasSubscriptionIssue = ["past_due", "cancelled", "expired", "paused"].includes(
    subscriptionStatus
  );

  /* ------------------ UI ------------------ */

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Choose your plan</h1>
        <p className="text-slate-400 mt-2">
          Unlock the full power of document intelligence
        </p>
      </div>

      {/* Subscription Issue Banner */}
      {hasSubscriptionIssue && (
        <div className="p-4 rounded-xl border bg-red-500/10 border-red-500/30 flex gap-4">
          <AlertTriangle className="w-6 h-6 text-red-400" />
          <div className="flex-1">
            <div className="text-white font-semibold">
              Subscription issue detected
            </div>
            <div className="text-slate-400 text-sm mt-1">
              Please contact support to resolve billing issues.
            </div>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="inline-block mt-3 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm"
            >
              Contact Support
            </a>
          </div>
        </div>
      )}

      {/* Starter Expiry */}
      {currentPlan === "starter" &&
        starterDaysRemaining !== null &&
        starterDaysRemaining <= 3 && (
          <div className="p-4 rounded-xl border bg-amber-500/10 border-amber-500/30 flex items-center gap-4">
            <Clock className="w-6 h-6 text-amber-400" />
            <div className="flex-1">
              <div className="text-white font-semibold">
                Starter Pass expiring soon
              </div>
              <div className="text-slate-400 text-sm">
                Upgrade to Pro to keep your access.
              </div>
            </div>
            <button
              onClick={redirectToDodo}
              className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white"
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
            className={cn(
              "relative bg-slate-900/50 border rounded-2xl p-6",
              plan.popular && "border-indigo-500/50",
              currentPlan === plan.id && "ring-2 ring-indigo-500"
            )}
          >
            <plan.icon className="w-10 h-10 text-white mb-4" />

            <h3 className="text-xl font-bold text-white">{plan.name}</h3>
            <p className="text-slate-400 text-sm">{plan.description}</p>

            <div className="mt-4 mb-6">
              {typeof plan.price === "number" ? (
                <>
                  <span className="text-4xl font-bold text-white">
                    ${plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-slate-400">/{plan.period}</span>
                  )}
                </>
              ) : (
                <span className="text-3xl font-bold text-white">
                  {plan.price}
                </span>
              )}
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((f, i) => (
                <li key={i} className="flex gap-2 text-slate-300 text-sm">
                  <Check className="w-4 h-4 text-indigo-400" /> {f}
                </li>
              ))}
            </ul>

            {plan.contactSales ? (
              <a
                href={`mailto:sales@unriddle.voltalabs.space`}
                className="block w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-center"
              >
                Contact Sales
              </a>
            ) : plan.id === "pro" ? (
              <button
                onClick={redirectToDodo}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold"
              >
                Upgrade to Pro
              </button>
            ) : (
              <button
                disabled
                className="w-full py-3 rounded-xl bg-slate-800 text-slate-400 cursor-not-allowed"
              >
                {currentPlan === plan.id ? "Current Plan" : "Unavailable"}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Legal */}
      <div className="text-center text-sm text-slate-500">
        <Link href="/terms">Terms</Link> · <Link href="/privacy">Privacy</Link> ·{" "}
        <Link href="/refund">Refund</Link> · Payments processed securely
      </div>
    </div>
  );
}
