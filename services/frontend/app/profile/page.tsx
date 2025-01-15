import { cookies } from "next/headers";

import ErrorCard from "@/components/error/ErrorCard";
import { UserProfile } from "@/components/user/profile";
import PageGetSettings from "@/lib/fetch/page/settings";
import GetUserDetails from "@/lib/fetch/user/getDetails";
import GetUserStats from "@/lib/fetch/user/getStats";

export default async function UserProfilePage() {
  const c = await cookies();

  const settingsData = PageGetSettings();
  const userDetailsData = GetUserDetails();
  const statsData = GetUserStats();
  const session = c.get("session")?.value;

  const [settings, userDetails, stats] = (await Promise.all([
    settingsData,
    userDetailsData,
    statsData,
  ])) as any;

  return (
    <>
      {settings.success && userDetails.success && stats.success ? (
        <UserProfile
          session={session}
          settings={settings.data.settings}
          stats={stats.data.stats}
          user={userDetails.data.user}
        />
      ) : (
        <ErrorCard
          error={settings.error || userDetails.error || stats.error}
          message={settings.message || userDetails.message || stats.message}
        />
      )}
    </>
  );
}
