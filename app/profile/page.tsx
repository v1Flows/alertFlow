import { UserProfile } from "@/components/user/profile";
import PageGetSettings from "@/lib/fetch/page/settings";
import GetUserDetails from "@/lib/fetch/user/getDetails";

export default async function UserProfilePage() {
  const settings = await PageGetSettings();
  const userDetails = await GetUserDetails();

  return (
    <>
      <UserProfile settings={settings} user={userDetails} />
    </>
  );
}
