import Project from "@/components/dashboard/projects/project";
import PageGetSettings from "@/lib/fetch/page/settings";
import GetProjectApiKeys from "@/lib/fetch/project/apiKeys";
import GetProject from "@/lib/fetch/project/data";
import GetProjectRunners from "@/lib/fetch/project/runners";

export default async function DashboardProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const settings = await PageGetSettings();
  const project = await GetProject(params.id);
  const runners = await GetProjectRunners(params.id);
  const apiKeys = await GetProjectApiKeys(params.id);

  return (
    <>
      <Project
        apiKeys={apiKeys}
        project={project}
        runners={runners}
        settings={settings}
      />
    </>
  );
}
