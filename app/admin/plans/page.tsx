import AdminPlans from "@/components/admin/plans/plans";
import PageGetPlans from "@/lib/fetch/page/plans";
import { Divider } from "@nextui-org/react";

export default async function AdminPayloadsPage() {
  const plans = await PageGetPlans();

  return (
    <>
      <AdminPlans plans={plans} />
    </>
  );
}
