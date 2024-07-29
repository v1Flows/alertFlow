import { cookies } from "next/headers";

import { DashboardHome } from "@/components/dashboard/home";
import GetUserStats from "@/lib/fetch/user/getStats";
import PageGetPlans from "@/lib/fetch/page/plans";
import GetUserDetails from "@/lib/fetch/user/getDetails";

export default async function DashboardHomePage() {
  const user = JSON.parse(cookies().get("user")?.value || "{}");

  const userDetails = await GetUserDetails(user.id);
  const stats = await GetUserStats(user.id);
  const plans = await PageGetPlans();

  return <DashboardHome plans={plans} stats={stats} user={userDetails} />;
}
