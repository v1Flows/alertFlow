"use client";

import { Card, CardHeader, Chip, Divider, Progress } from "@nextui-org/react";
import TimeAgo from "react-timeago";
import { Icon } from "@iconify/react";

import Reloader from "@/components/reloader/Reloader";

import ExecutionBreadcrumbs from "./breadcrumbs";

export function Execution({ flow, execution, settings }: any) {
  return (
    <>
      <div className="grid lg:grid-cols-2 items-center justify-between">
        <ExecutionBreadcrumbs executionID={execution.id} flowID={flow.id} />
        <div className="lg:justify-self-end lg:mt-0 mt-2">
          <Reloader />
        </div>
      </div>
      <Divider className="mt-4 mb-4" />
      <div className="grid grid-cols-1 gap-4">
        <Card fullWidth>
          <CardHeader className="justify-between">
            <div className="flex justify-start items-center gap-2">
              <Icon
                height="24"
                icon="solar:alt-arrow-right-broken"
                width="24"
              />
              Incoming Payload
            </div>
            <Chip radius="sm" variant="flat">
              <TimeAgo date={new Date(execution.created_at)} />
            </Chip>
          </CardHeader>
        </Card>
        <Card fullWidth>
          <CardHeader className="justify-between">
            <div className="flex justify-start items-center gap-2">
              <Icon
                height="24"
                icon="solar:alt-arrow-right-broken"
                width="24"
              />
              Register Execution
            </div>
            <Chip radius="sm" variant="flat">
              <TimeAgo date={new Date(execution.created_at)} />
            </Chip>
          </CardHeader>
        </Card>
        <Card fullWidth>
          <CardHeader className="justify-between">
            <div className="flex justify-start items-center gap-2">
              <Icon
                height="24"
                icon="solar:alt-arrow-right-broken"
                width="24"
              />
              Starting Execution
            </div>
            <Chip radius="sm" variant="flat">
              <TimeAgo date={new Date(execution.executed_at)} />
            </Chip>
          </CardHeader>
        </Card>
        <Card fullWidth className="bg-primary">
          <CardHeader className="justify-between">
            <div className="flex justify-start items-center gap-2">
              <Icon
                height="24"
                icon="solar:alt-arrow-right-broken"
                width="24"
              />
              Waiting for Runner to Pickup
            </div>
            <Chip radius="sm" variant="flat">
              <TimeAgo date={new Date(execution.created_at)} />
            </Chip>
          </CardHeader>
        </Card>
      </div>
      <div className="mt-4 flex justify-center items-center w-full">
        {execution.running && (
          <>
            <Progress
              isIndeterminate
              aria-label="Loading..."
              className="max-w-md"
              label="Waiting for new data..."
              size="sm"
            />
          </>
        )}
      </div>
    </>
  );
}
