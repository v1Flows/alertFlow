"use client";

import React from "react";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";

import { Flash, HomeIcon } from "@/components/icons";

export default function ExecutionBreadcrumbs({ flowID, executionID }: any) {
  return (
    <Breadcrumbs>
      <BreadcrumbItem href="/dashboard" startContent={<HomeIcon />}>
        Dashboard
      </BreadcrumbItem>
      <BreadcrumbItem
        href="/dashboard/flows"
        startContent={
          <Flash className="text-primary" fill="currentColor" size={15} />
        }
      >
        Flows
      </BreadcrumbItem>
      <BreadcrumbItem href={`/dashboard/flows/${flowID}`}>Flow</BreadcrumbItem>
      <BreadcrumbItem
        isCurrent
        href={`/dashboard/flows/${flowID}/execution/${executionID}`}
      >
        {executionID}
      </BreadcrumbItem>
    </Breadcrumbs>
  );
}
