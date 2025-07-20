import { DataTable } from "@/components/DataTable";
import { feedbackColumns } from "@/components/feedbackColumns";
import db from "@/db";
import { projects as dbProjects } from "@/db/schema";
import { ColumnDef } from "@tanstack/react-table";
import { eq } from "drizzle-orm";
import { Code, Globe, Star } from "lucide-react";
import Link from "next/link";

export type Feedback = {
  userName: string;
  userEMail: string;
  message: string;
};

const page = async ({
  params,
}: {
  params: {
    projectId: string;
  };
}) => {
  const resolvedParams = await params;
  const projectId = parseInt(resolvedParams?.projectId);
  if (!projectId || isNaN(projectId)) return <div>Invalid Project Id</div>;

  const projects = await db.query.projects.findMany({
    where: eq(dbProjects.id, projectId),
    with: {
      feedbacks: true,
    },
  });
  const project: any = projects[0];
  const feedbacks: any = project.feedbacks;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Project Card */}
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          {project?.name}
        </h1>
        <p className="text-gray-700 mb-5">{project?.description}</p>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {project?.url && (
            <Link
              href={project.url}
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200"
            >
              <Globe className="mr-2 h-5 w-5" />
              Visit Website
            </Link>
          )}

          {/* New Embed Code Button */}
          <Link
            href={`${params.projectId}/instructions`}
            className="inline-flex items-center text-gray-700 hover:text-black font-semibold transition-colors duration-200"
          >
            <Code className="mr-2 h-5 w-5" />
            View Embed Code
          </Link>
        </div>
      </div>

      {/* Feedback Table */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          User Feedbacks
        </h2>
        {feedbacks.length > 0 ? (
          <DataTable columns={feedbackColumns} data={feedbacks} />
        ) : (
          <p className="text-gray-500 italic">
            No feedback has been submitted yet.
          </p>
        )}
      </div>
    </div>
  );
};
export default page;
