import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function createSubscription({
  stripeCustomerId,
  stripeSubscriptionId,
  planType,
}: {
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  planType: "monthly" | "yearly";
}) {
  await db
    .update(subscriptions)
    .set({
      subscribed: true,
      stripeSubscriptionId,
      planType,
    })
    .where(eq(subscriptions.stripeCustomerId, stripeCustomerId));
}

export async function cancelSubscription({
  stripeCustomerId,
}: {
  stripeCustomerId: string;
}) {
  await db
    .update(subscriptions)
    .set({
      subscribed: false,
      stripeSubscriptionId: null,
      planType: null,
    })
    .where(eq(subscriptions.stripeCustomerId, stripeCustomerId));
}

export async function getSubscription({ userId }: { userId: string }) {
  const userSubscription = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.userId, userId),
  });
  return userSubscription;
}
