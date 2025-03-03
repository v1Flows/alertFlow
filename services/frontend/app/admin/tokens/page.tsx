import { TokensList } from "@/components/admin/tokens/list";
import ErrorCard from "@/components/error/ErrorCard";
import AdminGetProjects from "@/lib/fetch/admin/projects";
import AdminGetTokens from "@/lib/fetch/admin/tokens";

export default async function AdminTokensPage() {
  const tokensData = AdminGetTokens();
  const projectsData = AdminGetProjects();

  const [tokens, projects] = (await Promise.all([
    tokensData,
    projectsData,
  ])) as any;

  return (
    <>
      {tokens.success && projects.success ? (
        <TokensList
          projects={projects.data.projects}
          tokens={tokens.data.tokens}
        />
      ) : (
        <ErrorCard
          error={tokens.error || projects.error}
          message={tokens.message || projects.message}
        />
      )}
    </>
  );
}
