import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";

import { Project } from "@/components/dashboard/projects/project";

export default function DashboardProjectPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <>
      <Breadcrumbs>
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbItem>Music</BreadcrumbItem>
        <BreadcrumbItem>Artist</BreadcrumbItem>
        <BreadcrumbItem>Album</BreadcrumbItem>
        <BreadcrumbItem>Song</BreadcrumbItem>
      </Breadcrumbs>
      <Project id={params.id} />
    </>
  );
}
