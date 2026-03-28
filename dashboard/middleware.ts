import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/projects(.*)",
  "/payments(.*)",
]);

const isPublicRoute = createRouteMatcher([
  "/api/stripe/webhook",
  "/api/stripe/webhook/(.*)",
  "/",
  "/landing-page(.*)",
]);

export default clerkMiddleware((auth, req) => {
  // Skip auth for public routes (including webhooks)
  if (isPublicRoute(req)) {
    console.log(`[MIDDLEWARE] Skipping auth for public route: ${req.url}`);
    return;
  }
  
  // Protect private routes
  if (isProtectedRoute(req)) {
    console.log(`[MIDDLEWARE] Protecting route: ${req.url}`);
    auth().protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
