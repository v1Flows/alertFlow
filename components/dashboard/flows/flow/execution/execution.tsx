"use client";

import {
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
import React from "react";
import TimeAgo from "react-timeago";

import Reloader from "@/components/reloader/Reloader";
import GetPayload from "@/lib/fetch/payload/payload";
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

  function status(step: any) {
    if (step.error) {
      return "Error";
    } else if (step.paused) {
      return "Paused";
    } else if (step.no_result) {
      return "No Result";
    } else if (step.finished) {
      return "Finished";
    } else {
      return "Running";
    }
  }

  function statusIcon(step: any) {
    if (step.error) {
      return <CircularProgress color="danger" size="sm" value={100} />;
    } else if (step.paused) {
      return (
        <Tooltip content={`${status(step)}`}>
          <CircularProgress
            aria-label="Step"
            color="warning"
            maxValue={5}
            showValueLabel={true}
            size="md"
            value={5}
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
            maxValue={5}
            showValueLabel={true}
            size="md"
            value={5}
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
    } else if (step.finished) {
      return (
        <Tooltip content={`${status(step)}. Steps 5 / 5`}>
          <CircularProgress
            aria-label="Step"
            color="success"
            maxValue={5}
            showValueLabel={true}
            size="md"
            value={5}
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

  function getDuration(step: any) {
    if (step.finished_at === "0001-01-01T00:00:00Z") return "0s";
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

  const defaultSteps = [
    {
      id: 1,
      name: "Incoming Payload",
      icon: <Icon icon="solar:letter-opened-broken" width={24} />,
      data: payload
        ? JSON.stringify(payload.payload, null, 2)
        : "No data found",
      finished: true,
      started_at: payload ? payload.created_at : "0001-01-01T00:00:00Z",
      finished_at: payload ? payload.created_at : "0001-01-01T00:00:00Z",
    },
    {
      id: 2,
      name: "Execution Registered",
      icon: <Icon icon="solar:cpu-bolt-broken" width={24} />,
      data: ["Execution got registered at API Backend"],
      finished: true,
      started_at: execution.created_at,
      finished_at: execution.executed_at,
    },
    execution.runner_id === ""
      ? {
        id: 3,
        name: "Runner Pick Up",
        icon: <Icon icon="solar:rocket-2-broken" width={24} />,
        data: ["Waiting for Runner to pick up Execution"],
        finished: false,
        started_at: execution.created_at,
        finished_at: "0001-01-01T00:00:00Z",
      }
      : null,
    ...steps.map((step: any) => {
      return {
        ...step,
        icon: stepIcon(step),
        name: step.action_name,
        data: step.action_messages,
        started_at: step.started_at,
        finished_at: step.finished_at,
      };
    }),
  ];

  const renderCell = React.useCallback((step: any, columnKey: any) => {
    const cellValue = step[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <div className="flex flex-col items-center gap-2">
            {step.icon}
            <p className="text-md font-medium">{step.name}</p>
          </div>
        );
      case "data":
        return (
          <Snippet fullWidth hideSymbol>
            {step.name == "Incoming Payload" ? (
              <pre>{step.data}</pre>
            ) : (
              step.data.map((data: any, index: any) => (
                <p key={index}>&gt; {data}</p>
              ))
            )}
          </Snippet>
        );
      case "duration":
        return <p>{getDuration(step)}</p>;
      case "status":
        return <div>{statusIcon(step)}</div>;
      case "created":
        return <TimeAgo date={step.started_at} />;
      default:
        return cellValue;
    }
  }, []);

  return (
    <>
      <div className="grid lg:grid-cols-2 items-center justify-between">
        <ExecutionBreadcrumbs executionID={execution.id} flowID={flow.id} />
        <div className="lg:justify-self-end lg:mt-0 mt-2">
          <Reloader />
        </div>
      </div>
      <Divider className="mt-4 mb-4" />
      <ExecutionDetails execution={execution} runners={runners} steps={steps} />
      <Spacer y={4} />
      {/* Tabelle */}
      <Table isStriped aria-label="Example static collection table">
        <TableHeader>
          <TableColumn key="status" align="start">
            Status
          </TableColumn>
          <TableColumn key="name" align="center">
            Step
          </TableColumn>
          <TableColumn key="data" align="start">
            Data
          </TableColumn>
          <TableColumn key="duration" align="center">
            Duration
          </TableColumn>
          <TableColumn key="created" align="center">
            Created
          </TableColumn>
        </TableHeader>
        <TableBody items={defaultSteps}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
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
