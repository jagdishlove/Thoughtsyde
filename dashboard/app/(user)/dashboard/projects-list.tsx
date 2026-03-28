import { InferSelectModel } from "drizzle-orm";
import { projects } from "@/db/schema";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { monthlyPlanId, yearlyPlanId } from "@/lib/payments";
import { Lock, Crown, Sparkles, CreditCard, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import SubscribeBtn from "../payments/subscribe-btn";

type Project = InferSelectModel<typeof projects>;

type Props = {
  projects: Project[];
  subscribed: boolean | null | undefined;
  planType?: string | null;
  projectLimit?: number;
  currentCount?: number;
};

const ProjectsList = (props: Props) => {
  const { projects, subscribed, planType = "free", projectLimit = 3, currentCount = projects.length } = props;
  const isFreeUser = !subscribed;
  const isAtLimit = currentCount >= projectLimit;
  const planLabel = subscribed 
    ? (planType ?? "free").charAt(0).toUpperCase() + (planType ?? "free").slice(1)
    : "Free";

  if (projects.length === 0) {
    return null;
  }

  return (
    <div>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
        {projects.map((project: Project, index: number) => (
          <li key={project.id} style={{ animationDelay: `${index * 0.1}s` }}>
            <Card className="card-hover group">
              <CardHeader className="flex-1">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl group-hover:text-indigo-700 transition-colors">
                    {project.name}
                  </CardTitle>
                  <Badge 
                    variant="secondary" 
                    className={`badge-smooth ${subscribed 
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
              <CardFooter>
                <Link href={`/projects/${project.id}`} className="w-full">
                  <Button 
                    className="w-full btn-secondary group/btn" 
                    variant="outline"
                  >
                    <span>View Project</span>
                    <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all duration-300" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </li>
        ))}
        
        {/* Show upgrade card when free user is at or near limit */}
        {isFreeUser && (
          <li>
            <Card className="card-hover bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 hover:border-indigo-400">
              <CardHeader className="flex-1 text-center">
                <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-3 animate-float">
                  <Sparkles className="w-6 h-6 text-indigo-600" />
                </div>
                <CardTitle className="text-lg">
                  {isAtLimit ? "Unlock Unlimited Projects" : "More Projects Available"}
                </CardTitle>
                <CardDescription className="mt-2">
                  {isAtLimit 
                    ? "You've reached your free limit. Upgrade to create unlimited projects."
                    : `You can create ${projectLimit - currentCount} more project${projectLimit - currentCount === 1 ? '' : 's'} for free, or upgrade for unlimited.`
                  }
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex flex-col gap-2">
                <SubscribeBtn price={monthlyPlanId} />
                <p className="text-xs text-gray-500 text-center">
                  Or choose{' '}
                  <Link href="/payments" className="link-smooth text-xs">
                    yearly plan
                  </Link> for 2 months free
                </p>
              </CardFooter>
            </Card>
          </li>
        )}

        {/* Show "All projects used" card for paid users at limit */}
        {subscribed && isAtLimit && (
          <li>
            <Card className="card-hover bg-gradient-to-br from-orange-50 to-red-50 border-2 border-dashed border-orange-300">
              <CardHeader className="flex-1 text-center">
                <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                  <Lock className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle className="text-lg">Plan Limit Reached</CardTitle>
                <CardDescription className="mt-2">
                  You've used all {projectLimit} projects in your current plan. 
                  Upgrade to create more.
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
  )
}
export default ProjectsList;