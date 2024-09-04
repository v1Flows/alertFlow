import { UserProfile } from "@/components/user/profile";
import PageGetPlans from "@/lib/fetch/page/plans";
import PageGetSettings from "@/lib/fetch/page/settings";
import GetPaymentMethods from "@/lib/fetch/user/GetPaymentMethods";
import GetUserDetails from "@/lib/fetch/user/getDetails";
import GetUserSubscription from "@/lib/fetch/user/getSubscription";

export default async function UserProfilePage() {
  const settings = await PageGetSettings();
  const userDetails = await GetUserDetails();
  const paymentMethods = await GetPaymentMethods();
  const plans = await PageGetPlans();
  const subscription = await GetUserSubscription();

  return (
    <>
      <UserProfile
        paymentMethods={paymentMethods}
        plans={plans}
        settings={settings}
        user={userDetails}
        subscription={subscription}
      />
    </>
  );
}
