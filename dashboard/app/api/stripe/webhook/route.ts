import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import {
  createSubscription,
  cancelSubscription,
} from "@/actions/userSubscriptions";
import { monthlyPlanId, yearlyPlanId } from "@/lib/payments";

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.payment_succeeded",
  "invoice.paid",
]);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") as string;
  const webHookSecret =
    process.env.NODE_ENV === "production"
      ? process.env.STRIPE_WEBHOOK_SECRET
      : process.env.STRIPE_WEBHOOK_LOCAL_SECRET;

  console.log(`[WEBHOOK] ========== NEW REQUEST ==========`);
  console.log(`[WEBHOOK] Event received`);

  if (!webHookSecret) {
    console.error(`[WEBHOOK ERROR] Webhook secret not set`);
    return new Response("Webhook secret not set", { status: 400 });
  }

  if (!sig) {
    console.error(`[WEBHOOK ERROR] No signature`);
    return new Response("No signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webHookSecret);
    console.log(`[WEBHOOK] ✅ Signature verified`);
    console.log(`[WEBHOOK] Event type: ${event.type}`);
  } catch (err: any) {
    console.error(
      `[WEBHOOK ERROR] Signature verification failed:`,
      err.message,
    );
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (relevantEvents.has(event.type)) {
    try {
      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;

        console.log(`[WEBHOOK] Processing checkout.session.completed`);
        console.log(`[WEBHOOK] Customer: ${customerId}`);
        console.log(`[WEBHOOK] Subscription: ${subscriptionId}`);

        if (subscriptionId && customerId) {
          const subscription =
            await stripe.subscriptions.retrieve(subscriptionId);
          const priceId = subscription.items.data[0]?.price?.id;

          let planType: "monthly" | "yearly" = "monthly";
          if (priceId === yearlyPlanId) {
            planType = "yearly";
          }

          console.log(`[WEBHOOK] Price ID: ${priceId}, Plan: ${planType}`);
          console.log(`[WEBHOOK] Saving to DB...`);

          await createSubscription({
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            planType,
          });

          console.log(`[WEBHOOK] ✅ Saved to DB successfully!`);
        } else {
          console.warn(
            `[WEBHOOK] Missing data - subscriptionId: ${subscriptionId}, customerId: ${customerId}`,
          );
        }
      } else if (event.type === "customer.subscription.created") {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const subscriptionId = subscription.id;

        console.log(`[WEBHOOK] Processing customer.subscription.created`);
        console.log(`[WEBHOOK] Customer: ${customerId}`);
        console.log(`[WEBHOOK] Subscription: ${subscriptionId}`);

        const priceId = subscription.items?.data[0]?.price?.id;
        let planType: "monthly" | "yearly" = "monthly";
        if (priceId === yearlyPlanId) {
          planType = "yearly";
        }

        await createSubscription({
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
          planType,
        });

        console.log(`[WEBHOOK] ✅ Saved to DB from subscription.created!`);
      } else if (event.type === "customer.subscription.deleted") {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        console.log(`[WEBHOOK] Processing customer.subscription.deleted`);
        console.log(`[WEBHOOK] Customer: ${customerId}`);

        await cancelSubscription({ stripeCustomerId: customerId });
        console.log(`[WEBHOOK] ✅ Subscription cancelled in DB`);
      }
    } catch (error) {
      console.error(`[WEBHOOK ERROR] Error processing ${event.type}:`, error);
      return new Response(
        JSON.stringify({ error: "Failed to process webhook" }),
        { status: 500 },
      );
    }
  } else {
    console.log(`[WEBHOOK] Event ${event.type} not in relevant events list`);
  }

  console.log(`[WEBHOOK] ========== REQUEST COMPLETE ==========\n`);

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
