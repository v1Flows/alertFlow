import { ProjectList } from "@/components/admin/projects/list";
import ErrorCard from "@/components/error/ErrorCard";
import AdminGetProjects from "@/lib/fetch/admin/projects";

export default async function AdminProjectsPage() {
  const projectsData = AdminGetProjects();

  const [projects] = (await Promise.all([projectsData])) as any;

  return (
    <>
      {projects.success ? (
        <ProjectList
          members={projects.data.members}
          projects={projects.data.projects}
        />
      ) : (
        <ErrorCard error={projects.error} message={projects.message} />
      )}
    </>
  );
}
