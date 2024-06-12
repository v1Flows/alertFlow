import BreadCrumb from '@/components/breadcrumb';
import { Project } from '@/components/dashboard/projects/project';
import { LoadingCard } from '@/components/loading/loadingCard';
import { Suspense } from 'react'
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Page({ params }: { params: { projectId: string } }) {
  const breadcrumbItems = [
    { title: 'Projects', link: '/dashboard/projects' },
    { title: `${params.projectId}`, link: '/dashboard/flow/{{ projectId }}' }
  ];
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <Suspense fallback={<LoadingCard />}>
          <Project projectId={params.projectId} />
        </Suspense>
      </div>
    </ScrollArea>
  );
}
