import NewProjBtn from "@/components/new-proj";
import { db } from "@/db";
import { projects, subscriptions } from "@/db/schema";
import { eq, count, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import ProjectsList from "./projects-list";
import { getSubscription } from "@/actions/userSubscriptions";
import { getProjectLimit, maxFreeProjects } from "@/lib/payments";
import { getArchivedProjects } from "@/actions/archiveProject";
import ArchiveManager from "@/components/archive-manager";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Crown,
  Lock,
  Sparkles,
  FolderKanban,
  TrendingUp,
  Archive,
  Zap,
  ChevronRight,
  AlertTriangle,
  Shield,
  Star,
} from "lucide-react";

export default async function Page() {
  const { userId } = auth();
  if (!userId) {
    return null;
  }

  // Get active projects (not archived)
  const activeProjects = await db
    .select()
    .from(projects)
    .where(and(eq(projects.userId, userId), eq(projects.isArchived, false)));

  // Get archived projects
  const archivedProjects = await db
    .select()
    .from(projects)
    .where(and(eq(projects.userId, userId), eq(projects.isArchived, true)));

  const subscription = await getSubscription({ userId });

  const subscribed: boolean = subscription?.subscribed ?? false;
  const planType = subscription?.planType ?? "free";
  const projectLimit = getProjectLimit(subscribed, planType);
  const currentCount = activeProjects.length;
  const totalCount = currentCount + archivedProjects.length;
  const canCreateMore = currentCount < projectLimit;
  const isAtLimit = currentCount >= projectLimit;
  const isFreeUser = !subscribed;
  const isExcess = totalCount > projectLimit;
  const excessCount = Math.max(0, totalCount - projectLimit);

  // Calculate progress percentage
  const progressPercentage = Math.min((currentCount / projectLimit) * 100, 100);

  // Determine banner type
  const showExcessWarning = isExcess && isFreeUser;
  const showLimitWarning = isAtLimit && !isExcess;
  const showApproachingWarning = currentCount >= maxFreeProjects - 1 && currentCount < maxFreeProjects;

  return (
    <div className="section-container py-8">
      {/* Header with project usage */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <FolderKanban className="w-8 h-8 text-indigo-600" />
              Your Projects
            </h1>
            <p className="text-gray-600 mt-1">
              {isFreeUser ? (
                <span className="flex items-center gap-2">
                  <span className="badge-smooth bg-gray-100 text-gray-700">
                    Free Plan
                  </span>
                  <span className="text-sm">
                    {currentCount} of {maxFreeProjects} active projects
                    {archivedProjects.length > 0 && (
                      <span className="text-gray-400 ml-1">
                        ({archivedProjects.length} archived)
                      </span>
                    )}
                  </span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-yellow-500" />
                  <span className="badge-smooth bg-yellow-100 text-yellow-800">
                    {planType?.charAt(0).toUpperCase()}
                    {planType?.slice(1)} Plan
                  </span>
                  <span className="text-gray-500">•</span>
                  <span>{currentCount} active projects</span>
                  {archivedProjects.length > 0 && (
                    <span className="text-gray-400">
                      ({archivedProjects.length} archived)
                    </span>
                  )}
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {archivedProjects.length > 0 && (
              <ArchiveManager
                archivedProjects={archivedProjects}
                canUnarchive={currentCount < projectLimit}
                projectLimit={projectLimit}
                planType={planType}
              />
            )}

            {isFreeUser && (
              <div className="w-48">
                <Progress value={progressPercentage} className="h-2" />
                <p className="text-xs text-gray-500 mt-1 text-center">
                  {currentCount}/{maxFreeProjects} free projects
                </p>
              </div>
            )}

            {canCreateMore ? (
              <NewProjBtn />
            ) : (
              <Link href="/payments">
                <Button className="btn-primary bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                  <Lock className="w-4 h-4 mr-2" />
                  Upgrade to Create More
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* EXCESS PROJECTS BANNER - Only show once, not per project */}
      {showExcessWarning && (
        <Card className="mb-6 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-amber-200 hover-lift">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-amber-900">
                    {excessCount} Project{excessCount > 1 ? "s" : ""} {archivedProjects.length > 0 ? "Remaining" : "Over Limit"}
                  </h3>
                  <p className="text-amber-700 mt-1">
                    {archivedProjects.length > 0 ? (
                      <>
                        You have {excessCount} project{excessCount > 1 ? "s" : ""} that need attention.{" "}
                        <strong>Archive</strong> them or{" "}
                        <Link href="/payments" className="font-semibold underline">
                          upgrade to Premium
                        </Link>{" "}
                        to keep them all active.
                      </>
                    ) : (
                      <>
                        You&apos;ve created {totalCount} projects but your free plan allows only {projectLimit}.{" "}
                        <Link href="/payments" className="font-semibold underline">
                          Upgrade now
                        </Link>{" "}
                        to unlock all your projects, or archive some below.
                      </>
                    )}
                  </p>
                  {archivedProjects.length === 0 && (
                    <p className="text-amber-600 text-sm mt-2 flex items-center gap-1">
                      <Shield className="w-4 h-4" />
                      Tip: Archived projects are safe and can be restored anytime
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 md:ml-4">
                <Link href="/payments">
                  <Button className="btn-primary bg-gradient-to-r from-indigo-600 to-purple-600 whitespace-nowrap">
                    <Crown className="w-4 h-4 mr-2" />
                    Unlock All
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upgrade value proposition for free users */}
      {isFreeUser && !showExcessWarning && (
        <Card className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-100 hover-lift">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                  <Zap className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-indigo-900">
                    Unlock Premium Features
                  </h3>
                  <p className="text-indigo-700 mt-1">
                    Get unlimited projects, priority support, and advanced analytics.{" "}
                    <Link href="/payments" className="font-semibold underline">
                      Start your 7-day free trial →
                    </Link>
                  </p>
                </div>
              </div>
              <div className="flex gap-2 md:ml-4">
                <Link href="/payments">
                  <Button className="btn-primary bg-gradient-to-r from-indigo-600 to-purple-600">
                    <Crown className="w-4 h-4 mr-2" />
                    Try Premium
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Approaching limit warning for free users */}
      {showApproachingWarning && !showExcessWarning && (
        <Card className="mb-6 bg-yellow-50/80 border-yellow-200 hover-lift">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-yellow-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Approaching Project Limit
            </CardTitle>
            <CardDescription className="text-yellow-700">
              You have {maxFreeProjects - currentCount} project
              {maxFreeProjects - currentCount === 1 ? "" : "s"} remaining.
              <Link
                href="/payments"
                className="font-medium underline ml-1 link-smooth text-yellow-800"
              >
                Upgrade to Premium
              </Link>{" "}
              for unlimited projects.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Project limit reached message (no excess) */}
      {showLimitWarning && !showExcessWarning && (
        <Card className="mb-6 bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 hover-lift">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <h3 className="text-lg font-semibold text-gray-900">
                  {isFreeUser ? "Project Limit Reached" : "All Projects Used"}
                </h3>
                <p className="text-gray-600 mt-1">
                  {isFreeUser
                    ? "You&apos;ve used all 3 free projects. Upgrade to create unlimited projects."
                    : `You&apos;ve reached your ${planType} plan limit of ${projectLimit} projects.`}
                </p>
              </div>
              <Link href="/payments">
                <Button
                  size="lg"
                  className="btn-primary bg-gradient-to-r from-indigo-600 to-purple-600"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  {isFreeUser ? "Upgrade Now" : "Upgrade Plan"}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {totalCount === 0 && (
        <Card className="mb-8 border-dashed border-2 border-gray-200 bg-gray-50/50">
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
              <Sparkles className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No projects yet
            </h3>
            <p className="text-gray-500 mb-6">
              Create your first project to start collecting feedback
            </p>
            <NewProjBtn />
          </CardContent>
        </Card>
      )}

      {/* Projects List */}
      <ProjectsList
        projects={activeProjects}
        archivedCount={archivedProjects.length}
        subscribed={subscribed}
        planType={planType}
        projectLimit={projectLimit}
        currentCount={currentCount}
      />
    </div>
  );
}
