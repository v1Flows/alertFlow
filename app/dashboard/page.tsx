import { DashboardHome } from "@/components/dashboard/home";
import GetUserStats from "@/lib/fetch/user/getStats";
import GetUserDetails from "@/lib/fetch/user/getDetails";
import GetUserNotifications from "@/lib/fetch/user/getNotifications";
import GetFlows from "@/lib/fetch/flow/all";
import GetRunners from "@/lib/fetch/runner/get";
import GetExecutions from "@/lib/fetch/executions/all";
import GetPayloads from "@/lib/fetch/payload/payloads";
import ErrorCard from "@/components/error/ErrorCard";

export default async function DashboardHomePage() {
  const statsData = GetUserStats();
  const notificationsData = GetUserNotifications();
  const flowsData = GetFlows();
  const runnersData = GetRunners();
  const executionsData = GetExecutions();
  const payloadsData = GetPayloads();
  const userData = GetUserDetails();

  const [stats, notifications, flows, runners, executions, payloads, user] =
    (await Promise.all([
      statsData,
      notificationsData,
      flowsData,
      runnersData,
      executionsData,
      payloadsData,
      userData,
    ])) as any;

  return (
    <>
      {executions.success &&
      flows.success &&
      notifications.success &&
      payloads.success &&
      runners.success &&
      stats.success &&
      user.success ? (
        <DashboardHome
          executions={executions.data.executions}
          flows={flows.data.flows}
          notifications={notifications.data.notifications}
          payloads={payloads.data.payloads}
          runners={runners.data.runners}
          stats={stats.data.stats}
          user={user.data.user}
        />
      ) : (
        <ErrorCard
          error={
            executions.error ||
            flows.error ||
            notifications.error ||
            payloads.error ||
            runners.error ||
            stats.error ||
            user.error
          }
          message={
            executions.message ||
            flows.message ||
            notifications.message ||
            payloads.message ||
            runners.message ||
            stats.message ||
            user.message
          }
        />
      )}
    </>
  );
}
