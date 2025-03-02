import { Spacer } from "@heroui/react";

import AlertsHeading from "@/components/dashboard/alerts/heading";
import AlertsList from "@/components/dashboard/alerts/list";
import ErrorCard from "@/components/error/ErrorCard";
import GetAlerts from "@/lib/fetch/alert/alerts";
import GetRunners from "@/lib/fetch/runner/get";
import GetFlows from "@/lib/fetch/flow/all";

export default async function DashboardAlertsPage() {
  const alertsData = GetAlerts();
  const runnersData = GetRunners();
  const flowsData = GetFlows();

  const [alerts, runners, flows] = (await Promise.all([
    alertsData,
    runnersData,
    flowsData,
  ])) as any;

  return (
    <>
      {alerts.success ? (
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
        <ErrorCard error={alerts.error} message={alerts.message} />
      )}
    </>
  );
}
