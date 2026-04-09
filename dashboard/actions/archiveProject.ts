'use server';
import { db } from "@/db";
import { auth } from "@clerk/nextjs/server";
import { projects, subscriptions } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import { getProjectLimit } from "@/lib/payments";
import { revalidatePath } from "next/cache";

export async function archiveProject(projectId: number) {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");

  await db
    .update(projects)
    .set({ isArchived: true, archivedAt: Math.floor(Date.now() / 1000) })
    .where(eq(projects.id, projectId))
    .where(eq(projects.userId, userId));

  revalidatePath("/dashboard");
}

export async function unarchiveProject(projectId: number) {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");

  // Check if user can unarchive (within limit)
  const activeProjects = await db
    .select({ count: count() })
    .from(projects)
    .where(eq(projects.userId, userId))
    .where(eq(projects.isArchived, false));

  const subscription = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.userId, userId),
  });

  const subscribed = subscription?.subscribed ?? false;
  const planType = subscription?.planType ?? null;
  const projectLimit = getProjectLimit(subscribed, planType);
  const activeCount = activeProjects[0]?.count || 0;

  if (activeCount >= projectLimit) {
    return { success: false, reason: "limit_reached", limit: projectLimit };
  }

  await db
    .update(projects)
    .set({ isArchived: false, archivedAt: null })
    .where(eq(projects.id, projectId))
    .where(eq(projects.userId, userId));

  revalidatePath("/dashboard");
  return { success: true };
}

export async function getArchivedProjects(userId: string) {
  const archived = await db
    .select()
    .from(projects)
    .where(eq(projects.userId, userId))
    .where(eq(projects.isArchived, true));
  return archived;
}
