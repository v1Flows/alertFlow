import { PageStats } from "@/components/admin/stats/stats";
import AdminGetExecutions from "@/lib/fetch/admin/executions";
import AdminGetFlows from "@/lib/fetch/admin/flows";
import AdminGetPayloads from "@/lib/fetch/admin/payloads";
import AdminGetProjects from "@/lib/fetch/admin/projects";
import AdminGetRunners from "@/lib/fetch/admin/runners";
import AdminGetUsers from "@/lib/fetch/admin/users";

export default async function AdminStatsPage() {
  const flows = await AdminGetFlows();
  const projects = await AdminGetProjects();
  const runners = await AdminGetRunners();
  const payloads = await AdminGetPayloads();
  const executions = await AdminGetExecutions();
  const users = await AdminGetUsers();

  return (
    <>
      <PageStats
        alertflow_runners={runners.alertflow_runners}
        executions={executions}
        flows={flows}
        payloads={payloads}
        projects={projects}
        selfhosted_runners={runners.self_hosted_runners}
        users={users}
      />
    </>
  );
}
