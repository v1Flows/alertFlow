import { UserProfile } from "@/components/user/profile";
import PageGetSettings from "@/lib/fetch/page/settings";
import GetUserDetails from "@/lib/fetch/user/getDetails";
import { cookies } from "next/headers";

export default async function UserProfilePage() {
  const user = JSON.parse(cookies().get("user")?.value || "{}");

  const settings = await PageGetSettings();
  const userDetails = await GetUserDetails(user.id);

  return (
    <>
      <UserProfile settings={settings} user={userDetails} />
    </>
  );
}
