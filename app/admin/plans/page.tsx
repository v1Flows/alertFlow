import AdminPlans from "@/components/admin/plans/plans";
import PageGetPlans from "@/lib/fetch/page/plans";

export default async function AdminPlansPage() {
  const plans = await PageGetPlans();

  return (
    <>
      <AdminPlans plans={plans} />
    </>
  );
}
