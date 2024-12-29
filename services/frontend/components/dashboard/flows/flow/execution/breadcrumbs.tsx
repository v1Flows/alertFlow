"use client";

import { Icon } from "@iconify/react";
import { BreadcrumbItem, Breadcrumbs, Snippet } from "@nextui-org/react";
import React from "react";

export default function ExecutionBreadcrumbs({ flowID, executionID }: any) {
  return (
    <Breadcrumbs>
      <BreadcrumbItem href="/dashboard/flows">
        <Icon icon="solar:book-2-outline" width={20} />
      </BreadcrumbItem>
      <BreadcrumbItem href={`/dashboard/flows/${flowID}`}>Flow</BreadcrumbItem>
      <BreadcrumbItem
        isCurrent
        href={`/dashboard/flows/${flowID}/execution/${executionID}`}
      >
        <Snippet hideSymbol className="bg-transparent" size="sm" variant="flat">
          {executionID}
        </Snippet>
      </BreadcrumbItem>
    </Breadcrumbs>
  );
}
