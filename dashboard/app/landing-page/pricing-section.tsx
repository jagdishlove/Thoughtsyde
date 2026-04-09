"use client";
import PricingCard from "./pricing-card";
import { Badge } from "@/components/ui/badge";

export type PricingPlan = {
  title: string;
  price: number;
  description: string;
  isPopular: boolean;
  features: string[];
  planKey: "free" | "monthly" | "yearly";
};

export const pricingPlans: PricingPlan[] = [
  {
    title: "Free",
    price: 0,
    description: "Perfect for side projects and testing",
    isPopular: false,
    planKey: "free",
    features: [
      "3 projects",
      "Unlimited feedback",
      "Basic analytics",
      "Email support",
      "2GB storage",
    ],
  },
  {
    title: "Monthly",
    price: 6.99,
    description: "For growing teams and startups",
    isPopular: true,
    planKey: "monthly",
    features: [
      "10 projects",
      "Unlimited feedback",
      "Advanced analytics",
      "Priority support",
      "5GB storage",
      "Export data (CSV)",
    ],
  },
  {
    title: "Yearly",
    price: 39.99,
    description: "Best value for serious businesses",
    isPopular: false,
    planKey: "yearly",
    features: [
      "50 projects",
      "Unlimited feedback",
      "Advanced analytics",
      "24/7 support",
      "50GB storage",
      "Export data (CSV)",
      "2 months free",
    ],
  },
];

type PricingSectionProps = {
  isAuthenticated?: boolean;
  currentPlan?: string | null;
  hasActiveSubscription?: boolean;
  onManageSubscription?: () => void;
};

const PricingSection = ({
  isAuthenticated = false,
  currentPlan = "free",
  hasActiveSubscription = false,
  onManageSubscription,
}: PricingSectionProps) => {
  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm">
            Simple Pricing
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Flexible Pricing to Fit Your Needs
          </h2>
          <p className="text-lg text-gray-600">
            {!isAuthenticated
              ? "Sign up to get started. Start free, upgrade when you're ready."
              : hasActiveSubscription
                ? `You're currently on the ${currentPlan} plan. Switch plans or manage your subscription below.`
                : "Start free, upgrade when you're ready. No hidden fees, cancel anytime."}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <PricingCard
              key={index}
              {...plan}
              isAuthenticated={isAuthenticated}
              isCurrentPlan={isAuthenticated && currentPlan === plan.planKey}
              hasActiveSubscription={hasActiveSubscription}
              onManageSubscription={onManageSubscription}
            />
          ))}
        </div>

        {/* Trust note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            💳 Secure payment via Stripe • Cancel anytime • 30-day money-back
            guarantee
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
