import { Settings } from "@/components/admin/settings/list";
import PageGetSettings from "@/lib/fetch/page/settings";

export default async function AdminSettingsPage() {
  var settings = await PageGetSettings();

  return (
    <>
      <Settings settings={settings} />
    </>
  );
}
