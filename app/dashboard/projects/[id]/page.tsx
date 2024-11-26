import Project from "@/components/dashboard/projects/project";
import PageGetSettings from "@/lib/fetch/page/settings";
import GetProjectApiKeys from "@/lib/fetch/project/tokens";
import GetProjectAuditLogs from "@/lib/fetch/project/audit";
import GetProject from "@/lib/fetch/project/data";
import GetProjectRunners from "@/lib/fetch/project/runners";
import GetUserPlan from "@/lib/fetch/user/getPlan";
import GetUserDetails from "@/lib/fetch/user/getDetails";
import GetFlows from "@/lib/fetch/flow/all";

export default async function DashboardProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const settings = await PageGetSettings();
  const project = await GetProject(params.id);
  const runners = await GetProjectRunners(params.id);
  const tokens = await GetProjectApiKeys(params.id);
  const plan = await GetUserPlan();
  const audit = await GetProjectAuditLogs(params.id);
  const userDetails = await GetUserDetails();
  const flows = await GetFlows();

  return (
    <>
      <Project
        audit={audit}
        members={project.members}
        plan={plan}
        project={project.project}
        runners={runners}
        settings={settings}
        tokens={tokens}
        user={userDetails}
        flows={flows}
      />
    </>
  );
}
