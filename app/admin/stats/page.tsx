import { PageStats } from "@/components/admin/stats/stats";
import AdminGetFlows from "@/lib/fetch/admin/flows";
import AdminGetProjects from "@/lib/fetch/admin/projects";
import AdminGetUsers from "@/lib/fetch/admin/users";

export default async function AdminStatsPage() {
  const flows = await AdminGetFlows();
  const projects = await AdminGetProjects();
  const users = await AdminGetUsers();

  return (
    <>
      <PageStats flows={flows} projects={projects} users={users} />
    </>
  );
}
