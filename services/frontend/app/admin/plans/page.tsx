import AdminPlans from "@/components/admin/plans/plans";
import ErrorCard from "@/components/error/ErrorCard";
import PageGetPlans from "@/lib/fetch/page/plans";

export default async function AdminPlansPage() {
  const plansData = PageGetPlans();

  const [plans] = (await Promise.all([plansData])) as any;

  return (
    <>
      {plans.success ? (
        <AdminPlans plans={plans.data.plans} />
      ) : (
        <ErrorCard error={plans.error} message={plans.message} />
      )}
    </>
  );
}
