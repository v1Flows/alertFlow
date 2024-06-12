import BreadCrumb from '@/components/breadcrumb';
import { Flow } from '@/components/dashboard/flows/flow';
import { LoadingCard } from '@/components/loading/loadingCard';
import { Suspense } from 'react'
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Page({ params }: { params: { flowId: string } }) {
  const breadcrumbItems = [
    { title: 'Flows', link: '/dashboard/flows' },
    { title: `${params.flowId}`, link: '/dashboard/flow/{{ flowId }}' }
  ];
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <Suspense fallback={<LoadingCard />}>
          <Flow flowId={params.flowId} />
        </Suspense>
      </div>
    </ScrollArea>
  );
}
