import { FlowsList } from "@/components/admin/flows/list";
import AdminGetFlows from "@/lib/fetch/admin/flows";
import AdminGetProjects from "@/lib/fetch/admin/projects";
import AdminGetRunners from "@/lib/fetch/admin/runners";

export default async function AdminFlowsPage() {
  const flows = await AdminGetFlows();
  const projects = await AdminGetProjects();
  const runners = await AdminGetRunners();

  const combined_runners = [
    ...runners.alertflow_runners,
    ...runners.self_hosted_runners,
  ];

  return (
    <>
      <FlowsList flows={flows} projects={projects} runners={combined_runners} />
    </>
  );
}
