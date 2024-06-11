import BreadCrumb from '@/components/breadcrumb';
import { Suspense } from 'react'
import { ProjectList } from "@/components/dashboard/projects/projectList";
import { LoadingCard } from "@/components/loading/loadingCard";

const breadcrumbItems = [{ title: 'Projects', link: '/dashboard/projects' }];
export default function page() {
  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <Suspense fallback={<LoadingCard />}>
          <ProjectList />
        </Suspense>
      </div>
    </>
  );
}
