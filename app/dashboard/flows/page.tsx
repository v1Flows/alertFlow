import FlowList from "@/components/dashboard/flows/list";
import GetFlows from "@/lib/fetch/flow/all";
import GetProjects from "@/lib/fetch/project/all";
import { Suspense } from "react";

export default async function DashboardFlowsPage() {
  const flows = await GetFlows();
  const projects = await GetProjects();

  return (
    <main>
      <FlowList flows={flows} projects={projects} />
    </main>
  );
}
