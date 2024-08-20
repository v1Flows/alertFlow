import { cookies } from "next/headers";

import FlowList from "@/components/dashboard/flows/list";
import GetFlows from "@/lib/fetch/flow/all";
import PageGetSettings from "@/lib/fetch/page/settings";
import GetProjects from "@/lib/fetch/project/all";
import GetUserDetails from "@/lib/fetch/user/getDetails";
import GetUserPlan from "@/lib/fetch/user/getPlan";

export default async function DashboardFlowsPage() {
  const user = JSON.parse(cookies().get("user")?.value || "{}");

  const flows = await GetFlows();
  const projects = await GetProjects();
  const settings = await PageGetSettings();
  const plan = await GetUserPlan();
  const userDetails = await GetUserDetails(user.id);

  return (
    <main>
      <FlowList
        flows={flows}
        plan={plan}
        projects={projects.projects}
        settings={settings}
        user={userDetails}
      />
    </main>
  );
}
