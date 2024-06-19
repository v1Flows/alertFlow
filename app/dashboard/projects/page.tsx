
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";

import { ProjectsList } from "@/components/dashboard/projects/list";
import GetProjects from "@/lib/fetch/project/all";

export default async function DashboardProjectsPage() {
  const projects = await GetProjects();

  return (
    <>
      <Breadcrumbs>
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbItem>Music</BreadcrumbItem>
        <BreadcrumbItem>Artist</BreadcrumbItem>
        <BreadcrumbItem>Album</BreadcrumbItem>
        <BreadcrumbItem>Song</BreadcrumbItem>
      </Breadcrumbs>
      <ProjectsList projects={projects} />
    </>
  );
}
