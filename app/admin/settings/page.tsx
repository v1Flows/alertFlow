import { Settings } from "@/components/admin/settings/list";
import ErrorCard from "@/components/error/ErrorCard";
import PageGetSettings from "@/lib/fetch/page/settings";

export default async function AdminSettingsPage() {
  var settingsData = PageGetSettings();

  const [settings] = (await Promise.all([settingsData])) as any;

  return (
    <>
      {settings.success ? (
        <Settings settings={settings.data.settings} />
      ) : (
        <ErrorCard error={settings.error} message={settings.message} />
      )}
    </>
  );
}
