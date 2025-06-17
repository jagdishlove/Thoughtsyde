import NewProjBtn from "@/components/new-proj";
import db from "@/db";
import { projects } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import ProjectList from "./project-list";

const Page = async () => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }
  const userProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.userId, userId));
  return (
    <div>
      <div className="flex items-center justify-center">
        <h1 className="font-bold max-w-full text-center p-5 text-3xl my-4">
          Your projects
        </h1>
        <NewProjBtn />
      </div>
      <ProjectList projects={userProjects} />
    </div>
  );
};

export default Page;
