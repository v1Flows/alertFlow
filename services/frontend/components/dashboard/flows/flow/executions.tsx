"use client";

import { Icon } from "@iconify/react";
import {
  Button,
  Card,
  CardBody,
  CircularProgress,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Pagination,
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
} from "@heroui/react";
import NumberFlow from "@number-flow/react";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import TimeAgo from "react-timeago";

import FunctionShowPayloadModal from "@/components/functions/flows/showPayload";
import DeleteExecutionModal from "@/components/functions/flows/deleteExecution";

export default function Executions({
  executions,
  payloads,
  displayToFlow,
  canEdit,
}: any) {
  const router = useRouter();

  const showPayloadModal = useDisclosure();
  const deleteExecutionModal = useDisclosure();

  const [targetPayload, setTargetPayload] = useState({} as any);
  const [targetExecution, setTargetExecution] = useState({} as any);

  const [statusFilter, setStatusFilter] = useState(new Set([]) as any);

  // pagination
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    if (statusFilter.size > 0) {
      return executions
        .filter((execution: any) =>
          statusFilter.has(statusFilterReturn(execution)),
        )
        .slice(start, end);
    }

    return executions.slice(start, end);
  }, [page, executions, statusFilter]);

  function pages() {
    let length = 0;

    if (statusFilter.size > 0) {
      length =
        executions.filter((execution: any) =>
          statusFilter.has(statusFilterReturn(execution)),
        ).length / rowsPerPage;
    } else {
      length = executions.length / rowsPerPage;
    }

    return Math.ceil(length);
  }

  function status(execution: any) {
    if (execution.status === "pending") {
      return "Pending";
    } else if (execution.status === "running") {
      return "Running";
    } else if (execution.status === "paused") {
      return "Paused";
    } else if (execution.status === "canceled") {
      return "Canceled";
    } else if (execution.status === "noPatternMatch") {
      return "No Pattern Match";
    } else if (execution.status === "interactionRequired") {
      return "Interaction Required";
    } else if (execution.status === "error") {
      return "Error";
    } else if (execution.status === "success") {
      return "Success";
    } else {
      return "Unknown";
    }
  }

  function statusFilterReturn(execution: any) {
    if (execution.status === "pending") {
      return "pending";
    } else if (execution.status === "running") {
      return "running";
    } else if (execution.status === "paused") {
      return "paused";
    } else if (execution.status === "canceled") {
      return "canceled";
    } else if (execution.status === "noPatternMatch") {
      return "no_pattern_match";
    } else if (execution.status === "interactionRequired") {
      return "interaction_required";
    } else if (execution.status === "error") {
      return "error";
    } else if (execution.status === "success") {
      return "success";
    } else {
      return "unknown";
    }
  }

  function statusIcon(execution: any) {
    if (execution.status === "pending") {
      return (
        <Tooltip content={`${status(execution)}`}>
          <CircularProgress
            showValueLabel
            aria-label="Step"
            color="default"
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
    } else if (execution.status === "running") {
      return (
        <Tooltip content={`${status(execution)}`}>
          <CircularProgress aria-label="Step" color="primary" size="md" />
        </Tooltip>
      );
    } else if (execution.status === "paused") {
      return (
        <Tooltip content={`${status(execution)}`}>
          <CircularProgress
            showValueLabel
            aria-label="Step"
            color="warning"
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
    } else if (execution.status === "canceled") {
      return (
        <Tooltip content={`${status(execution)}`}>
          <CircularProgress
            showValueLabel
            aria-label="Step"
            color="danger"
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
    } else if (execution.status === "noPatternMatch") {
      return (
        <Tooltip content={`${status(execution)}`}>
          <CircularProgress
            showValueLabel
            color="secondary"
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
    } else if (execution.status === "interactionRequired") {
      return (
        <Tooltip content={`${status(execution)}`}>
          <CircularProgress
            showValueLabel
            aria-label="Step"
            color="primary"
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
    } else if (execution.status === "error") {
      return (
        <Tooltip content={`${status(execution)}`}>
          <CircularProgress
            showValueLabel
            aria-label="Step"
            color="danger"
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
    } else if (execution.status === "success") {
      return (
        <Tooltip content={`${status(execution)}`}>
          <CircularProgress
            showValueLabel
            aria-label="Step"
            color="success"
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
        <Tooltip content={`${status(execution)}`}>
          <CircularProgress
            showValueLabel
            aria-label="Step"
            color="success"
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

  function getDuration(execution: any) {
    if (execution.finished_at === "0001-01-01T00:00:00Z") {
      return "0s";
    }
    const ms =
      new Date(execution.finished_at).getTime() -
      new Date(execution.executed_at).getTime();
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

  const renderCell = React.useCallback((execution: any, columnKey: any) => {
    const cellValue = execution[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <div className="flex flex-col items-center gap-2">
            {execution.icon}
            <p className="text-md font-medium">{execution.name}</p>
          </div>
        );
      case "trigger":
        return (
          <Button
            isDisabled={
              !payloads.find((p: any) => p.id === execution.payload_id)
            }
            variant="light"
            onPress={() => {
              setTargetPayload(
                payloads.find((p: any) => p.id === execution.payload_id),
              );
              showPayloadModal.onOpen();
            }}
          >
            Show Payload
          </Button>
        );
      case "data":
        return (
          <Snippet fullWidth hideSymbol>
            <pre>{JSON.stringify(execution.data, null, 2)}</pre>
          </Snippet>
        );
      case "duration":
        return <p>{getDuration(execution)}</p>;
      case "status":
        return <div>{statusIcon(execution)}</div>;
      case "created":
        return (
          <>
            <Tooltip
              content={
                <div className="px-1 py-2">
                  <div className="text-small font-bold">Created at</div>
                  <div className="text-tiny">
                    {new Date(execution.created_at).toLocaleString()}
                  </div>
                </div>
              }
            >
              <p>
                <TimeAgo date={execution.created_at} title="" />
              </p>
            </Tooltip>
          </>
        );
      case "actions":
        return (
          <div className="flex items-center justify-end gap-2">
            {displayToFlow && (
              <Button
                color="primary"
                size="md"
                variant="bordered"
                onPress={() => router.push(`/flows/${execution.flow_id}/`)}
              >
                View Flow
              </Button>
            )}
            <Button
              color="primary"
              size="md"
              startContent={<Icon icon="solar:eye-outline" width={18} />}
              variant="solid"
              onPress={() =>
                router.push(
                  `/flows/${execution.flow_id}/execution/${execution.id}`,
                )
              }
            >
              View
            </Button>
            <Button
              isIconOnly
              color="danger"
              isDisabled={!canEdit}
              size="md"
              variant="flat"
              onPress={() => {
                setTargetExecution(execution);
                deleteExecutionModal.onOpen();
              }}
            >
              <Icon
                height="20"
                icon="solar:trash-bin-trash-outline"
                width="20"
              />
            </Button>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-3">
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger>
                <Button
                  color={statusFilter.size > 0 ? "primary" : "default"}
                  endContent={
                    <Icon icon="solar:alt-arrow-down-line-duotone" width={18} />
                  }
                  variant="flat"
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                variant="flat"
                onSelectionChange={(keys) => {
                  setStatusFilter(keys);
                  setPage(1);
                }}
              >
                <DropdownItem key="pending" className="capitalize">
                  <div className="flex-cols flex gap-2">
                    <Icon
                      className="text-default-500"
                      icon="solar:sleeping-square-linear"
                      width={18}
                    />
                    Pending
                  </div>
                </DropdownItem>
                <DropdownItem key="running" className="capitalize">
                  <div className="flex-cols flex gap-2">
                    <Icon
                      className="text-primary"
                      icon="solar:play-bold-duotone"
                      width={18}
                    />
                    Running
                  </div>
                </DropdownItem>
                <DropdownItem key="paused" className="capitalize">
                  <div className="flex-cols flex gap-2">
                    <Icon
                      className="text-warning"
                      icon="solar:pause-outline"
                      width={18}
                    />
                    Paused
                  </div>
                </DropdownItem>
                <DropdownItem key="canceled" className="capitalize">
                  <div className="flex-cols flex gap-2">
                    <Icon
                      className="text-danger"
                      icon="solar:forbidden-linear"
                      width={18}
                    />
                    Canceled
                  </div>
                </DropdownItem>
                <DropdownItem key="no_pattern_match" className="capitalize">
                  <div className="flex-cols flex gap-2">
                    <Icon
                      className="text-secondary"
                      icon="solar:bill-cross-outline"
                      width={18}
                    />
                    No Pattern Match
                  </div>
                </DropdownItem>
                <DropdownItem key="interaction_required" className="capitalize">
                  <div className="flex-cols flex gap-2">
                    <Icon
                      className="text-primary"
                      icon="solar:hand-shake-linear"
                      width={18}
                    />
                    Interaction Required
                  </div>
                </DropdownItem>
                <DropdownItem key="error" className="capitalize">
                  <div className="flex-cols flex gap-2">
                    <Icon
                      className="text-danger"
                      icon="solar:danger-triangle-outline"
                      width={18}
                    />
                    Error
                  </div>
                </DropdownItem>
                <DropdownItem key="success" className="capitalize">
                  <div className="flex-cols flex gap-2">
                    <Icon
                      className="text-success"
                      icon="solar:check-read-outline"
                      width={18}
                    />
                    Success
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Button
              variant="flat"
              onPress={() => {
                setStatusFilter(new Set([]));
                setPage(1);
              }}
            >
              Reset Filter
            </Button>
          </div>
        </div>
      </div>
    );
  }, [items, executions, statusFilter]);

  const bottomContent = useMemo(() => {
    return (
      <div className="flex justify-center">
        <Pagination
          showControls
          isDisabled={items.length === 0}
          page={page}
          total={pages()}
          onChange={(page) => setPage(page)}
        />
      </div>
    );
  }, [items, statusFilter]);

  return (
    <>
      <div className="flex flex-wrap items-stretch gap-4">
        {executions.filter((e: any) => status(e) == "Pending").length > 0 && (
          <Card
            isHoverable
            isPressable
            className={
              statusFilter.has("pending")
                ? "w-[240px] grow bg-default/50"
                : "w-[240px] grow"
            }
            onPress={() => {
              setStatusFilter(new Set(["pending"]));
              setPage(1);
            }}
          >
            <CardBody>
              <div className="flex items-center gap-2">
                <div className="flex size-10 items-center justify-center rounded-small bg-default/30 text-default-500">
                  <Icon icon="solar:sleeping-square-linear" width={20} />
                </div>
                <div>
                  <p className="text-md font-bold">
                    <NumberFlow
                      locales="en-US" // Intl.NumberFormat locales
                      value={
                        executions.filter((e: any) => status(e) == "Pending")
                          .length
                      }
                    />
                  </p>
                  <p className="text-sm text-default-500">Pending</p>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {executions.filter((e: any) => status(e) == "Success").length > 0 && (
          <Card
            isHoverable
            isPressable
            className={
              statusFilter.has("success")
                ? "w-[240px] grow bg-success/30"
                : "w-[240px] grow"
            }
            onPress={() => {
              setStatusFilter(new Set(["success"]));
              setPage(1);
            }}
          >
            <CardBody>
              <div className="flex items-center gap-2">
                <div className="flex size-10 items-center justify-center rounded-small bg-success/10 text-success">
                  <Icon icon="solar:check-read-outline" width={20} />
                </div>
                <div>
                  <p className="text-md font-bold">
                    <NumberFlow
                      locales="en-US" // Intl.NumberFormat locales
                      value={
                        executions.filter((e: any) => status(e) == "Success")
                          .length
                      }
                    />
                  </p>
                  <p className="text-sm text-default-500">Success</p>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {executions.filter((e: any) => status(e) == "Running").length > 0 && (
          <Card
            isHoverable
            isPressable
            className={
              statusFilter.has("running")
                ? "w-[240px] grow bg-primary/30"
                : "w-[240px] grow"
            }
            onPress={() => {
              setStatusFilter(new Set(["running"]));
              setPage(1);
            }}
          >
            <CardBody>
              <div className="flex items-center gap-2">
                <div className="flex size-10 items-center justify-center rounded-small bg-primary/10 text-primary">
                  <Icon icon="solar:play-bold-duotone" width={20} />
                </div>
                <div>
                  <p className="text-md font-bold">
                    <NumberFlow
                      locales="en-US" // Intl.NumberFormat locales
                      value={
                        executions.filter((e: any) => status(e) == "Running")
                          .length
                      }
                    />
                  </p>
                  <p className="text-sm text-default-500">Running</p>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {executions.filter((e: any) => status(e) == "Paused").length > 0 && (
          <Card
            isHoverable
            isPressable
            className={
              statusFilter.has("paused")
                ? "w-[240px] grow bg-warning/30"
                : "w-[240px] grow"
            }
            onPress={() => {
              setStatusFilter(new Set(["paused"]));
              setPage(1);
            }}
          >
            <CardBody>
              <div className="flex items-center gap-2">
                <div className="flex size-10 items-center justify-center rounded-small bg-warning/10 text-warning">
                  <Icon icon="solar:pause-outline" width={20} />
                </div>
                <div>
                  <p className="text-md font-bold">
                    <NumberFlow
                      locales="en-US" // Intl.NumberFormat locales
                      value={
                        executions.filter((e: any) => status(e) == "Paused")
                          .length
                      }
                    />
                  </p>
                  <p className="text-sm text-default-500">Paused</p>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {executions.filter((e: any) => status(e) == "Interaction Required")
          .length > 0 && (
          <Card
            isHoverable
            isPressable
            className={
              statusFilter.has("interaction_required")
                ? "w-[240px] grow bg-primary/30"
                : "w-[240px] grow"
            }
            onPress={() => {
              setStatusFilter(new Set(["interaction_required"]));
              setPage(1);
            }}
          >
            <CardBody>
              <div className="flex items-center gap-2">
                <div className="flex size-10 items-center justify-center rounded-small bg-primary/10 text-primary">
                  <Icon icon="solar:hand-shake-linear" width={20} />
                </div>
                <div>
                  <p className="text-md font-bold">
                    <NumberFlow
                      locales="en-US" // Intl.NumberFormat locales
                      value={
                        executions.filter(
                          (e: any) => status(e) == "Interaction Required",
                        ).length
                      }
                    />
                  </p>
                  <p className="text-sm text-default-500">
                    Interaction Required
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {executions.filter((e: any) => status(e) == "No Pattern Match").length >
          0 && (
          <Card
            isHoverable
            isPressable
            className={
              statusFilter.has("no_pattern_match")
                ? "w-[240px] grow bg-secondary/30"
                : "w-[240px] grow"
            }
            onPress={() => {
              setStatusFilter(new Set(["no_pattern_match"]));
              setPage(1);
            }}
          >
            <CardBody>
              <div className="flex items-center gap-2">
                <div className="flex size-10 items-center justify-center rounded-small bg-secondary/10 text-secondary">
                  <Icon icon="solar:bill-cross-outline" width={20} />
                </div>
                <div>
                  <p className="text-md font-bold">
                    <NumberFlow
                      locales="en-US" // Intl.NumberFormat locales
                      value={
                        executions.filter(
                          (e: any) => status(e) == "No Pattern Match",
                        ).length
                      }
                    />
                  </p>
                  <p className="text-sm text-default-500">No Pattern Match</p>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {executions.filter((e: any) => status(e) == "Canceled").length > 0 && (
          <Card
            isHoverable
            isPressable
            className={
              statusFilter.has("cancelled")
                ? "w-[240px] grow bg-danger/30"
                : "w-[240px] grow"
            }
            onPress={() => {
              setStatusFilter(new Set(["canceled"]));
              setPage(1);
            }}
          >
            <CardBody>
              <div className="flex items-center gap-2">
                <div className="flex size-10 items-center justify-center rounded-small bg-danger/10 text-danger">
                  <Icon icon="solar:forbidden-linear" width={20} />
                </div>
                <div>
                  <p className="text-md font-bold">
                    <NumberFlow
                      locales="en-US" // Intl.NumberFormat locales
                      value={
                        executions.filter((e: any) => status(e) == "Canceled")
                          .length
                      }
                    />
                  </p>
                  <p className="text-sm text-default-500">Canceled</p>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {executions.filter((e: any) => status(e) == "Error").length > 0 && (
          <Card
            isHoverable
            isPressable
            className={
              statusFilter.has("error")
                ? "w-[240px] grow bg-danger/30"
                : "w-[240px] grow"
            }
            onPress={() => {
              setStatusFilter(new Set(["error"]));
              setPage(1);
            }}
          >
            <CardBody>
              <div className="flex items-center gap-2">
                <div className="flex size-10 items-center justify-center rounded-small bg-danger/10 text-danger">
                  <Icon icon="solar:danger-triangle-outline" width={20} />
                </div>
                <div>
                  <p className="text-md font-bold">
                    <NumberFlow
                      locales="en-US" // Intl.NumberFormat locales
                      value={
                        executions.filter((e: any) => status(e) == "Error")
                          .length
                      }
                    />
                  </p>
                  <p className="text-sm text-default-500">Error</p>
                </div>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
      <Spacer y={2} />
      <Table
        isStriped
        aria-label="Executions Table"
        bottomContent={bottomContent}
        topContent={topContent}
      >
        <TableHeader>
          <TableColumn key="status" align="start">
            Status
          </TableColumn>
          <TableColumn key="id" align="center">
            ID
          </TableColumn>
          <TableColumn key="trigger" align="center">
            Trigger
          </TableColumn>
          <TableColumn key="duration" align="center">
            Duration
          </TableColumn>
          <TableColumn key="created" align="center">
            Created
          </TableColumn>
          <TableColumn key="actions" align="end">
            Actions
          </TableColumn>
        </TableHeader>
        <TableBody emptyContent="No executions found" items={items}>
          {(item: any) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <FunctionShowPayloadModal
        disclosure={showPayloadModal}
        payload={targetPayload}
      />
      <DeleteExecutionModal
        disclosure={deleteExecutionModal}
        execution={targetExecution}
      />
    </>
  );
}
