"use client";
import { Card, CardBody, Divider, Skeleton, Spacer } from "@nextui-org/react";
import React from "react";

import ExecutionBreadcrumbs from "@/components/dashboard/flows/flow/execution/breadcrumbs";

export default function loader() {
  return (
    <>
      <ExecutionBreadcrumbs executionID={"..."} flowID={"..."} />
      <div className="flex items-center gap-2 mb-2 mt-2">
        <div className="flex flex-col gap-2 w-full">
          <Skeleton className="w-1/12 rounded-lg">
            <div className="h-3 w-1/12 rounded-lg bg-default-200" />
          </Skeleton>
          <Skeleton className="w-2/12 rounded-lg">
            <div className="h-3 w-2/12 rounded-lg bg-default-200" />
          </Skeleton>
        </div>
      </div>
      <Divider className="mt-4 mb-4" />
      <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 items-stretch gap-4">
        {[1, 2, 3, 4].map((_, i) => (
          <Card key={i} fullWidth>
            <CardBody>
              <div className="flex items-center gap-2">
                <Skeleton className="w-2/12 rounded-lg">
                  <div className="h-12 w-2/12 rounded-lg bg-default-200" />
                </Skeleton>
                <div className="flex flex-col gap-2 w-full">
                  <Skeleton className="w-1/12 rounded-lg">
                    <div className="h-3 w-1/12 rounded-lg bg-default-200" />
                  </Skeleton>
                  <Skeleton className="w-2/12 rounded-lg">
                    <div className="h-3 w-2/12 rounded-lg bg-default-200" />
                  </Skeleton>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
      <Spacer y={4} />
      <Card fullWidth>
        <CardBody>
          <Skeleton className="w-5/5 rounded-lg">
            <div className="h-8 w-5/5 rounded-lg bg-default-200" />
          </Skeleton>
        </CardBody>
      </Card>
    </>
  );
}
