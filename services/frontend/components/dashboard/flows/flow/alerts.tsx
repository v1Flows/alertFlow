"use client";

import { Icon } from "@iconify/react";
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
} from "@heroui/react";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import TimeAgo from "react-timeago";
import { toast } from "sonner";

import FunctionShowAlertModal from "@/components/functions/flows/showAlert";
import FunctionDeleteAlertModal from "@/components/functions/flows/deleteAlert";

export default function Alerts({
  flow,
  executions,
  alerts,
  runners,
  canEdit,
}: any) {
  const router = useRouter();

  const showAlertModal = useDisclosure();
  const deleteAlertModal = useDisclosure();
  const [targetAlert, setTargetAlert] = React.useState({} as any);

  // pagination
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 9;
  const pages = Math.ceil(alerts.length / rowsPerPage);
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return alerts.slice(start, end);
  }, [page, alerts]);

  const handleShow = (alert: any) => {
    setTargetAlert(alert);
    showAlertModal.onOpen();
  };

  const handleDelete = (alert: any) => {
    setTargetAlert(alert);
    deleteAlertModal.onOpen();
  };

  const copyAlertIDtoClipboard = (id: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(id);
      toast.success("Alert ID copied to clipboard!");
    } else {
      toast.error("Failed to copy Alert ID to clipboard");
    }
  };

  const renderCell = React.useCallback((alert: any, columnKey: any) => {
    const cellValue = alert[columnKey];

    switch (columnKey) {
      case "status":
        return (
          <p
            className={`capitalize font-bold text-${alert.status === "firing" ? "danger" : "success"}`}
          >
            {alert.status}
          </p>
        );
      case "plugin":
        return (
          <p className="capitalize">{alert.plugin || "No plugin found"}</p>
        );
      case "runner":
        return (
          <>
            <p>
              {runners.find((runner: any) => runner.id === alert.runner_id)
                ?.name || "N/A"}
            </p>
            <p className="text-sm text-default-500">{alert.runner_id}</p>
          </>
        );
      case "encrypted":
        return (
          <>
            {alert.encrypted ? (
              <p className="font-bold text-success">Yes</p>
            ) : (
              <p className="font-bold text-danger">No</p>
            )}
          </>
        );
      case "executed":
        return (
          <>
            {executions.find(
              (execution: any) => execution.alert_id === alert.id,
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
                          `/flows/${flow.id}/execution/${executions.find((execution: any) => execution.alert_id === alert.id).id}`,
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
                    {new Date(alert.created_at).toLocaleString()}
                  </div>
                </div>
              }
            >
              <p>
                <TimeAgo date={alert.created_at} title="" />
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
              onPress={() => handleShow(alert)}
            >
              View
            </Button>
            <Tooltip content="Copy Alert ID to clipboard">
              <Button isIconOnly variant="flat">
                <Icon
                  icon="solar:copy-outline"
                  width={20}
                  onClick={() => copyAlertIDtoClipboard(alert.id)}
                />
              </Button>
            </Tooltip>
            <Button
              isIconOnly
              color="danger"
              isDisabled={!canEdit}
              variant="flat"
              onPress={() => handleDelete(alert)}
            >
              <Icon icon="hugeicons:delete-02" width={20} />
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
      <Table isStriped aria-label="Alerts Table" bottomContent={bottomContent}>
        <TableHeader>
          <TableColumn key="runner" align="start">
            Runner
          </TableColumn>
          <TableColumn key="status" align="center">
            Status
          </TableColumn>
          <TableColumn key="plugin" align="center">
            Plugin
          </TableColumn>
          <TableColumn key="encrypted" align="center">
            Encrypted
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
        <TableBody emptyContent="No alerts found" items={items}>
          {(item: any) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <FunctionShowAlertModal alert={targetAlert} disclosure={showAlertModal} />
      <FunctionDeleteAlertModal
        alert={targetAlert}
        disclosure={deleteAlertModal}
      />
    </main>
  );
}
