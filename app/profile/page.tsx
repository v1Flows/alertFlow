import { cookies } from "next/headers";

import ErrorCard from "@/components/error/ErrorCard";
import { UserProfile } from "@/components/user/profile";
import PageGetPlans from "@/lib/fetch/page/plans";
import PageGetSettings from "@/lib/fetch/page/settings";
import GetUserDetails from "@/lib/fetch/user/getDetails";
import GetPaymentMethods from "@/lib/fetch/user/GetPaymentMethods";
import GetUserStats from "@/lib/fetch/user/getStats";
import GetUserSubscription from "@/lib/fetch/user/getSubscription";

export default async function UserProfilePage() {
  const c = await cookies();

  const settingsData = PageGetSettings();
  const userDetailsData = GetUserDetails();
  const paymentMethodsData = GetPaymentMethods();
  const plansData = PageGetPlans();
  const subscriptionData = GetUserSubscription();
  const statsData = GetUserStats();
  const session = c.get("session")?.value;

  const [settings, userDetails, paymentMethods, plans, subscription, stats] =
    (await Promise.all([
      settingsData,
      userDetailsData,
      paymentMethodsData,
      plansData,
      subscriptionData,
      statsData,
    ])) as any;

  return (
    <>
      {settings.success &&
      userDetails.success &&
      paymentMethods.success &&
      plans.success &&
      subscription.success &&
      stats.success ? (
        <UserProfile
          paymentMethods={paymentMethods.data.payment_methods}
          plans={plans.data.plans}
          session={session}
          settings={settings.data.settings}
          stats={stats.data.stats}
          subscription={subscription.data.subscriptions}
          user={userDetails.data.user}
        />
      ) : (
        <ErrorCard
          error={
            settings.error ||
            userDetails.error ||
            paymentMethods.error ||
            plans.error ||
            subscription.error ||
            stats.error
          }
          message={
            settings.message ||
            userDetails.message ||
            paymentMethods.message ||
            plans.message ||
            subscription.message ||
            stats.message
          }
        />
      )}
    </>
  );
}
