import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/projects(.*)",
  "/payments(.*)",
]);
const isWebhookRoute = createRouteMatcher(["/api/stripe/webhook"]);

export default clerkMiddleware((auth, req) => {
  // Skip auth for webhook routes
  if (isWebhookRoute(req)) return;
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: [
    // Exclude Stripe webhook route from Clerk middleware
    "/((?!.*\\..*|_next|api/stripe/webhook).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
