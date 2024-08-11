"use client";

import {
  Accordion,
  AccordionItem,
  Code,
  Divider,
  Progress,
  Snippet,
  Spacer,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import React from "react";
import TimeAgo from "react-timeago";
import ReactTimeago from "react-timeago";

import Reloader from "@/components/reloader/Reloader";
import GetPayload from "@/lib/fetch/payload/payload";
import { IconWrapper } from "@/lib/IconWrapper";
import GetExecutionSteps from "@/lib/fetch/executions/steps";

import ExecutionBreadcrumbs from "./breadcrumbs";
import ExecutionDetails from "./details";

export function Execution({ flow, execution, runners }: any) {
  const [payload, setPayload] = React.useState({} as any);
  const [steps, setSteps] = React.useState([] as any);

  React.useEffect(() => {
    GetPayload(execution.payload_id).then((payload) => {
      setPayload(payload);
    });
    GetExecutionSteps(execution.id).then((steps) => {
      setSteps(steps);
    });
  }, [execution]);

  function stepIcon(step: any) {
    if (step.error) {
      return <Icon icon="solar:bill-list-broken" width={24} />;
    } else if (step.paused) {
      return <Icon icon="solar:stopwatch-pause-broken" width={24} />;
    } else if (step.finished) {
      return <Icon icon="solar:bill-check-broken" width={24} />;
    } else {
      return <Icon icon="solar:bill-list-broken" width={24} />;
    }
  }

  function stepColor(step: any) {
    if (step.error) {
      return "danger";
    } else if (step.paused) {
      return "warning";
    } else if (step.finished) {
      return "success";
    } else {
      return "primary";
    }
  }

  return (
    <>
      <div className="grid lg:grid-cols-2 items-center justify-between">
        <ExecutionBreadcrumbs executionID={execution.id} flowID={flow.id} />
        <div className="lg:justify-self-end lg:mt-0 mt-2">
          <Reloader />
        </div>
      </div>
      <Divider className="mt-4 mb-4" />
      <ExecutionDetails execution={execution} steps={steps} />
      <Spacer y={4} />
      <Accordion variant="splitted">
        {payload && (
          <AccordionItem
            key="1"
            aria-label="Incoming Payload"
            startContent={
              <IconWrapper className="bg-success/10 text-success">
                <Icon icon="solar:letter-opened-broken" width={24} />
              </IconWrapper>
            }
            subtitle={<ReactTimeago date={payload.created_at} />}
            title="Incoming Payload"
          >
            <Snippet fullWidth hideSymbol>
              <pre>{JSON.stringify(payload.payload, null, 2)}</pre>
            </Snippet>
          </AccordionItem>
        )}
        <AccordionItem
          key="2"
          aria-label="Execution Registered"
          startContent={
            <IconWrapper className="bg-success/10 text-success">
              <Icon icon="solar:cpu-bolt-broken" width={24} />
            </IconWrapper>
          }
          subtitle={<TimeAgo date={execution.created_at} />}
          title="Execution Registered"
        >
          <Code className="w-full">
            Execution got registered at API Backend
          </Code>
        </AccordionItem>
        <AccordionItem
          key="3"
          aria-label="Waiting for Runner to pick up"
          startContent={
            <IconWrapper className="bg-warning/10 text-warning">
              <Icon icon="solar:delivery-broken" width={24} />
            </IconWrapper>
          }
          title="Waiting for Runner to pick execution up"
        >
          {flow.runner_id != "any" ? (
            <Code className="w-full">
              <div>
                Waiting for{" "}
                <span className="font-bold text-primary">
                  {
                    runners.find((runner: any) => runner.id === flow.runner_id)
                      ?.name
                  }
                </span>{" "}
                to pick execution up
              </div>
            </Code>
          ) : (
            <Snippet fullWidth hideCopyButton hideSymbol>
              Waiting for any available runner to pick up
            </Snippet>
          )}
        </AccordionItem>
        {execution.runner_id != "" && (
          <AccordionItem
            key="4"
            aria-label="Runner picked up"
            startContent={
              <IconWrapper className="bg-primary/10 text-primary">
                <Icon icon="solar:delivery-broken" width={24} />
              </IconWrapper>
            }
            subtitle={<TimeAgo date={execution.executed_at} />}
            title="Runner picked execution up"
          >
            <Code className="w-full">
              <div>
                Runner{" "}
                <span className="font-bold text-primary">
                  {
                    runners.find(
                      (runner: any) => runner.id === execution.runner_id,
                    )?.name
                  }
                </span>{" "}
                picked execution up
              </div>
            </Code>
          </AccordionItem>
        )}
        {steps.map((step: any) => (
          <AccordionItem
            key={step.id}
            aria-label="Execution Step"
            startContent={
              <IconWrapper
                className={`bg-${stepColor(step)}/10 text-${stepColor(step)}`}
              >
                {stepIcon(step)}
              </IconWrapper>
            }
            subtitle={<TimeAgo date={step.started_at} />}
            title={step.action_name}
          >
            <Code className="w-full">{step.action_message}</Code>
          </AccordionItem>
        ))}
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
