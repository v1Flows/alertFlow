import { DashboardHome } from "@/components/dashboard/home";
import GetUserStats from "@/lib/fetch/user/getStats";
import GetUserDetails from "@/lib/fetch/user/getDetails";
import GetUserNotifications from "@/lib/fetch/user/getNotifications";
import GetFlows from "@/lib/fetch/flow/all";
import GetRunners from "@/lib/fetch/runner/get";
import GetExecutions from "@/lib/fetch/executions/all";
import GetPayloads from "@/lib/fetch/payload/payloads";

export default async function DashboardHomePage() {
  const statsData = GetUserStats();
  const notificationsData = GetUserNotifications();
  const flowsData = GetFlows();
  const runnersData = GetRunners();
  const executionsData = GetExecutions();
  const payloadsData = GetPayloads();
  const userData = GetUserDetails();

  const [stats, notifications, flows, runners, executions, payloads, user] =
    await Promise.all([
      statsData,
      notificationsData,
      flowsData,
      runnersData,
      executionsData,
      payloadsData,
      userData,
    ]);

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
