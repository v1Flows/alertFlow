import { Project } from "@/components/dashboard/projects/project";

export default function DashboardProjectPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <>
      <Project id={params.id} />
    </>
  );
}
