"use client";
import { Card, CardBody, Skeleton, Spacer } from "@nextui-org/react";
import React from "react";

export default function loader() {
  return (
    <>
      <Skeleton className="w-2/12 rounded-lg">
        <div className="h-12 w-2/12 rounded-lg bg-default-200" />
      </Skeleton>
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
