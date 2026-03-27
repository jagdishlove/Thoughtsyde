import PricingSection from './pricing-section';
import Hero from './hero';
import FeaturesSection from './features-section';
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";

const LandingPage = async () => {
  const { userId } = await auth();
  
  let currentPlan: string | null = null;
  
  if (userId) {
    const subscription = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.userId, userId),
    });
    
    if (subscription?.subscribed && subscription.planType) {
      currentPlan = subscription.planType;
    } else if (!subscription?.subscribed) {
      currentPlan = null; // Free plan
    }
  }

  return (
    <div>
      <Hero />
      <FeaturesSection />
      <PricingSection currentPlan={currentPlan} />
    </div>
  );
}

export default LandingPage;