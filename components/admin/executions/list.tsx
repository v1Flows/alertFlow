"use client";
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Divider,
  Pagination,
  CircularProgress,
  Button,
  useDisclosure,
  Tooltip,
  DropdownSection,
  DropdownItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

import FunctionShowPayloadModal from "@/components/functions/flows/showPayload";
import DeleteExecutionModal from "@/components/functions/flows/deleteExecution";

export function ExecutionsList({ flows, payloads, executions, runners }: any) {
  const router = useRouter();

  const showPayloadModal = useDisclosure();
  const deleteExecutionModal = useDisclosure();

  const [targetPayload, setTargetPayload] = React.useState({} as any);
  const [targetExecution, setTargetExecution] = React.useState({} as any);

  const handleShow = (payload: any) => {
    setTargetPayload(payload);
    showPayloadModal.onOpen();
  };

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
      return "No Match";
    } else if (execution.ghost) {
      return "No Flow Actions found";
    } else {
      return "Finished";
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
                icon="solar:pause-broken"
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
      return <CircularProgress color="secondary" size="md" value={100} />;
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

  // pagination
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 15;
  const pages = Math.ceil(executions.length / rowsPerPage);
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return executions.slice(start, end);
  }, [page, executions]);

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
          <div className="relative flex justify-center items-center gap-2">
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
                        `/dashboard/flows/${execution.flow_id}/execution/${execution.id}`,
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
                      <Icon icon="solar:trash-bin-2-broken" width={20} />
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

  return (
    <main>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <p className="text-2xl font-bold mb-0 text-danger">Admin</p>
          <p className="text-2xl mb-0">|</p>
          <p className="text-2xl mb-0">Executions</p>
        </div>
      </div>
      <Divider className="my-4" />
      <div>
        <Table
          aria-label="Example table with custom cells"
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                showControls
                showShadow
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            </div>
          }
          classNames={{
            wrapper: "min-h-[222px]",
          }}
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
          <TableBody emptyContent={"No rows to display."} items={items}>
            {(item: any) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
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
