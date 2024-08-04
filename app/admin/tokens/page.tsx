import { TokensList } from "@/components/admin/tokens/list";
import AdminGetTokens from "@/lib/fetch/admin/tokens";
import AdminGetProjects from "@/lib/fetch/admin/projects";
export default async function AdminTokensPage() {
  const tokens = await AdminGetTokens();
  const projects = await AdminGetProjects();

  return (
    <>
      <TokensList projects={projects.projects} tokens={tokens} />
    </>
  );
}
