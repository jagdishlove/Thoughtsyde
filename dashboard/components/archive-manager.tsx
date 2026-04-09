"use client";
import { useState } from "react";
import { InferSelectModel } from "drizzle-orm";
import { projects } from "@/db/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { archiveProject, unarchiveProject } from "@/actions/archiveProject";
import {
  Archive,
  Unarchive,
  Package,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "./ui/toast-provider";

type Project = InferSelectModel<typeof projects>;

type Props = {
  archivedProjects: Project[];
  canUnarchive: boolean;
  projectLimit: number;
  planType?: string | null;
};

export default function ArchiveManager({
  archivedProjects,
  canUnarchive,
  projectLimit,
  planType = "free",
}: Props) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleArchive = async (projectId: number) => {
    setLoadingId(projectId);
    try {
      await archiveProject(projectId);
      toast({
        title: "Project archived",
        description: "You can unarchive it anytime from the archived section.",
      });
      setIsOpen(false);
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to archive project",
        variant: "destructive",
      });
    }
    setLoadingId(null);
  };

  const handleUnarchive = async (projectId: number) => {
    setLoadingId(projectId);
    try {
      const result = await unarchiveProject(projectId);
      if (!result.success && result.reason === "limit_reached") {
        toast({
          title: "Cannot unarchive",
          description: `You've reached your ${planType} plan limit of ${projectLimit} projects. Archive another project or upgrade.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Project restored",
          description: "Your project is now active again.",
        });
        setIsOpen(false);
      }
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to unarchive project",
        variant: "destructive",
      });
    }
    setLoadingId(null);
  };

  if (archivedProjects.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Archive className="w-4 h-4" />
          Archived ({archivedProjects.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Archived Projects ({archivedProjects.length})
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto space-y-3 mt-4">
          {archivedProjects.map((project) => (
            <Card key={project.id} className="bg-gray-50/50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">
                      {project.name}
                    </h4>
                    <p className="text-sm text-gray-500 truncate mt-1">
                      {project.url}
                    </p>
                    {project.archivedAt && (
                      <p className="text-xs text-gray-400 mt-1">
                        Archived{" "}
                        {new Date(
                          project.archivedAt * 1000,
                        ).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUnarchive(project.id)}
                    disabled={
                      loadingId === project.id ||
                      (!canUnarchive && archivedProjects.length > 0)
                    }
                    className="shrink-0"
                  >
                    {loadingId === project.id ? (
                      <span className="animate-spin">⟳</span>
                    ) : (
                      <Unarchive className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                {!canUnarchive && archivedProjects.length > 0 && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-amber-600">
                    <AlertCircle className="w-3 h-3" />
                    <span>At project limit — archive another to restore</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="pt-4 border-t mt-4">
          <Link href="/payments" className="block">
            <Button className="w-full btn-primary bg-gradient-to-r from-indigo-600 to-purple-600">
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Restore All
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Crown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </svg>
  );
}
