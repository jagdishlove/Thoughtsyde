import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import ManageSubscription from "./manage-subscription";
import PricingSection from "@/app/landing-page/pricing-section";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Lock, Crown, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { count, eq as drizzleEq } from "drizzle-orm";
import { projects } from "@/db/schema";
import { monthlyPlanId, yearlyPlanId } from "@/lib/payments";

const page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const subscription = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.userId, userId),
  });

  // Default to "free" when no subscription exists
  const currentPlan = subscription?.subscribed ? subscription.planType : "free";
  const hasActiveSubscription = subscription?.subscribed === true;
  const planLabel = hasActiveSubscription
    ? `${currentPlan?.charAt(0).toUpperCase()}${currentPlan?.slice(1)}`
    : "Free";

  // Get project count
  const projectCount = await db
    .select({ count: count() })
    .from(projects)
    .where(drizzleEq(projects.userId, userId));
  
  const currentProjectCount = projectCount[0]?.count || 0;

  const showLimitError = searchParams?.error === "project_limit_reached";

  return (
    <div className="section-container py-8">
      {/* Project Limit Alert */}
      {showLimitError && (
        <Alert className="bg-orange-50 border-orange-200 mb-6 hover-lift">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertTitle className="text-orange-800 flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Project Limit Reached
          </AlertTitle>
          <AlertDescription className="text-orange-700">
            You have used all your free projects. Upgrade to a premium plan to create more projects and unlock all features.
          </AlertDescription>
        </Alert>
      )}

      {/* Current Subscription Status */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Plan Status Card */}
        <Card className={`${hasActiveSubscription ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200" : "bg-gray-50"} hover-lift`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              {hasActiveSubscription ? (
                <>
                  <Crown className="w-5 h-5 text-yellow-500" />
                  <span>Premium Plan</span>
                  <Badge className="badge-smooth bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                </>
              ) : (
                <>
                  <span>Free Plan</span>
                  <Badge variant="secondary" className="badge-smooth">Current</Badge>
                </>
              )}
            </CardTitle>
            <CardDescription>
              {hasActiveSubscription 
                ? `You're subscribed to the ${planLabel} plan with full access.`
                : "You're on the free plan with limited features."
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className={`w-4 h-4 ${hasActiveSubscription ? "text-green-600" : "text-gray-400"}`} />
              <span className={hasActiveSubscription ? "text-green-800" : "text-gray-600"}>
                {currentPlan === "yearly" ? "50 projects" : 
                 currentPlan === "monthly" ? "10 projects" : "3 projects"} included
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm mt-2">
              <CheckCircle className={`w-4 h-4 ${hasActiveSubscription ? "text-green-600" : "text-gray-400"}`} />
              <span className={hasActiveSubscription ? "text-green-800" : "text-gray-600"}>
                {currentProjectCount} projects created
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Usage Card */}
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="text-lg">Project Usage</CardTitle>
            <CardDescription>
              Your current project usage across all plans
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{currentProjectCount}</div>
            <p className="text-sm text-gray-600">
              {hasActiveSubscription 
                ? `of ${currentPlan === "yearly" ? "50" : "10"} projects used`
                : "of 3 free projects used"}
            </p>
            {!hasActiveSubscription && currentProjectCount >= 2 && (
              <p className="text-sm text-orange-600 mt-2">
                Approaching limit! Upgrade soon.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Actions Card */}
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="text-lg">Manage Subscription</CardTitle>
            <CardDescription>
              {hasActiveSubscription 
                ? "Update payment method or cancel subscription"
                : "Upgrade to unlock premium features"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {hasActiveSubscription ? (
              <ManageSubscription />
            ) : (
              <Link href="#pricing">
                <Button className="btn-primary w-full">
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade Now
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pricing Section */}
      <div className="py-8" id="pricing">
        <PricingSection 
          isAuthenticated={true}
          currentPlan={currentPlan} 
          hasActiveSubscription={hasActiveSubscription}
        />
      </div>

      {/* FAQ or Help Section */}
      <div className="mt-12 text-center">
        <p className="text-gray-600">
          Questions about your subscription?{" "}
          <Link href="/dashboard" className="link-smooth">
            Contact support
          </Link>
        </p>
      </div>
    </div>
  );
};

export default page;