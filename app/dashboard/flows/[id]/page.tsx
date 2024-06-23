import { Flow } from "@/components/dashboard/flows/flow";

export default function DashboardFlowPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <>
      <Flow id={params.id} />
    </>
  );
}
