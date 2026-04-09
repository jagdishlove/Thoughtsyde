import PricingSection from "./pricing-section";
import Hero from "./hero";
import FeaturesSection from "./features-section";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";

const LandingPage = async () => {
  const { userId } = await auth();
  const isAuthenticated = !!userId;

  let currentPlan: string = "free";
  let hasActiveSubscription: boolean = false;

  if (userId) {
    const subscription = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.userId, userId),
    });

    if (subscription?.subscribed && subscription.planType) {
      currentPlan = subscription.planType;
      hasActiveSubscription = true;
    }
  }

  return (
    <main className="flex-1">
      <Hero />

      <section id="features">
        <FeaturesSection />
      </section>

      <section id="pricing">
        <PricingSection
          isAuthenticated={isAuthenticated}
          currentPlan={currentPlan}
          hasActiveSubscription={hasActiveSubscription}
        />
      </section>
    </main>
  );
};

export default LandingPage;
