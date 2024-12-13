"use client";
import { Card, Skeleton, Spacer } from "@nextui-org/react";
import React from "react";

export default function loader() {
  return (
    <>
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-2 items-center justify-between">
        <p className="text-2xl font-bold">Flows</p>
        <div className="flex flex-cols justify-end items-center gap-4">
          <Skeleton className="w-2/5 rounded-lg">
            <div className="h-5 w-2/5 rounded-lg bg-default-200" />
          </Skeleton>
          <Skeleton className="w-2/5 rounded-lg">
            <div className="h-5 w-2/5 rounded-lg bg-default-200" />
          </Skeleton>
        </div>
      </div>
      <Spacer y={4} />
      <Card className="w-full space-y-5 p-4" radius="lg">
        <Skeleton className="rounded-lg">
          <div className="h-24 rounded-lg bg-default-300" />
        </Skeleton>
        <div className="space-y-3">
          <Skeleton className="w-3/5 rounded-lg">
            <div className="h-3 w-3/5 rounded-lg bg-default-200" />
          </Skeleton>
          <Skeleton className="w-4/5 rounded-lg">
            <div className="h-3 w-4/5 rounded-lg bg-default-200" />
          </Skeleton>
          <Skeleton className="w-2/5 rounded-lg">
            <div className="h-3 w-2/5 rounded-lg bg-default-300" />
          </Skeleton>
        </div>
      </Card>
    </>
  );
}
