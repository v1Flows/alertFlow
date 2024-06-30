import { Project } from "@/components/dashboard/projects/project";
import PageGetSettings from "@/lib/fetch/page/settings";

export default async function DashboardProjectPage({
  params,
}: {
  params: { id: string };
}) {

  const settings = await PageGetSettings();

  return (
    <>
      <Project id={params.id} settings={settings} />
    </>
  );
}
