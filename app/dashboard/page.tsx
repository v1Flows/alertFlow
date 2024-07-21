import { cookies } from "next/headers";

import { DashboardHome } from "@/components/dashboard/home";
import GetUserStats from "@/lib/fetch/user/getStats";

export default async function DashboardHomePage() {
  const user = JSON.parse(cookies().get("user")?.value || "{}");

  const stats = await GetUserStats(user.id);

  return <DashboardHome stats={stats} />;
}
