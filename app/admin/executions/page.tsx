import { ExecutionsList } from "@/components/admin/executions/list";
import ErrorCard from "@/components/error/ErrorCard";
import AdminGetExecutions from "@/lib/fetch/admin/executions";
import AdminGetFlows from "@/lib/fetch/admin/flows";
import AdminGetPayloads from "@/lib/fetch/admin/payloads";
import AdminGetProjects from "@/lib/fetch/admin/projects";
import AdminGetRunners from "@/lib/fetch/admin/runners";

export default async function AdminExecutionsPage() {
  const flowsData = AdminGetFlows();
  const projectsData = AdminGetProjects();
  const runnersData = AdminGetRunners();
  const payloadsData = AdminGetPayloads();
  const executionsData = AdminGetExecutions();

  const [flows, projects, runners, payloads, executions] = (await Promise.all([
    flowsData,
    projectsData,
    runnersData,
    payloadsData,
    executionsData,
  ])) as any;

  return (
    <>
      {executions.success &&
      flows.success &&
      payloads.success &&
      projects.success &&
      runners.success ? (
        <ExecutionsList
          executions={executions.data.executions}
          flows={flows.data.flows}
          payloads={payloads.data.payloads}
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
            payloads.error ||
            projects.error ||
            runners.error
          }
          message={
            executions.message ||
            flows.message ||
            payloads.message ||
            projects.message ||
            runners.message
          }
        />
      )}
    </>
  );
}
