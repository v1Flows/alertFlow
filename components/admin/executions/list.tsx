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
  Chip,
  Spinner,
  CircularProgress,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";

import { IconWrapper } from "@/lib/IconWrapper";
import FunctionShowPayloadModal from "@/components/functions/flows/showPayload";

export function ExecutionsList({
  flows,
  projects,
  payloads,
  executions,
  runners,
}: any) {
  const router = useRouter();

  const showPayloadModal = useDisclosure();
  const [targetPayload, setTargetPayload] = React.useState({} as any);

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
    } else {
      return "Finished";
    }
  }

  function statusColor(execution: any) {
    if (execution.running) {
      return "primary";
    } else if (execution.waiting) {
      return "warning";
    } else if (execution.paused) {
      return "warning";
    } else if (execution.error) {
      return "danger";
    } else if (execution.no_match) {
      return "secondary";
    } else {
      return "success";
    }
  }

  function statusIcon(execution: any) {
    if (execution.running) {
      return <Spinner color="primary" size="sm" />;
    } else if (execution.waiting) {
      return <Icon icon="solar:pause-broken" />;
    } else if (execution.paused) {
      return <CircularProgress color="warning" size="sm" value={100} />;
    } else if (execution.error) {
      return <CircularProgress color="danger" size="sm" value={100} />;
    } else if (execution.no_match) {
      return <CircularProgress color="secondary" size="sm" value={100} />;
    } else {
      return <CircularProgress color="success" size="sm" value={100} />;
    }
  }

  // pagination
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 7;
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
      case "payload_id":
        return (
          <div>
            <Button
              color="primary"
              isDisabled={
                payloads.find((p: any) => p.id === execution.payload_id)
                  ? false
                  : true
              }
              size="sm"
              variant="flat"
              onClick={() =>
                handleShow(
                  payloads.find((p: any) => p.id === execution.payload_id),
                )
              }
            >
              Show Payload
            </Button>
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
        return (
          <div className="flex justify-start items-center gap-4">
            <IconWrapper
              className={`bg-${statusColor(execution)}/10 text-${statusColor(execution)}`}
            >
              {statusIcon(execution)}
            </IconWrapper>

            <Chip
              color={statusColor(execution)}
              radius="sm"
              size="sm"
              variant="flat"
            >
              {status(execution)}
            </Chip>
          </div>
        );
      case "created_at":
        return new Date(execution.created_at).toLocaleString("de-DE");
      case "executed_at":
        return new Date(execution.executed_at).toLocaleString("de-DE");
      case "finished_at":
        return new Date(execution.finished_at).toLocaleString("de-DE");
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
              STATUS
            </TableColumn>
            <TableColumn key="id" align="start">
              ID
            </TableColumn>
            <TableColumn key="flow_id" align="start">
              FLOW
            </TableColumn>
            <TableColumn key="payload_id" align="start">
              PAYLOAD
            </TableColumn>
            <TableColumn key="runner_id" align="start">
              RUNNER
            </TableColumn>
            <TableColumn key="created_at" align="start">
              CREATED AT
            </TableColumn>
            <TableColumn key="executed_at" align="start">
              EXECUTED AT
            </TableColumn>
            <TableColumn key="finished_at" align="start">
              FINISHED AT
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
    </main>
  );
}
