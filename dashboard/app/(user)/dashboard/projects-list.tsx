'use client';
import { useState } from "react";
import { InferSelectModel } from "drizzle-orm";
import { projects } from "@/db/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { monthlyPlanId, yearlyPlanId } from "@/lib/payments";
import { Lock, Crown, Sparkles, CreditCard, ArrowRight, Archive, GripVertical, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import SubscribeBtn from "../payments/subscribe-btn";
import { archiveProject } from "@/actions/archiveProject";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

type Project = InferSelectModel<typeof projects>;

type Props = {
  projects: Project[];
  archivedCount?: number;
  subscribed: boolean | null | undefined;
  planType?: string | null;
  projectLimit?: number;
  currentCount?: number;
};

const ProjectsList = (props: Props) => {
  const {
    projects,
    archivedCount = 0,
    subscribed,
    planType = "free",
    projectLimit = 3,
    currentCount = projects.length,
  } = props;
  const { toast } = useToast();
  const [archivingId, setArchivingId] = useState<number | null>(null);
  
  const isFreeUser = !subscribed;
  const isAtLimit = currentCount >= projectLimit;
  const planLabel = subscribed
    ? (planType ?? "free").charAt(0).toUpperCase() +
      (planType ?? "free").slice(1)
    : "Free";

  // Projects that are "excess" (over limit) - show as greyed out
  const excessProjects = isFreeUser ? projects.slice(projectLimit) : [];
  const activeProjects = isFreeUser ? projects.slice(0, projectLimit) : projects;
  const hasExcessProjects = excessProjects.length > 0;

  if (projects.length === 0) {
    return null;
  }

  const handleArchive = async (projectId: number, projectName: string) => {
    setArchivingId(projectId);
    try {
      await archiveProject(projectId);
      toast({
        title: "Project archived",
        description: `"${projectName}" has been moved to archives.`,
      });
      window.location.reload();
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to archive project",
        variant: "destructive",
      });
    }
    setArchivingId(null);
  };

  return (
    <div>
      {/* Active Projects (within limit) */}
      {activeProjects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Active Projects
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {activeProjects.map((project: Project, index: number) => (
              <li key={project.id} style={{ animationDelay: `${index * 0.1}s` }}>
                <Card className="card-hover group relative">
                  {hasExcessProjects && index === activeProjects.length - 1 && isFreeUser && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg z-10">
                      <Star className="w-3 h-3" />
                      Last Free
                    </div>
                  )}
                  <CardHeader className="flex-1">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl group-hover:text-indigo-700 transition-colors">
                        {project.name}
                      </CardTitle>
                      <Badge
                        variant="secondary"
                        className={`badge-smooth ${
                          subscribed
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {subscribed ? (
                          <>
                            <Crown className="w-3 h-3 mr-1" />
                            {planLabel}
                          </>
                        ) : (
                          <>
                            <span className="text-xs">Free</span>
                          </>
                        )}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2 mt-2">
                      {project.description || "No description"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 truncate">{project.url}</p>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Link href={`/projects/${project.uuid || project.id}`} className="flex-1">
                      <Button
                        className="w-full btn-secondary group/btn"
                        variant="outline"
                      >
                        <span>View Project</span>
                        <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all duration-300" />
                      </Button>
                    </Link>
                    {hasExcessProjects && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleArchive(project.id, project.name)}
                        disabled={archivingId === project.id}
                        className="text-gray-400 hover:text-amber-600 hover:bg-amber-50"
                        title="Archive this project"
                      >
                        {archivingId === project.id ? (
                          <span className="animate-spin">⟳</span>
                        ) : (
                          <Archive className="w-4 h-4" />
                        )}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </li>
            ))}

            {/* Show upgrade card when free user is at or near limit */}
            {isFreeUser && activeProjects.length <= projectLimit && (
              <li>
                <Card className="card-hover bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 hover:border-indigo-400 h-full">
                  <CardHeader className="flex-1 text-center">
                    <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-3 animate-float">
                      <Sparkles className="w-6 h-6 text-indigo-600" />
                    </div>
                    <CardTitle className="text-lg">
                      {isAtLimit
                        ? "Unlock Unlimited Projects"
                        : "More Projects Available"}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {isAtLimit
                        ? "You&apos;ve reached your free limit. Upgrade to create unlimited projects."
                        : `You can create ${projectLimit - currentCount} more project${projectLimit - currentCount === 1 ? "" : "s"} for free, or upgrade for unlimited.`}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex flex-col gap-2">
                    <SubscribeBtn price={monthlyPlanId} />
                    <p className="text-xs text-gray-500 text-center">
                      Or choose{" "}
                      <Link href="/payments" className="link-smooth text-xs">
                        yearly plan
                      </Link>{" "}
                      for 2 months free
                    </p>
                  </CardFooter>
                </Card>
              </li>
            )}

            {/* Show "All projects used" card for paid users at limit */}
            {subscribed && isAtLimit && !hasExcessProjects && (
              <li>
                <Card className="card-hover bg-gradient-to-br from-orange-50 to-red-50 border-2 border-dashed border-orange-300 h-full">
                  <CardHeader className="flex-1 text-center">
                    <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                      <Lock className="w-6 h-6 text-orange-600" />
                    </div>
                    <CardTitle className="text-lg">Plan Limit Reached</CardTitle>
                    <CardDescription className="mt-2">
                      You have used all {projectLimit} projects in your current
                      plan. Upgrade to create more.
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Link href="/payments" className="w-full">
                      <Button className="w-full btn-primary bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                        <Crown className="w-4 h-4 mr-2" />
                        Upgrade Plan
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Excess Projects - Greyed out with lock */}
      {excessProjects.length > 0 && isFreeUser && (
        <div>
          <h2 className="text-sm font-semibold text-amber-600 uppercase tracking-wide mb-4 flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Upgrade to Unlock ({excessProjects.length} project{excessProjects.length > 1 ? "s" : ""})
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {excessProjects.map((project: Project, index: number) => (
              <li key={project.id} style={{ animationDelay: `${index * 0.1}s` }}>
                <Card className={cn(
                  "group relative overflow-hidden transition-all duration-300",
                  "bg-gray-50 border-gray-200 opacity-75"
                )}>
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-100/50 to-gray-200/50 pointer-events-none" />
                  <div className="relative">
                    <CardHeader className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-gray-400" />
                          <CardTitle className="text-xl text-gray-600">
                            {project.name}
                          </CardTitle>
                        </div>
                        <Badge
                          variant="secondary"
                          className="badge-smooth bg-amber-100 text-amber-700"
                        >
                          <Lock className="w-3 h-3 mr-1" />
                          Locked
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2 mt-2 text-gray-500">
                        {project.description || "No description"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400 truncate">{project.url}</p>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Link href="/payments" className="flex-1">
                        <Button
                          className="w-full btn-primary bg-gradient-to-r from-indigo-600 to-purple-600"
                          size="sm"
                        >
                          <Crown className="w-4 h-4 mr-2" />
                          Unlock
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleArchive(project.id, project.name)}
                        disabled={archivingId === project.id}
                        className="text-gray-500"
                      >
                        {archivingId === project.id ? (
                          <span className="animate-spin">⟳</span>
                        ) : (
                          <Archive className="w-4 h-4" />
                        )}
                      </Button>
                    </CardFooter>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-semibold text-amber-900">Unlock All Your Projects</h4>
                <p className="text-amber-700 text-sm mt-1">
                  Upgrade to Premium starting at $6.99/month to access all your {excessProjects.length} locked project{excessProjects.length > 1 ? "s" : ""}. 
                  Or <button onClick={() => handleArchive(excessProjects[0]?.id, excessProjects[0]?.name)} className="underline font-medium">archive</button> them to hide from view.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ProjectsList;
