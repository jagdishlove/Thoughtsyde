import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import ManageSubscription from "./manage-subscription";
import PricingSection from "@/app/landing-page/pricing-section";

const page = async () => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const subscription = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.userId, userId),
  });

  const currentPlan = subscription?.subscribed ? subscription.planType : null;
  const planLabel = subscription?.subscribed
    ? `${subscription.planType?.charAt(0).toUpperCase()}${subscription.planType?.slice(1)}`
    : "Free";

  return (
    <div className="space-y-8">
      <div className="p-6 border rounded-lg bg-white shadow-sm">
        <h1 className="text-3xl font-bold mb-4">Subscription Details</h1>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-lg text-gray-600">Current plan:</span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              subscription?.subscribed
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {planLabel}
          </span>
        </div>
        {subscription?.subscribed && <ManageSubscription />}
      </div>

      <div className="py-8">
        <PricingSection currentPlan={currentPlan} />
      </div>
    </div>
  );
};

export default page;
