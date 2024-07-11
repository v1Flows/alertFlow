import { FlowsList } from "@/components/admin/flows/list";
import AdminGetFlows from "@/lib/fetch/admin/flows";
import AdminGetProjects from "@/lib/fetch/admin/projects";

export default async function AdminFlowsPage() {
  const flows = await AdminGetFlows();
  const projects = await AdminGetProjects();

  return (
    <>
      <FlowsList flows={flows} projects={projects} />
    </>
  );
}
