import { UserProfile } from "@/components/user/profile";
import PageGetSettings from "@/lib/fetch/page/settings";
import GetUserDetails from "@/lib/fetch/user/getDetails";

export default async function UserProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const settings = await PageGetSettings();
  const user = await GetUserDetails(params.id);

  return (
    <>
      <UserProfile settings={settings} user={user} />
    </>
  );
}
