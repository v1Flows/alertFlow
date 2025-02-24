import { Spacer } from "@heroui/react";

import AlertsHeading from "@/components/dashboard/alerts/heading";
import AlertsList from "@/components/dashboard/alerts/list";
import ErrorCard from "@/components/error/ErrorCard";
import GetAlerts from "@/lib/fetch/alert/alerts";

export default async function DashboardAlertsPage() {
  const alertsData = GetAlerts();

  const [alerts] = (await Promise.all([alertsData])) as any;

  return (
    <>
      {alerts.success ? (
        <>
          <AlertsHeading alerts={alerts.data.alerts} />
          <Spacer y={4} />
          <AlertsList alerts={alerts.data.alerts} />
        </>
      ) : (
        <ErrorCard error={alerts.error} message={alerts.message} />
      )}
    </>
  );
}
