"use client";
import { Card, CardBody, Skeleton, Spacer } from "@heroui/react";
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
            <div className="w-5/5 h-8 rounded-lg bg-default-200" />
          </Skeleton>
        </CardBody>
      </Card>
    </>
  );
}
