import PricingSection from "./pricing-section";
import Hero from "./hero";
import FeaturesSection from "./features-section";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";

const LandingPage = async () => {
  const { userId } = await auth();

  // Default to "free" plan - will be overridden if user has a paid subscription
  let currentPlan: string = "free";
  let hasActiveSubscription: boolean = false;

  if (userId) {
    const subscription = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.userId, userId),
    });

    if (subscription?.subscribed && subscription.planType) {
      // User has an active paid subscription
      currentPlan = subscription.planType;
      hasActiveSubscription = true;
    }
    // If no subscription or subscribed=false, keep default "free" plan
  }

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <section id="features">
        <FeaturesSection />
      </section>

      {/* Pricing Section */}
      <section id="pricing">
        <PricingSection
          currentPlan={currentPlan}
          hasActiveSubscription={hasActiveSubscription}
        />
      </section>
    </main>
  );
};

export default LandingPage;
