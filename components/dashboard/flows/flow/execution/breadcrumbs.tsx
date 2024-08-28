"use client";

import React from "react";
import { Breadcrumbs, BreadcrumbItem, Snippet } from "@nextui-org/react";
import { Icon } from "@iconify/react";

export default function ExecutionBreadcrumbs({ flowID, executionID }: any) {
  return (
    <Breadcrumbs>
      <BreadcrumbItem href="/dashboard/flows">
        <Icon icon="solar:book-bookmark-broken" width={20} />
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
