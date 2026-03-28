'use server';
import { db } from "@/db";
import { auth } from "@clerk/nextjs/server";
import { projects, subscriptions } from "@/db/schema";
import { redirect } from "next/navigation";
import { eq, count } from "drizzle-orm";
import { getProjectLimit } from "@/lib/payments";

export async function createProject(formData: FormData) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Check user's current project count
  const projectCount = await db
    .select({ count: count() })
    .from(projects)
    .where(eq(projects.userId, userId));

  const currentProjectCount = projectCount[0]?.count || 0;

  // Check user's subscription
  const subscription = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.userId, userId),
  });

  const subscribed = subscription?.subscribed ?? false;
  const planType = subscription?.planType ?? null;
  const projectLimit = getProjectLimit(subscribed, planType);

  // Enforce project limit
  if (currentProjectCount >= projectLimit) {
    // Redirect to upgrade page if limit reached
    redirect("/payments?error=project_limit_reached");
  }

  const project = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    url: formData.get("url") as string,
    userId,
  };

  const [newProject] = await db.insert(projects).values(project).returning({ insertedId: projects.id });

  redirect(`/projects/${newProject.insertedId}/instructions`);
}
