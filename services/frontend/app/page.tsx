import { DashboardHome } from "@/components/dashboard/home";
import ErrorCard from "@/components/error/ErrorCard";
import GetExecutions from "@/lib/fetch/executions/all";
import GetFlows from "@/lib/fetch/flow/all";
import GetAlerts from "@/lib/fetch/alert/alerts";
import GetRunners from "@/lib/fetch/runner/get";
import GetUserDetails from "@/lib/fetch/user/getDetails";
import GetUserNotifications from "@/lib/fetch/user/getNotifications";
import GetUserStats from "@/lib/fetch/user/getStats";

export default async function DashboardHomePage() {
  const statsData = GetUserStats();
  const notificationsData = GetUserNotifications();
  const flowsData = GetFlows();
  const runnersData = GetRunners();
  const executionsData = GetExecutions();
  const alertsData = GetAlerts();
  const userData = GetUserDetails();

  const [stats, notifications, flows, runners, executions, alerts, user] =
    (await Promise.all([
      statsData,
      notificationsData,
      flowsData,
      runnersData,
      executionsData,
      alertsData,
      userData,
    ])) as any;

  return (
    <>
      {executions.success &&
      flows.success &&
      notifications.success &&
      alerts.success &&
      runners.success &&
      stats.success &&
      user.success ? (
        <DashboardHome
          alerts={alerts.data.alerts}
          executions={executions.data.executions}
          flows={flows.data.flows}
          notifications={notifications.data.notifications}
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
            alerts.error ||
            runners.error ||
            stats.error ||
            user.error
          }
          message={
            executions.message ||
            flows.message ||
            notifications.message ||
            alerts.message ||
            runners.message ||
            stats.message ||
            user.message
          }
        />
      )}
    </>
  );
}
