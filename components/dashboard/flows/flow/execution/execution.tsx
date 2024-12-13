"use client";

import {
  Badge,
  Button,
  Chip,
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
  useDisclosure,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import Reloader from "@/components/reloader/Reloader";
import GetPayload from "@/lib/fetch/payload/payload";
import GetExecutionSteps from "@/lib/fetch/executions/steps";
import FunctionShowPayloadModal from "@/components/functions/flows/showPayload";
import InteractExecutionStep from "@/lib/fetch/executions/PUT/step_interact";

import ExecutionBreadcrumbs from "./breadcrumbs";
import ExecutionDetails from "./details";
import AdminExecutionActions from "./adminExecutionActions";
import AdminStepActions from "./adminStepActions";

export function Execution({ flow, execution, runners, userDetails }: any) {
  const router = useRouter();

  const [payload, setPayload] = useState({} as any);
  const [steps, setSteps] = useState([] as any);

  const showPayloadModal = useDisclosure();

  React.useEffect(() => {
    GetExecutionSteps(execution.id).then((steps) => {
      if (steps.success) {
        setSteps(steps.data.steps);
      } else {
        if ("error" in steps) {
          toast.error(steps.error);
        }
      }
    });
    GetPayload(execution.payload_id).then((payload) => {
      if (payload.success) {
        setPayload(payload.data.payload);
      } else {
        if ("error" in payload) {
          toast.error(payload.error);
        }
      }
    });
  }, [execution]);

  function status(step: any) {
    if (step.pending) {
      return "Pending";
    } else if (step.running) {
      return "Running";
    } else if (step.paused) {
      return "Paused";
    } else if (step.canceled) {
      return "Canceled";
    } else if (step.no_pattern_match) {
      return "No Pattern Match";
    } else if (step.no_result) {
      return "No Result";
    } else if (step.interactive) {
      return "Interactive";
    } else if (step.error) {
      return "Error";
    } else if (step.finished) {
      return "Finished";
    } else {
      return "N/A";
    }
  }

  function statusColor(step: any) {
    if (step.pending) {
      return "default";
    } else if (step.running) {
      return "primary";
    } else if (step.paused) {
      return "warning";
    } else if (step.canceled) {
      return "danger";
    } else if (step.no_pattern_match) {
      return "secondary";
    } else if (step.no_result) {
      return "default";
    } else if (step.interactive) {
      return "primary";
    } else if (execution.error) {
      return "danger";
    } else if (execution.finished) {
      return "success";
    } else {
      return "default";
    }
  }

  function statusIcon(step: any) {
    if (step.pending) {
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
                icon="solar:sleeping-square-linear"
                width={20}
              />
            }
          />
        </Tooltip>
      );
    } else if (step.running) {
      return (
        <Tooltip content={`${status(step)}`}>
          <CircularProgress aria-label="Step" color="primary" size="md" />
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
    } else if (step.canceled) {
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
                icon="solar:forbidden-linear"
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
    } else if (step.interactive) {
      return (
        <Tooltip content={`${status(step)}`}>
          <CircularProgress
            aria-label="Step"
            color="primary"
            showValueLabel={true}
            size="md"
            value={100}
            valueLabel={
              <Icon
                className="text-primary"
                icon="solar:hand-shake-linear"
                width={22}
              />
            }
          />
        </Tooltip>
      );
    } else if (step.error) {
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
          <CircularProgress
            aria-label="Step"
            color="success"
            showValueLabel={true}
            size="md"
            value={100}
            valueLabel={
              <Icon
                className="text-success"
                icon="solar:question-square-linear"
                width={22}
              />
            }
          />
        </Tooltip>
      );
    }
  }

  function getTotalDurationSeconds() {
    var calFinished = new Date().toISOString();

    if (execution.finished_at !== "0001-01-01T00:00:00Z") {
      calFinished = execution.finished_at;
    }
    const ms =
      new Date(calFinished).getTime() -
      new Date(execution.executed_at).getTime();
    const sec = Math.floor(ms / 1000);

    return sec;
  }

  function getDurationSeconds(step: any) {
    if (step.pending) {
      return 0;
    }
    if (step.finished_at === "0001-01-01T00:00:00Z") {
      step.finished_at = new Date().toISOString();
    }
    const ms =
      new Date(step.finished_at).getTime() -
      new Date(step.started_at).getTime();
    const sec = Math.floor(ms / 1000);

    return sec;
  }

  function getDuration(step: any) {
    if (step.pending) {
      return "-";
    }
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

  async function interactStep(step: any, status: boolean) {
    if (status) {
      step.interaction_approved = true;
      step.interaction_rejected = false;
    } else {
      step.interaction_approved = false;
      step.interaction_rejected = true;
    }

    step.interacted = true;
    step.action_messages = [
      `Step interacted by ${userDetails.username} (${userDetails.id})`,
    ];
    step.interaced_by = userDetails.id;
    step.interacted_at = new Date().toISOString();
    const res = (await InteractExecutionStep(
      execution.id,
      step.id,
      step,
    )) as any;

    if (!res.success) {
      toast.error(res.error);
    } else {
      toast.success("Step interaction successful");
      router.refresh();
    }
  }

  const renderCell = React.useCallback(
    (step: any, columnKey: any) => {
      const cellValue = step[columnKey];

      switch (columnKey) {
        case "name":
          return (
            <div className={`flex flex-col items-center gap-2`}>
              {steps.find((s: any) => s.parent_id === step.action_name) ? (
                <Badge
                  color="primary"
                  content={
                    <Icon
                      icon="solar:double-alt-arrow-down-linear"
                      width={18}
                    />
                  }
                  placement="bottom-right"
                  shape="circle"
                  size="md"
                >
                  <Button
                    isIconOnly
                    variant="light"
                    onPress={() => {
                      // set is_hidden to false for all child steps
                      const newSteps = steps.map((s: any) => {
                        if (s.parent_id === step.action_name) {
                          s.is_hidden = !s.is_hidden;
                        }

                        return s;
                      });

                      setSteps([...newSteps]);
                    }}
                  >
                    <Icon
                      icon={`${step.icon || "solar:question-square-line-duotone"}`}
                      width={24}
                    />
                  </Button>
                </Badge>
              ) : step.parent_id !== "" ? (
                <Badge
                  color="primary"
                  content=""
                  placement="bottom-right"
                  shape="circle"
                >
                  <Icon
                    icon={`${step.icon || "solar:question-square-line-duotone"}`}
                    width={24}
                  />
                </Badge>
              ) : (
                <Icon
                  icon={`${step.icon || "solar:question-square-line-duotone"}`}
                  width={24}
                />
              )}
              <p className="text-md font-medium">
                {flow.actions.find((a: any) => a.id === step.action_id)
                  ?.custom_name
                  ? flow.actions.find((a: any) => a.id === step.action_id)
                      .custom_name
                  : step.action_name}
              </p>
            </div>
          );
        case "data":
          return (
            <>
              {step.pending ? (
                <p>Step not started yet</p>
              ) : (
                <div className="flex flex-col gap-2">
                  <Snippet fullWidth hideCopyButton hideSymbol radius="sm">
                    {step.action_messages.map((data: any, index: any) => (
                      <p
                        key={index}
                        className="flex flex-cols items-center gap-1"
                      >
                        <Icon
                          icon="solar:double-alt-arrow-right-bold-duotone"
                          width={16}
                        />
                        {data}
                      </p>
                    ))}
                  </Snippet>
                  {step.interactive && !step.interacted && (
                    <div className="flex flex-cols items-center gap-4">
                      <Button
                        fullWidth
                        color="success"
                        startContent={
                          <Icon icon="solar:verified-check-linear" width={18} />
                        }
                        variant="flat"
                        onPress={() => {
                          interactStep(step, true);
                        }}
                      >
                        Approve & Continue
                      </Button>
                      <Button
                        fullWidth
                        color="danger"
                        startContent={
                          <Icon icon="solar:forbidden-outline" width={18} />
                        }
                        variant="flat"
                        onPress={() => {
                          interactStep(step, false);
                        }}
                      >
                        Reject & Stop
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </>
          );
        case "duration":
          return (
            <div className="flex flex-col items-center justify-center">
              <Tooltip
                content={
                  <div className="grid grid-cols-2 p-1">
                    <div className="text-small text-default-500">
                      Created at
                    </div>
                    <div className="text-small">
                      {new Date(step.created_at).toLocaleString()}
                    </div>
                    {step.started_at !== "0001-01-01T00:00:00Z" && (
                      <>
                        <Divider className="col-span-2 mt-2 mb-2" />
                        <div className="text-small text-default-500">
                          Started at
                        </div>
                        <div className="text-small">
                          {new Date(step.started_at).toLocaleString()}
                        </div>
                      </>
                    )}
                    {step.finished_at !== "0001-01-01T00:00:00Z" && (
                      <>
                        <Divider className="col-span-2 mt-2 mb-2" />
                        <div className="text-small text-default-500">
                          Finished at
                        </div>
                        <div className="text-small">
                          {new Date(step.finished_at).toLocaleString()}
                        </div>
                      </>
                    )}
                  </div>
                }
              >
                <div className="flex flex-col items-center gap-1">
                  <CircularProgress
                    aria-label="StepDuration"
                    maxValue={getTotalDurationSeconds()}
                    showValueLabel={true}
                    size="lg"
                    value={getDurationSeconds(step)}
                  />
                  <p className="text-xs">{getDuration(step)}</p>
                </div>
              </Tooltip>
            </div>
          );
        case "info":
          return (
            <Tooltip
              content={
                <div className="flex flex-col items-start justify-between p-1">
                  <div className="flex flex-cols gap-4">
                    <div className="flex items-center gap-2">
                      <div className="flex bg-default/30 text-foreground items-center rounded-small justify-center w-10 h-10">
                        <Icon icon={step.icon} width={20} />
                      </div>
                      <div>
                        <p className="font-bold">{step.action_name}</p>
                        <p className="text-sm text-default-500">
                          {step.action_id || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start justify-self-end">
                      <Chip
                        color={statusColor(step)}
                        radius="sm"
                        size="sm"
                        variant="flat"
                      >
                        {status(step)}
                      </Chip>
                    </div>
                  </div>
                  <Divider className="m-2" />
                  <div className="flex flex-wrap gap-2">
                    <Chip color="primary" radius="sm" size="sm" variant="flat">
                      Runner:{" "}
                      {runners.find((r: any) => r.id === step.runner_id)
                        ?.name || "N/A"}
                    </Chip>
                    <Chip radius="sm" size="sm" variant="flat">
                      Step ID: {step.id}
                    </Chip>
                  </div>
                </div>
              }
            >
              <Icon
                className="text-default-500"
                icon="solar:info-circle-linear"
                width={20}
              />
            </Tooltip>
          );
        case "status":
          return <div>{statusIcon(step)}</div>;
        case "admin_actions":
          return (
            <div className="flex flex-col justify-center items-center">
              {userDetails.role === "admin" && (
                <AdminStepActions execution={execution} step={step} />
              )}
            </div>
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
        {(execution.running || execution.pending || execution.paused) && (
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
        <ExecutionBreadcrumbs executionID={execution.id} flowID={flow.id} />
        <div className="flex flex-cols items-center lg:justify-end justify-center mt-2 lg:mt-0 gap-4">
          <Button
            color="secondary"
            variant="flat"
            onPress={() => showPayloadModal.onOpen()}
          >
            <Icon icon="solar:letter-opened-broken" width={20} />
            Show Payload
          </Button>
          {userDetails.role === "admin" && (
            <AdminExecutionActions execution={execution} />
          )}

          {execution.running ||
          execution.pending ||
          execution.paused ||
          execution.interaction_required ? (
            <div>
              <Reloader />
            </div>
          ) : null}
        </div>
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
          <TableColumn key="data" align="center">
            Data
          </TableColumn>
          <TableColumn key="duration" align="center">
            Duration
          </TableColumn>
          <TableColumn key="info" align="center">
            Info
          </TableColumn>
          <TableColumn
            key="admin_actions"
            align="center"
            hideHeader={userDetails.role !== "admin"}
          >
            Admin Actions
          </TableColumn>
        </TableHeader>
        <TableBody items={steps.filter((s: any) => s.is_hidden == false)}>
          {(item: any) =>
            !item.pending ? (
              <TableRow
                key={item.id}
                className={item.parent_id !== "" ? "bg-default-100" : ""}
              >
                {(columnKey: any) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            ) : (
              <TableRow key={item.id} className="text-default-400">
                {(columnKey: any) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )
          }
        </TableBody>
      </Table>
      <Spacer y={4} />
      <FunctionShowPayloadModal
        disclosure={showPayloadModal}
        payload={payload}
      />
    </>
  );
}
