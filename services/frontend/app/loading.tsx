"use client";
import { Card, CardBody, Skeleton, Spacer } from "@heroui/react";
import React from "react";

export default function loader() {
  return (
    <>
      <p className="text-xl font-bold">Hello 👋</p>
      <p className="text-default-500">
        Here&apos;s the current status for today.
      </p>
      <Spacer y={4} />
      <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((_, i) => (
          <Card key={i} fullWidth>
            <CardBody>
              <div className="flex items-center gap-2">
                <Skeleton className="w-2/12 rounded-lg">
                  <div className="h-12 w-2/12 rounded-lg bg-default-200" />
                </Skeleton>
                <div className="flex w-full flex-col gap-2">
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
      <Spacer y={2} />
      <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2">
        {[1, 2].map((_, i) => (
          <Card key={i} fullWidth>
            <CardBody>
              <div className="flex items-center gap-2">
                <Skeleton className="w-2/12 rounded-lg">
                  <div className="h-12 w-2/12 rounded-lg bg-default-200" />
                </Skeleton>
                <div className="flex w-full flex-col gap-2">
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

      <div className="my-4 flex items-end justify-between">
        <div>
          <p className="mb-0 text-2xl font-bold">
            Latest <span className="text-primary">Executions</span>
          </p>
        </div>
      </div>
      <Card fullWidth>
        <CardBody>
          <div className="flex items-center gap-2">
            <Skeleton className="w-2/12 rounded-lg">
              <div className="h-12 w-2/12 rounded-lg bg-default-200" />
            </Skeleton>
            <div className="flex w-full flex-col gap-2">
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
      <Spacer y={2} />
      <Card fullWidth>
        <CardBody>
          <Skeleton className="w-5/5 rounded-lg">
            <div className="w-5/5 h-8 rounded-lg bg-default-200" />
          </Skeleton>
        </CardBody>
      </Card>
    </>
  );
}
