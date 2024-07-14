import { ApiKeysList } from "@/components/admin/apikeys/list";
import AdminGetApiKeys from "@/lib/fetch/admin/apikeys";
import AdminGetProjects from "@/lib/fetch/admin/projects";
export default async function AdminApiKeysPage() {
  const apikeys = await AdminGetApiKeys();
  const projects = await AdminGetProjects();

  return (
    <>
      <ApiKeysList apikeys={apikeys} projects={projects.projects} />
    </>
  );
}
