"use client";

import {
  Button,
  CircularProgress,
  Pagination,
  Snippet,
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
import React from "react";

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

  const [targetPayload, setTargetPayload] = React.useState({} as any);
  const [targetExecution, setTargetExecution] = React.useState({} as any);

  // pagination
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;
  const pages = Math.ceil(executions.length / rowsPerPage);
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return executions.slice(start, end);
  }, [page, executions]);

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
      return <CircularProgress color="warning" size="sm" value={100} />;
    } else if (execution.error) {
      return <CircularProgress color="danger" size="sm" value={100} />;
    } else if (execution.no_match) {
      return <CircularProgress color="secondary" size="sm" value={100} />;
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
              startContent={<Icon icon="solar:eye-broken" />}
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

  return (
    <main className="grid lg:grid-cols-1 gap-4">
      <Table isStriped aria-label="Executions Table">
        <TableHeader>
          <TableColumn key="status" align="start">
            Status
          </TableColumn>
          <TableColumn key="id" align="start">
            ID
          </TableColumn>
          <TableColumn key="trigger" align="start">
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
        <TableBody items={items}>
          {(item: any) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex justify-center">
        <Pagination
          showControls
          isDisabled={items.length === 0}
          page={page}
          total={pages}
          onChange={(page) => setPage(page)}
        />
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
