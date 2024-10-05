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
  const stats = await GetUserStats();
  const notifications = await GetUserNotifications();
  const flows = await GetFlows();
  const runners = await GetRunners();
  const executions = await GetExecutions();
  const payloads = await GetPayloads();
  const user = await GetUserDetails();

  return (
    <DashboardHome
      executions={executions}
      flows={flows}
      notifications={notifications}
      payloads={payloads}
      runners={runners}
      stats={stats}
      user={user}
    />
  );
}
