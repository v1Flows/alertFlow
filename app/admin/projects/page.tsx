import { ProjectList } from "@/components/admin/projects/list";
import AdminGetProjects from "@/lib/fetch/admin/projects";

export default async function AdminProjectsPage() {
  const projects = await AdminGetProjects();

  return (
    <>
      <ProjectList projects={projects.projects} members={projects.members} />
    </>
  );
}
