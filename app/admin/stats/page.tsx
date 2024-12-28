import { PageStats } from "@/components/admin/stats/stats";
import ErrorCard from "@/components/error/ErrorCard";
import AdminGetFlows from "@/lib/fetch/admin/flows";
import AdminGetProjects from "@/lib/fetch/admin/projects";
import AdminGetUsers from "@/lib/fetch/admin/users";

export default async function AdminStatsPage() {
  const flowsData = AdminGetFlows();
  const projectsData = AdminGetProjects();
  const usersData = AdminGetUsers();

  const [flows, projects, users] = (await Promise.all([
    flowsData,
    projectsData,
    usersData,
  ])) as any;

  return (
    <>
      {flows.success && projects.success && users.success ? (
        <PageStats
          flows={flows.data.flows}
          projects={projects.data.projects}
          users={users.data.users}
        />
      ) : (
        <ErrorCard
          error={projects.error || flows.error || users.error}
          message={projects.message || flows.message || users.message}
        />
      )}
    </>
  );
}
