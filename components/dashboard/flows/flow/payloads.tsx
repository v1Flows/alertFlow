"use client";

import {
  Button,
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
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import TimeAgo from "react-timeago";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { toast } from "sonner";

import FunctionShowPayloadModal from "@/components/functions/flows/showPayload";
import FunctionDeletePayloadModal from "@/components/functions/flows/deletePayload";

export default function Payloads({
  flow,
  executions,
  payloads,
  runners,
  canEdit,
}: any) {
  const router = useRouter();

  const showPayloadModal = useDisclosure();
  const deletePayloadModal = useDisclosure();
  const [targetPayload, setTargetPayload] = React.useState({} as any);

  // pagination
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 9;
  const pages = Math.ceil(payloads.length / rowsPerPage);
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return payloads.slice(start, end);
  }, [page, payloads]);

  const handleShow = (payload: any) => {
    setTargetPayload(payload);
    showPayloadModal.onOpen();
  };

  const handleDelete = (payload: any) => {
    setTargetPayload(payload);
    deletePayloadModal.onOpen();
  };

  function endpointColor(endpoint: string) {
    switch (endpoint) {
      case "alertmanager":
        return "warning";
      default:
        return "default";
    }
  }

  function endpointIcon(endpoint: string): string {
    switch (endpoint) {
      case "alertmanager":
        return "vscode-icons:file-type-prometheus";
      default:
        return "solar:forbidden-circle-outline";
    }
  }

  const copyPayloadIDtoClipboard = (id: string) => {
    // eslint-disable-next-line no-undef
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      // eslint-disable-next-line no-undef
      navigator.clipboard.writeText(id);
      toast.success("Payload ID copied to clipboard!");
    } else {
      toast.error("Failed to copy Payload ID to clipboard");
    }
  };

  const renderCell = React.useCallback((payload: any, columnKey: any) => {
    const cellValue = payload[columnKey];

    switch (columnKey) {
      case "endpoint":
        return (
          <div className="flex items-center gap-2">
            <div
              className={`flex bg-${endpointColor(payload.endpoint)}/10 text-${endpointColor(payload.endpoint)} items-center rounded-small justify-center w-8 h-8`}
            >
              <Icon icon={endpointIcon(payload.endpoint)} width={20} />
            </div>
            <div>
              <p className="capitalize">{payload.endpoint || "No endpoint"}</p>
            </div>
          </div>
        );
      case "runner":
        return (
          <p>
            {
              runners.find((runner: any) => runner.id === payload.runner_id)
                ?.name
            }
          </p>
        );
      case "executed":
        return (
          <>
            {executions.find(
              (execution: any) => execution.payload_id === payload.id,
            ) ? (
              <Tooltip
                content={
                  <>
                    <Spacer y={2} />
                    <Button
                      color="primary"
                      startContent={
                        <Icon icon="solar:map-arrow-square-linear" width={20} />
                      }
                      variant="bordered"
                      onPress={() =>
                        router.push(
                          `/dashboard/flows/${flow.id}/execution/${executions.find((execution: any) => execution.payload_id === payload.id).id}`,
                        )
                      }
                    >
                      View Execution
                    </Button>
                    <Spacer y={2} />
                  </>
                }
              >
                <p className="font-bold text-success">Yes</p>
              </Tooltip>
            ) : (
              <div className="flex flex-col">
                <p className="font-bold text-danger">No</p>
                <p className="text-sm text-default-500">
                  or execution got deleted
                </p>
              </div>
            )}
          </>
        );
      case "received":
        return (
          <>
            <Tooltip
              content={
                <div className="px-1 py-2">
                  <div className="text-small font-bold">Received at</div>
                  <div className="text-tiny">
                    {new Date(payload.created_at).toLocaleString()}
                  </div>
                </div>
              }
            >
              <p>
                <TimeAgo date={payload.created_at} title="" />
              </p>
            </Tooltip>
          </>
        );
      case "actions":
        return (
          <div className="flex items-center justify-end gap-2">
            <Button
              color="primary"
              startContent={<Icon icon="solar:eye-outline" width={20} />}
              onPress={() => handleShow(payload)}
            >
              View
            </Button>
            <Tooltip content="Copy Payload ID to clipboard">
              <Button isIconOnly variant="flat">
                <Icon
                  icon="solar:copy-outline"
                  width={20}
                  onClick={() => copyPayloadIDtoClipboard(payload.id)}
                />
              </Button>
            </Tooltip>
            <Button
              isIconOnly
              color="danger"
              isDisabled={!canEdit}
              variant="flat"
              onPress={() => handleDelete(payload)}
            >
              <Icon icon="solar:trash-bin-trash-outline" width={20} />
            </Button>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const bottomContent = useMemo(() => {
    return (
      <div className="flex justify-center">
        <Pagination
          showControls
          isDisabled={items.length === 0}
          page={page}
          total={pages}
          onChange={(page) => setPage(page)}
        />
      </div>
    );
  }, [items]);

  return (
    <main>
      <Table
        isStriped
        aria-label="Payloads Table"
        bottomContent={bottomContent}
      >
        <TableHeader>
          <TableColumn key="endpoint" align="start">
            Endpoint
          </TableColumn>
          <TableColumn key="runner" align="center">
            Runner
          </TableColumn>
          <TableColumn key="executed" align="center">
            Executed
          </TableColumn>
          <TableColumn key="received" align="center">
            Received
          </TableColumn>
          <TableColumn key="actions" align="end">
            Actions
          </TableColumn>
        </TableHeader>
        <TableBody emptyContent="No payloads found" items={items}>
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
      <FunctionDeletePayloadModal
        disclosure={deletePayloadModal}
        flow={flow}
        payload={targetPayload}
      />
    </main>
  );
}
