import { cookies } from "next/headers";

import { DashboardHome } from "@/components/dashboard/home";
import GetUserStats from "@/lib/fetch/user/getStats";
import PageGetPlans from "@/lib/fetch/page/plans";
import GetUserDetails from "@/lib/fetch/user/getDetails";
import GetUserNotifications from "@/lib/fetch/user/getNotifications";
import GetFlows from "@/lib/fetch/flow/all";
import GetRunners from "@/lib/fetch/runner/get";
import GetExecutions from "@/lib/fetch/executions/all";
import GetPayloads from "@/lib/fetch/payload/payloads";

export default async function DashboardHomePage() {
  const user = JSON.parse(cookies().get("user")?.value || "{}");

  const userDetails = await GetUserDetails(user.id);
  const stats = await GetUserStats(user.id);
  const plans = await PageGetPlans();
  const notifications = await GetUserNotifications(user.id);
  const flows = await GetFlows();
  const runners = await GetRunners();
  const executions = await GetExecutions();
  const payloads = await GetPayloads();

  return (
    <DashboardHome
      executions={executions}
      flows={flows}
      notifications={notifications}
      payloads={payloads}
      plans={plans}
      runners={runners}
      stats={stats}
      user={userDetails}
    />
  );
}
