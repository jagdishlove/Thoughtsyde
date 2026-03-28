export const monthlyPlanId: string = "price_1T7aka2H5h7BTsmccKHPEui5";
export const yearlyPlanId: string = "price_1T7akv2H5h7BTsmcgqDU7kyg";

// Plan limits
export const maxFreeProjects: number = 3;
export const maxMonthlyProjects: number = 10;
export const maxYearlyProjects: number = 50;

// Unlimited projects for now on paid plans
export const unlimitedProjects: number = 999999;

// Get project limit based on subscription
export function getProjectLimit(subscribed: boolean | null | undefined, planType: string | null | undefined): number {
  if (!subscribed) {
    return maxFreeProjects;
  }
  
  // For paid users, return unlimited or plan-specific limits
  if (planType === "yearly") {
    return maxYearlyProjects;
  }
  
  // Monthly plan or any other paid plan
  return maxMonthlyProjects;
}
