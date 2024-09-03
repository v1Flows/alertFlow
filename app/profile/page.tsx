import { UserProfile } from "@/components/user/profile";
import PageGetSettings from "@/lib/fetch/page/settings";
import GetPaymentMethods from "@/lib/fetch/payment/GetPaymentMethods";
import GetUserDetails from "@/lib/fetch/user/getDetails";

export default async function UserProfilePage() {
  const settings = await PageGetSettings();
  const userDetails = await GetUserDetails();
  const paymentMethods = await GetPaymentMethods();

  return (
    <>
      <UserProfile
        paymentMethods={paymentMethods}
        settings={settings}
        user={userDetails}
      />
    </>
  );
}
