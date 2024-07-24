"use client";

import {
  Accordion,
  AccordionItem,
  Divider,
  Progress,
  Snippet,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import React from "react";

import Reloader from "@/components/reloader/Reloader";
import GetPayload from "@/lib/fetch/payload/payload";

import ExecutionBreadcrumbs from "./breadcrumbs";

export function Execution({ flow, execution, runners, settings }: any) {
  const [payload, setPayload] = React.useState({} as any);

  React.useEffect(() => {
    GetPayload(execution.payload_id).then((payload) => {
      setPayload(payload);
    });
  }, [execution]);

  return (
    <>
      <div className="grid lg:grid-cols-2 items-center justify-between">
        <ExecutionBreadcrumbs executionID={execution.id} flowID={flow.id} />
        <div className="lg:justify-self-end lg:mt-0 mt-2">
          <Reloader />
        </div>
      </div>
      <Divider className="mt-4 mb-4" />
      <Accordion variant="splitted">
        <AccordionItem
          key="1"
          aria-label="Incoming Payload"
          startContent={<Icon icon="solar:letter-opened-broken" width="24" />}
          subtitle={
            payload ? new Date(payload.created_at).toLocaleString() : "N/A"
          }
          title="Incoming Payload"
        >
          <Snippet fullWidth hideSymbol>
            {payload ? (
              <pre>{JSON.stringify(payload.payload, null, 2)}</pre>
            ) : (
              "No payload found"
            )}
          </Snippet>
        </AccordionItem>
        <AccordionItem
          key="2"
          aria-label="Execution Registered"
          startContent={<Icon icon="solar:cpu-bolt-broken" width="24" />}
          subtitle={new Date(execution.created_at).toLocaleString()}
          title="Execution Registered"
        >
          <Snippet fullWidth hideCopyButton hideSymbol>
            Execution got registered at API Backend
          </Snippet>
        </AccordionItem>
        <AccordionItem
          key="3"
          aria-label="Waiting for Runner to pick up"
          startContent={<Icon icon="solar:delivery-broken" width="24" />}
          title="Waiting for Runner to pick up"
        >
          {flow.runner_id != "any" ? (
            <Snippet fullWidth hideCopyButton hideSymbol>
              <div>
                Waiting for{" "}
                <span className="font-bold text-primary">
                  {
                    runners.find((runner: any) => runner.id === flow.runner_id)
                      ?.name
                  }
                </span>{" "}
                to pick up
              </div>
            </Snippet>
          ) : (
            <Snippet fullWidth hideCopyButton hideSymbol>
              Waiting for any available runner to pick up
            </Snippet>
          )}
        </AccordionItem>
      </Accordion>
      <div className="mt-4 flex justify-center items-center w-full">
        {(execution.running || execution.waiting || execution.paused) && (
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
