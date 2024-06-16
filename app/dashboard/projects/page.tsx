import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";

import { ProjectsList } from "@/components/dashboard/projects/list";

export default function DashboardProjectsPage() {
  return (
    <>
      <Breadcrumbs>
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbItem>Music</BreadcrumbItem>
        <BreadcrumbItem>Artist</BreadcrumbItem>
        <BreadcrumbItem>Album</BreadcrumbItem>
        <BreadcrumbItem>Song</BreadcrumbItem>
      </Breadcrumbs>
      <ProjectsList />
    </>
  );
}
