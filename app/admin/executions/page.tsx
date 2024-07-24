import { ExecutionsList } from "@/components/admin/executions/list";
import AdminGetExecutions from "@/lib/fetch/admin/executions";
import AdminGetFlows from "@/lib/fetch/admin/flows";
import AdminGetPayloads from "@/lib/fetch/admin/payloads";
import AdminGetProjects from "@/lib/fetch/admin/projects";
import AdminGetRunners from "@/lib/fetch/admin/runners";

export default async function AdminPayloadsPage() {
  const flows = await AdminGetFlows();
  const projects = await AdminGetProjects();
  const runners = await AdminGetRunners();
  const payloads = await AdminGetPayloads();
  const executions = await AdminGetExecutions();

  const combined_runners = [
    ...runners.alertflow_runners,
    ...runners.self_hosted_runners,
  ];

  return (
    <>
      <ExecutionsList
        executions={executions}
        flows={flows}
        payloads={payloads}
        projects={projects.projects}
        runners={combined_runners}
      />
    </>
  );
}
