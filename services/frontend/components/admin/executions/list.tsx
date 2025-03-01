"use client";
import { Icon } from "@iconify/react";
import {
  Button,
  Card,
  CardBody,
  CircularProgress,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Pagination,
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

import FunctionShowPayloadModal from "@/components/functions/flows/showAlert";
import DeleteExecutionModal from "@/components/functions/flows/deleteExecution";

export function ExecutionsList({ flows, payloads, executions, runners }: any) {
  const router = useRouter();

  const showPayloadModal = useDisclosure();
  const deleteExecutionModal = useDisclosure();

  const [targetPayload, setTargetPayload] = useState({} as any);
  const [targetExecution, setTargetExecution] = useState({} as any);

  const [statusFilter, setStatusFilter] = useState(new Set([]) as any);

  const handleShow = (payload: any) => {
    setTargetPayload(payload);
    showPayloadModal.onOpen();
  };

  // pagination
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 15;
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
    if (execution.pending) {
      return "Pending";
    } else if (execution.running) {
      return "Running";
    } else if (execution.paused) {
      return "Paused";
    } else if (execution.canceled) {
      return "Canceled";
    } else if (execution.no_pattern_match) {
      return "No Pattern Match";
    } else if (execution.interaction_required) {
      return "Interaction Required";
    } else if (execution.error) {
      return "Error";
    } else if (execution.finished) {
      return "Finished";
    } else {
      return "Unknown";
    }
  }

  function statusFilterReturn(execution: any) {
    if (execution.pending) {
      return "pending";
    } else if (execution.running) {
      return "running";
    } else if (execution.paused) {
      return "paused";
    } else if (execution.canceled) {
      return "canceled";
    } else if (execution.no_pattern_match) {
      return "no_pattern_match";
    } else if (execution.interaction_required) {
      return "interaction_required";
    } else if (execution.error) {
      return "error";
    } else if (execution.finished) {
      return "finished";
    } else {
      return "unknown";
    }
  }

  function statusIcon(execution: any) {
    if (execution.pending) {
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
    } else if (execution.running) {
      return (
        <Tooltip content={`${status(execution)}`}>
          <CircularProgress aria-label="Step" color="primary" size="md" />
        </Tooltip>
      );
    } else if (execution.paused) {
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
    } else if (execution.canceled) {
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
    } else if (execution.no_pattern_match) {
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
    } else if (execution.interaction_required) {
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
    } else if (execution.error) {
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
    } else if (execution.finished) {
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
      case "id":
        return <p className="text-sm text-default-500">{execution.id}</p>;
      case "flow_id":
        return (
          <div>
            <p>{flows.find((f: any) => f.id === execution.flow_id).name}</p>
            <p className="text-xs text-default-400">{execution.flow_id}</p>
          </div>
        );
      case "runner_id":
        return (
          <div>
            {runners.find((r: any) => r.id === execution.runner_id) ? (
              <>
                <p>
                  {runners.find((r: any) => r.id === execution.runner_id)?.name}
                </p>
                <p className="text-xs text-default-400">
                  {execution.runner_id}
                </p>
              </>
            ) : (
              <p className="text-sm text-default-500">-</p>
            )}
          </div>
        );
      case "status":
        return <div>{statusIcon(execution)}</div>;
      case "duration":
        return <p>{getDuration(execution)}</p>;
      case "created_at":
        return new Date(execution.created_at).toLocaleString("de-DE");
      case "executed_at":
        return new Date(execution.executed_at).toLocaleString("de-DE");
      case "finished_at":
        return new Date(execution.finished_at).toLocaleString("de-DE");
      case "actions":
        return (
          <div className="relative flex items-center justify-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <Icon
                    className="text-default-400"
                    icon="solar:menu-dots-broken"
                    width={24}
                  />
                </Button>
              </DropdownTrigger>
              <DropdownMenu variant="faded">
                <DropdownSection showDivider title="View">
                  <DropdownItem
                    key="view_execution"
                    color="primary"
                    startContent={
                      <Icon icon="solar:reorder-line-duotone" width={20} />
                    }
                    onPress={() =>
                      router.push(
                        `/flows/${execution.flow_id}/execution/${execution.id}`,
                      )
                    }
                  >
                    Execution
                  </DropdownItem>
                  <DropdownItem
                    key="view_execution"
                    color="primary"
                    startContent={
                      <Icon icon="solar:letter-opened-broken" width={20} />
                    }
                    onPress={() =>
                      handleShow(
                        payloads.find(
                          (p: any) => p.id === execution.payload_id,
                        ),
                      )
                    }
                  >
                    Payload
                  </DropdownItem>
                </DropdownSection>
                <DropdownSection title="Danger Zone">
                  <DropdownItem
                    key="delete"
                    className="text-danger"
                    color="danger"
                    startContent={
                      <Icon icon="solar:trash-bin-trash-outline" width={20} />
                    }
                    onPress={() => {
                      setTargetExecution(execution);
                      deleteExecutionModal.onOpen();
                    }}
                  >
                    Delete
                  </DropdownItem>
                </DropdownSection>
              </DropdownMenu>
            </Dropdown>
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
              <DropdownTrigger className="hidden sm:flex">
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
                      icon="solar:pause-broken"
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
                      icon="solar:bill-cross-broken"
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
                      icon="solar:danger-triangle-broken"
                      width={18}
                    />
                    Error
                  </div>
                </DropdownItem>
                <DropdownItem key="finished" className="capitalize">
                  <div className="flex-cols flex gap-2">
                    <Icon
                      className="text-success"
                      icon="solar:check-read-broken"
                      width={18}
                    />
                    Finished
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

  return (
    <main>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <p className="mb-0 text-2xl font-bold text-danger">Admin</p>
          <p className="mb-0 text-2xl">|</p>
          <p className="mb-0 text-2xl">Executions</p>
        </div>
      </div>
      <Divider className="my-4" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-7">
        <div className="col-span-1">
          <Card
            fullWidth
            isHoverable
            isPressable
            className={statusFilter.has("pending") ? "bg-default/50" : ""}
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
        </div>

        <div className="col-span-1">
          <Card
            fullWidth
            isHoverable
            isPressable
            className={statusFilter.has("running") ? "bg-primary/30" : ""}
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
                    {
                      executions.filter((e: any) => status(e) == "Running")
                        .length
                    }
                  </p>
                  <p className="text-sm text-default-500">Running</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="col-span-1">
          <Card
            fullWidth
            isHoverable
            isPressable
            className={statusFilter.has("paused") ? "bg-warning/30" : ""}
            onPress={() => {
              setStatusFilter(new Set(["paused"]));
              setPage(1);
            }}
          >
            <CardBody>
              <div className="flex items-center gap-2">
                <div className="flex size-10 items-center justify-center rounded-small bg-warning/10 text-warning">
                  <Icon icon="solar:pause-broken" width={20} />
                </div>
                <div>
                  <p className="text-md font-bold">
                    {
                      executions.filter((e: any) => status(e) == "Paused")
                        .length
                    }
                  </p>
                  <p className="text-sm text-default-500">Paused</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="col-span-1">
          <Card
            fullWidth
            isHoverable
            isPressable
            className={
              statusFilter.has("interaction_required") ? "bg-primary/30" : ""
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
                    {
                      executions.filter(
                        (e: any) => status(e) == "Interaction Required",
                      ).length
                    }
                  </p>
                  <p className="text-sm text-default-500">
                    Interaction Required
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="col-span-1">
          <Card
            fullWidth
            isHoverable
            isPressable
            className={
              statusFilter.has("no_pattern_match") ? "bg-secondary/30" : ""
            }
            onPress={() => {
              setStatusFilter(new Set(["no_pattern_match"]));
              setPage(1);
            }}
          >
            <CardBody>
              <div className="flex items-center gap-2">
                <div className="flex size-10 items-center justify-center rounded-small bg-secondary/10 text-secondary">
                  <Icon icon="solar:bill-cross-broken" width={20} />
                </div>
                <div>
                  <p className="text-md font-bold">
                    {
                      executions.filter(
                        (e: any) => status(e) == "No Pattern Match",
                      ).length
                    }
                  </p>
                  <p className="text-sm text-default-500">No Pattern Match</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="col-span-1">
          <Card
            fullWidth
            isHoverable
            isPressable
            className={statusFilter.has("error") ? "bg-danger/30" : ""}
            onPress={() => {
              setStatusFilter(new Set(["error"]));
              setPage(1);
            }}
          >
            <CardBody>
              <div className="flex items-center gap-2">
                <div className="flex size-10 items-center justify-center rounded-small bg-danger/10 text-danger">
                  <Icon icon="solar:danger-triangle-broken" width={20} />
                </div>
                <div>
                  <p className="text-md font-bold">
                    {executions.filter((e: any) => status(e) == "Error").length}
                  </p>
                  <p className="text-sm text-default-500">Error</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="col-span-1">
          <Card
            fullWidth
            isHoverable
            isPressable
            className={statusFilter.has("finished") ? "bg-success/30" : ""}
            onPress={() => {
              setStatusFilter(new Set(["finished"]));
              setPage(1);
            }}
          >
            <CardBody>
              <div className="flex items-center gap-2">
                <div className="flex size-10 items-center justify-center rounded-small bg-success/10 text-success">
                  <Icon icon="solar:check-read-broken" width={20} />
                </div>
                <div>
                  <p className="text-md font-bold">
                    {
                      executions.filter((e: any) => status(e) == "Finished")
                        .length
                    }
                  </p>
                  <p className="text-sm text-default-500">Finished</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
      <Spacer y={2} />
      <Table
        aria-label="Example table with custom cells"
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              showControls
              showShadow
              page={page}
              total={pages()}
              onChange={(page) => setPage(page)}
            />
          </div>
        }
        classNames={{
          wrapper: "min-h-[222px]",
        }}
        topContent={topContent}
      >
        <TableHeader>
          <TableColumn key="status" align="start">
            Status
          </TableColumn>
          <TableColumn key="flow_id" align="start">
            Flow
          </TableColumn>
          <TableColumn key="id" align="start">
            ID
          </TableColumn>
          <TableColumn key="runner_id" align="start">
            Runner
          </TableColumn>
          <TableColumn key="duration" align="start">
            Duration
          </TableColumn>
          <TableColumn key="created_at" align="start">
            Created At
          </TableColumn>
          <TableColumn key="executed_at" align="start">
            Executed At
          </TableColumn>
          <TableColumn key="finished_at" align="start">
            Finished At
          </TableColumn>
          <TableColumn key="actions" align="center">
            Actions
          </TableColumn>
        </TableHeader>
        <TableBody emptyContent="No rows to display." items={items}>
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
    </main>
  );
}
