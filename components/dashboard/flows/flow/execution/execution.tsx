"use client";

import {
  Badge,
  Button,
  CircularProgress,
  Divider,
  Progress,
  Snippet,
  Spacer,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import React, { useMemo, useState } from "react";
import TimeAgo from "react-timeago";

import Reloader from "@/components/reloader/Reloader";
import GetPayload from "@/lib/fetch/payload/payload";
import GetExecutionSteps from "@/lib/fetch/executions/steps";

import ExecutionBreadcrumbs from "./breadcrumbs";
import ExecutionDetails from "./details";

export function Execution({ flow, execution, runners }: any) {
  const [payload, setPayload] = useState({} as any);
  const [steps, setSteps] = useState([] as any);

  const defaultSteps = [
    {
      id: 2,
      action_name: "Execution Registered",
      action_messages: ["Execution got registered at API Backend"],
      finished: true,
      started_at: execution.created_at,
      finished_at: execution.created_at,
      parent_id: "",
      is_hidden: false,
      icon: "solar:cpu-bolt-broken",
    },
    execution.runner_id === "" && {
      id: 3,
      action_name: "Runner Pick Up",
      action_messages: ["Waiting for Runner to pick up Execution"],
      finished: false,
      started_at: execution.created_at,
      finished_at: "0001-01-01T00:00:00Z",
      parent_id: "",
      is_hidden: false,
      icon: "solar:rocket-2-bold-duotone",
    },
  ];

  React.useEffect(() => {
    GetExecutionSteps(execution.id).then((incSteps) => {
      setSteps([...defaultSteps, ...incSteps]);
    });
    GetPayload(execution.payload_id).then((payload) => {
      setPayload(payload);
    });
  }, [execution]);

  function status(step: any) {
    if (step.error) {
      return "Error";
    } else if (step.paused) {
      return "Paused";
    } else if (step.no_result) {
      return "No Result";
    } else if (step.no_pattern_match) {
      return "No Pattern Match";
    } else if (step.finished) {
      return "Finished";
    } else {
      return "Running";
    }
  }

  function statusIcon(step: any) {
    if (step.error) {
      return (
        <Tooltip content={`${status(step)}`}>
          <CircularProgress
            aria-label="Step"
            color="danger"
            showValueLabel={true}
            size="md"
            value={100}
            valueLabel={
              <Icon
                className="text-danger"
                icon="solar:danger-triangle-broken"
                width={20}
              />
            }
          />
        </Tooltip>
      );
    } else if (step.paused) {
      return (
        <Tooltip content={`${status(step)}`}>
          <CircularProgress
            aria-label="Step"
            color="warning"
            showValueLabel={true}
            size="md"
            value={100}
            valueLabel={
              <Icon
                className="text-warning"
                icon="solar:pause-broken"
                width={16}
              />
            }
          />
        </Tooltip>
      );
    } else if (step.no_result) {
      return (
        <Tooltip content={`${status(step)}`}>
          <CircularProgress
            aria-label="Step"
            color="default"
            showValueLabel={true}
            size="md"
            value={100}
            valueLabel={
              <Icon
                className="text-default-500"
                icon="solar:ghost-broken"
                width={20}
              />
            }
          />
        </Tooltip>
      );
    } else if (step.no_pattern_match) {
      return (
        <Tooltip content={`${status(step)}`}>
          <CircularProgress
            color="secondary"
            showValueLabel={true}
            size="md"
            value={100}
            valueLabel={
              <Icon
                className="text-secondary"
                icon="solar:bill-cross-broken"
                width={20}
              />
            }
          />
        </Tooltip>
      );
    } else if (step.finished) {
      return (
        <Tooltip content={`${status(step)}`}>
          <CircularProgress
            aria-label="Step"
            color="success"
            showValueLabel={true}
            size="md"
            value={100}
            valueLabel={
              <Icon
                className="text-success"
                icon="solar:check-read-broken"
                width={22}
              />
            }
          />
        </Tooltip>
      );
    } else {
      return (
        <Tooltip content={`${status(step)}`}>
          <CircularProgress aria-label="Step" color="primary" size="md" />
        </Tooltip>
      );
    }
  }

  function getDuration(step: any) {
    if (step.finished_at === "0001-01-01T00:00:00Z") {
      step.finished_at = new Date().toISOString();
    }
    const ms =
      new Date(step.finished_at).getTime() -
      new Date(step.started_at).getTime();
    const sec = Math.floor(ms / 1000);
    const min = Math.floor(sec / 60);
    const hr = Math.floor(min / 60);
    const day = Math.floor(hr / 24);

    if (day > 0) {
      return `${day}d ${hr % 24}h ${min % 60}m ${sec % 60}s`;
    } else if (hr > 0) {
      return `${hr}h ${min % 60}m ${sec % 60}s`;
    } else if (min > 0) {
      return `${min}m ${sec % 60}s`;
    } else {
      return `${sec}s`;
    }
  }

  const renderCell = React.useCallback(
    (step: any, columnKey: any) => {
      const cellValue = step[columnKey];

      switch (columnKey) {
        case "name":
          return (
            <div
              className={`flex flex-col items-center gap-2 ${step.parent_id !== "" && "text-default-500"}`}
            >
              <Icon
                icon={`${step.icon || "solar:question-square-line-duotone"}`}
                width={24}
              />
              <p className="text-md font-medium">{step.action_name}</p>
            </div>
          );
        case "child_steps":
          return (
            <>
              {steps.find((s: any) => s.parent_id === step.id) && (
                <Tooltip content="Show Child Steps">
                  <Button
                    isIconOnly
                    color="secondary"
                    size="sm"
                    variant="light"
                    onPress={() => {
                      // set is_hidden to false for all child steps
                      const newSteps = steps.map((s: any) => {
                        if (s.parent_id === step.id) {
                          s.is_hidden = !s.is_hidden;
                        }

                        return s;
                      });

                      setSteps([...newSteps]);
                    }}
                  >
                    <Icon
                      icon="solar:branching-paths-down-line-duotone"
                      width={28}
                    />
                  </Button>
                </Tooltip>
              )}
            </>
          );
        case "data":
          return (
            <div className="flex flex-col gap-2">
              <Snippet
                fullWidth
                hideCopyButton
                hideSymbol
                className={`${step.parent_id !== "" && "text-default-500"}`}
                radius="sm"
              >
                {step.action_messages.map((data: any, index: any) => (
                  <p key={index} className="flex flex-cols items-center gap-1">
                    <Icon
                      icon="solar:double-alt-arrow-right-bold-duotone"
                      width={16}
                    />
                    {data}
                  </p>
                ))}
              </Snippet>
            </div>
          );
        case "duration":
          return (
            <p className={`${step.parent_id !== "" && "text-default-500"}`}>
              {getDuration(step)}
            </p>
          );
        case "status":
          return <div>{statusIcon(step)}</div>;
        case "created":
          return (
            <TimeAgo
              live
              className={`${step.parent_id !== "" && "text-default-500"}`}
              date={step.started_at}
            />
          );
        default:
          return cellValue;
      }
    },
    [steps],
  );

  const bottomContent = useMemo(() => {
    return (
      <div className="mt flex justify-center items-center w-full">
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
    );
  }, [execution]);

  return (
    <>
      <div className="grid lg:grid-cols-2 items-center justify-between">
        <ExecutionBreadcrumbs
          executionID={execution.id}
          flowID={flow.flow.id}
        />
        {execution.running || execution.waiting || execution.paused ? (
          <div className="lg:justify-self-end lg:mt-0 mt-2">
            <Reloader />
          </div>
        ) : null}
      </div>
      <Divider className="mt-4 mb-4" />
      <ExecutionDetails execution={execution} runners={runners} steps={steps} />
      <Spacer y={4} />
      {/* Tabelle */}
      <Table
        aria-label="Example static collection table"
        bottomContent={bottomContent}
      >
        <TableHeader>
          <TableColumn key="status" align="start">
            Status
          </TableColumn>
          <TableColumn key="name" align="center">
            Step
          </TableColumn>
          <TableColumn key="child_steps" align="center">
            Child Steps
          </TableColumn>
          <TableColumn key="data" align="center">
            Data
          </TableColumn>
          <TableColumn key="duration" align="center">
            Duration
          </TableColumn>
          <TableColumn key="created" align="center">
            Created
          </TableColumn>
        </TableHeader>
        <TableBody items={steps.filter((s: any) => s.is_hidden == false)}>
          {(item: any) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Spacer y={4} />
    </>
  );
}
