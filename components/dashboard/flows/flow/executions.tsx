"use client";

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
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import TimeAgo from "react-timeago";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

import DeleteExecutionModal from "@/components/functions/flows/deleteExecution";
import FunctionShowPayloadModal from "@/components/functions/flows/showPayload";

export default function Executions({
  executions,
  payloads,
  displayToFlow,
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
    var length = 0;

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
    if (execution.running) {
      return "Running";
    } else if (execution.waiting) {
      return "Waiting";
    } else if (execution.paused) {
      return "Paused";
    } else if (execution.error) {
      return "Error";
    } else if (execution.no_match) {
      return "No Pattern Match";
    } else if (execution.ghost) {
      return "No Flow Actions found";
    } else {
      return "Finished";
    }
  }

  function statusFilterReturn(execution: any) {
    if (execution.running) {
      return "running";
    } else if (execution.waiting) {
      return "waiting";
    } else if (execution.paused) {
      return "paused";
    } else if (execution.error) {
      return "error";
    } else if (execution.no_match) {
      return "no_pattern_match";
    } else if (execution.ghost) {
      return "no_flow_actions_found";
    } else {
      return "finished";
    }
  }

  function statusIcon(execution: any) {
    if (execution.running) {
      return (
        <Tooltip content={`${status(execution)}`}>
          <CircularProgress aria-label="Step" color="primary" size="md" />
        </Tooltip>
      );
    } else if (execution.waiting) {
      return (
        <Tooltip content={`${status(execution)}`}>
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
                icon="solar:clock-circle-broken"
                width={16}
              />
            }
          />
        </Tooltip>
      );
    } else if (execution.paused) {
      return <CircularProgress color="warning" size="md" value={100} />;
    } else if (execution.error) {
      return (
        <Tooltip content={`${status(execution)}`}>
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
    } else if (execution.no_match) {
      return (
        <Tooltip content={`${status(execution)}`}>
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
    } else if (execution.ghost) {
      return (
        <Tooltip content={`${status(execution)}`}>
          <CircularProgress
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
    } else {
      return (
        <Tooltip content={`${status(execution)}. Steps 5 / 5`}>
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
    }
  }

  function getDuration(execution: any) {
    if (execution.finished_at === "0001-01-01T00:00:00Z") return "0s";
    const ms =
      new Date(execution.finished_at).getTime() -
      new Date(execution.created_at).getTime();
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
                onPress={() =>
                  router.push(`/dashboard/flows/${execution.flow_id}/`)
                }
              >
                View Flow
              </Button>
            )}
            <Button
              color="primary"
              size="md"
              startContent={<Icon icon="solar:eye-broken" width={18} />}
              variant="solid"
              onPress={() =>
                router.push(
                  `/dashboard/flows/${execution.flow_id}/execution/${execution.id}`,
                )
              }
            >
              View
            </Button>
            <Button
              isIconOnly
              color="danger"
              size="md"
              variant="flat"
              onPress={() => {
                setTargetExecution(execution);
                deleteExecutionModal.onOpen();
              }}
            >
              <Icon
                height="20"
                icon="solar:trash-bin-minimalistic-broken"
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
        <div className="flex justify-between gap-3 items-end">
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
                <DropdownItem key="finished" className="capitalize">
                  <div className="flex flex-cols gap-2">
                    <Icon
                      className="text-success"
                      icon="solar:check-read-broken"
                      width={18}
                    />
                    Finished
                  </div>
                </DropdownItem>
                <DropdownItem key="running" className="capitalize">
                  <div className="flex flex-cols gap-2">
                    <Icon
                      className="text-primary"
                      icon="solar:play-bold-duotone"
                      width={18}
                    />
                    Running
                  </div>
                </DropdownItem>
                <DropdownItem key="waiting" className="capitalize">
                  <div className="flex flex-cols gap-2">
                    <Icon
                      className="text-warning"
                      icon="solar:clock-circle-broken"
                      width={18}
                    />
                    Waiting
                  </div>
                </DropdownItem>
                <DropdownItem key="paused" className="capitalize">
                  <div className="flex flex-cols gap-2">
                    <Icon
                      className="text-warning"
                      icon="solar:pause-broken"
                      width={18}
                    />
                    Paused
                  </div>
                </DropdownItem>
                <DropdownItem key="no_pattern_match" className="capitalize">
                  <div className="flex flex-cols gap-2">
                    <Icon
                      className="text-secondary"
                      icon="solar:bill-cross-broken"
                      width={18}
                    />
                    No Match
                  </div>
                </DropdownItem>
                <DropdownItem
                  key="no_flow_actions_found"
                  className="capitalize"
                >
                  <div className="flex flex-cols gap-2">
                    <Icon
                      className="text-default-500"
                      icon="solar:ghost-broken"
                      width={18}
                    />
                    Ghost
                  </div>
                </DropdownItem>
                <DropdownItem key="error" className="capitalize">
                  <div className="flex flex-cols gap-2">
                    <Icon
                      className="text-danger"
                      icon="solar:danger-triangle-broken"
                      width={18}
                    />
                    Error
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
      <div className="grid xl:grid-cols-7 lg:grid-cols-4 grid-cols-2 gap-4">
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
                <div className="flex bg-success/10 text-success items-center rounded-small justify-center w-10 h-10">
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
                <div className="flex bg-primary/10 text-primary items-center rounded-small justify-center w-10 h-10">
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
            className={statusFilter.has("waiting") ? "bg-warning/30" : ""}
            onPress={() => {
              setStatusFilter(new Set(["waiting"]));
              setPage(1);
            }}
          >
            <CardBody>
              <div className="flex items-center gap-2">
                <div className="flex bg-warning/10 text-warning items-center rounded-small justify-center w-10 h-10">
                  <Icon icon="solar:clock-circle-broken" width={20} />
                </div>
                <div>
                  <p className="text-md font-bold">
                    {
                      executions.filter((e: any) => status(e) == "Waiting")
                        .length
                    }
                  </p>
                  <p className="text-sm text-default-500">Waiting</p>
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
                <div className="flex bg-warning/10 text-warning items-center rounded-small justify-center w-10 h-10">
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
              statusFilter.has("no_pattern_match") ? "bg-secondary/30" : ""
            }
            onPress={() => {
              setStatusFilter(new Set(["no_pattern_match"]));
              setPage(1);
            }}
          >
            <CardBody>
              <div className="flex items-center gap-2">
                <div className="flex bg-secondary/10 text-secondary items-center rounded-small justify-center w-10 h-10">
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
                  <p className="text-sm text-default-500">No Match</p>
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
              statusFilter.has("no_flow_actions_found") ? "bg-default/60" : ""
            }
            onPress={() => {
              setStatusFilter(new Set(["no_flow_actions_found"]));
              setPage(1);
            }}
          >
            <CardBody>
              <div className="flex items-center gap-2">
                <div className="flex bg-default/20 text-default-500 items-center rounded-small justify-center w-10 h-10">
                  <Icon icon="solar:ghost-broken" width={20} />
                </div>
                <div>
                  <p className="text-md font-bold">
                    {
                      executions.filter(
                        (e: any) => status(e) == "No Flow Actions found",
                      ).length
                    }
                  </p>
                  <p className="text-sm text-default-500">Ghost</p>
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
                <div className="flex bg-danger/10 text-danger items-center rounded-small justify-center w-10 h-10">
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
