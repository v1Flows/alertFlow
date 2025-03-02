import { Spacer } from "@heroui/react";

import ErrorCard from "@/components/error/ErrorCard";
import AdminGetExecutions from "@/lib/fetch/admin/executions";
import AdminGetFlows from "@/lib/fetch/admin/flows";
import { AdminGetAlerts } from "@/lib/fetch/admin/alerts";
import AdminGetRunners from "@/lib/fetch/admin/runners";
import AlertsHeading from "@/components/dashboard/alerts/heading";
import AlertsList from "@/components/dashboard/alerts/list";

export default async function AdminAlertsPage() {
  const flowsData = AdminGetFlows();
  const runnersData = AdminGetRunners();
  const alertsData = AdminGetAlerts();
  const executionsData = AdminGetExecutions();

  const [flows, runners, alerts, executions] = (await Promise.all([
    flowsData,
    runnersData,
    alertsData,
    executionsData,
  ])) as any;

  return (
    <>
      {flows.success &&
      runners.success &&
      alerts.success &&
      executions.success ? (
        <>
          <AlertsHeading alerts={alerts.data.alerts} />
          <Spacer y={4} />
          <p className="text-xl font-bold mb-2 text-default-500">List</p>
          <AlertsList
            alerts={alerts.data.alerts}
            compactMode={false}
            flows={flows.data.flows}
            maxAlerts={25}
            runners={runners.data.runners}
          />
        </>
      ) : (
        <ErrorCard
          error={
            flows.error || runners.error || alerts.error || executions.error
          }
          message={
            flows.message ||
            runners.message ||
            alerts.message ||
            executions.message
          }
        />
      )}
    </>
  );
}
