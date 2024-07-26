"use client";

import React from "react";
import { Breadcrumbs, BreadcrumbItem, Snippet } from "@nextui-org/react";
import { Icon } from "@iconify/react";

export default function FlowBreadcrumbs({ id }: any) {
  return (
    <Breadcrumbs>
      <BreadcrumbItem href="/dashboard/flows">
        <Icon icon="solar:book-bookmark-broken" width={20} /> Flows
      </BreadcrumbItem>
      <BreadcrumbItem href={`/dashboard/flows/${id}`}>
        <Snippet hideSymbol className="bg-transparent" size="sm" variant="flat">
          {id}
        </Snippet>
      </BreadcrumbItem>
    </Breadcrumbs>
  );
}
