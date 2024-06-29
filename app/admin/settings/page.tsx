import { Settings } from "@/components/admin/settings/list";
import AdminGetSettings from "@/lib/fetch/admin/settings";

export default async function AdminSettingsPage() {
  var settings = await AdminGetSettings();

  return (
    <>
      <Settings settings={settings} />
    </>
  );
}
