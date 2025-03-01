import { ExecutionsList } from "@/components/admin/executions/list";
import ErrorCard from "@/components/error/ErrorCard";
import AdminGetExecutions from "@/lib/fetch/admin/executions";
import AdminGetFlows from "@/lib/fetch/admin/flows";
import { AdminGetAlerts } from "@/lib/fetch/admin/alerts";
import AdminGetProjects from "@/lib/fetch/admin/projects";
import AdminGetRunners from "@/lib/fetch/admin/runners";

export default async function AdminExecutionsPage() {
  const flowsData = AdminGetFlows();
  const projectsData = AdminGetProjects();
  const runnersData = AdminGetRunners();
  const alertsData = AdminGetAlerts();
  const executionsData = AdminGetExecutions();

  const [flows, projects, runners, alerts, executions] = (await Promise.all([
    flowsData,
    projectsData,
    runnersData,
    alertsData,
    executionsData,
  ])) as any;

  return (
    <>
      {executions.success &&
      flows.success &&
      alerts.success &&
      projects.success &&
      runners.success ? (
        <ExecutionsList
          executions={executions.data.executions}
          flows={flows.data.flows}
          payloads={alerts.data.payloads}
          projects={projects.data.projects}
          runners={[
            ...runners.data.alertflow_runners,
            ...runners.data.self_hosted_runners,
          ]}
        />
      ) : (
        <ErrorCard
          error={
            executions.error ||
            flows.error ||
            alerts.error ||
            projects.error ||
            runners.error
          }
          message={
            executions.message ||
            flows.message ||
            alerts.message ||
            projects.message ||
            runners.message
          }
        />
      )}
    </>
  );
}
