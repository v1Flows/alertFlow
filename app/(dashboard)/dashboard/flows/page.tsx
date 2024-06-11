import BreadCrumb from '@/components/breadcrumb';
import { Suspense } from 'react'
import { FlowList } from "@/components/dashboard/flows/flowList";
import { LoadingCard } from "@/components/loading/loadingCard";

const breadcrumbItems = [{ title: 'Flows', link: '/dashboard/flows' }];
export default function page() {
  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <Suspense fallback={<LoadingCard />}>
          <FlowList />
        </Suspense>
      </div>
    </>
  );
}
