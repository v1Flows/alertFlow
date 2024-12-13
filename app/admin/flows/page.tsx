import { FlowsList } from "@/components/admin/flows/list";
import ErrorCard from "@/components/error/ErrorCard";
import AdminGetFlows from "@/lib/fetch/admin/flows";
import AdminGetProjects from "@/lib/fetch/admin/projects";
import AdminGetRunners from "@/lib/fetch/admin/runners";

export default async function AdminFlowsPage() {
  const flowsData = AdminGetFlows();
  const projectsData = AdminGetProjects();
  const runnersData = AdminGetRunners();

  const [flows, projects, runners] = (await Promise.all([
    flowsData,
    projectsData,
    runnersData,
  ])) as any;

  return (
    <>
      {flows.success && projects.success && runners.success ? (
        <FlowsList
          flows={flows.data.flows}
          projects={projects.data.projects}
          runners={[
            ...runners.data.self_hosted_runners,
            ...runners.data.alertflow_runners,
          ]}
        />
      ) : (
        <ErrorCard
          error={flows.error || projects.error || runners.error}
          message={flows.message || flows.message || runners.message}
        />
      )}
    </>
  );
}
