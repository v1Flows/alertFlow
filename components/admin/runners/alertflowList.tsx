"use client";
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
  cn,
  useDisclosure,
  Pagination,
} from "@nextui-org/react";
import TimeAgo from "react-timeago";
import { useRouter } from "next/navigation";

import {
  DeleteDocumentIcon,
  EditDocumentIcon,
  LockIcon,
  PlusIcon,
  VerticalDotsIcon,
} from "@/components/icons";
import CreateRunnerModal from "@/components/functions/runner/create";
import DeleteRunnerModal from "@/components/functions/runner/delete";
import ChangeRunnerStatusModal from "@/components/functions/runner/changeStatus";
import EditRunnerModal from "@/components/functions/runner/edit";

export function AlertflowRunnerList({ runners }: any) {
  const router = useRouter();

  const [status, setStatus] = React.useState(false);
  const [targetRunner, setTargetRunner] = React.useState({} as any);
  const addRunnerModal = useDisclosure();
  const editRunnerModal = useDisclosure();
  const changeStatusModal = useDisclosure();
  const deleteRunnerModal = useDisclosure();

  // pagination
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 7;
  const pages = Math.ceil(runners.length / rowsPerPage);
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return runners.slice(start, end);
  }, [page, runners]);

  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";

  function heartbeatColor(runner: any) {
    var timeAgo =
      (new Date(runner.last_heartbeat).getTime() - Date.now()) / 1000;

    if (timeAgo < 0 && timeAgo > -30) {
      return "success";
    } else if (timeAgo <= -30 && timeAgo > -60) {
      return "warning";
    } else if (timeAgo <= -60) {
      return "danger";
    }
  }

  const renderCell = React.useCallback((runner: any, columnKey: any) => {
    const cellValue = runner[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <div>
            <p>{runner.name}</p>
            <p className="text-xs text-default-400">{runner.id}</p>
          </div>
        );
      case "project":
        return <p>None</p>;
      case "registered":
        return (
          <Chip color={runner.registered ? "success" : "danger"} variant="dot">
            {runner.registered ? "Registered" : "Unregistered"}
          </Chip>
        );
      case "status":
        return (
          <div>
            <Chip
              className="capitalize"
              color={runner.disabled ? "danger" : "success"}
              radius="sm"
              size="sm"
              variant="flat"
            >
              {runner.disabled ? "Disabled" : "Active"}
            </Chip>
            {runner.disabled && (
              <p className="text-sm text-default-400">
                {runner.disabled_reason}
              </p>
            )}
          </div>
        );
      case "executing_job":
        return (
          <Chip
            color={runner.executing_job ? "primary" : "default"}
            variant="dot"
          >
            {runner.executing_job ? "Active" : "Idle"}
          </Chip>
        );
      case "last_heartbeat":
        return (
          <p className={"text-" + heartbeatColor(runner)}>
            {runner.last_heartbeat !== "0001-01-01T00:00:00Z" && (
              <TimeAgo date={runner.last_heartbeat} />
            )}
            {runner.last_heartbeat === "0001-01-01T00:00:00Z" && "N/A"}
          </p>
        );
      case "functions":
        return (
          <div>
            <p className="text-sm text-default-500">
              Actions: {runner.available_actions.length}
            </p>
            <p className="text-sm text-default-500">
              Payload Injectors: {runner.available_payload_injectors.length}
            </p>
          </div>
        );
      case "runner_version":
        return <p>{runner.runner_version ? runner.runner_version : "N/A"}</p>;
      case "actions":
        return (
          <div className="relative flex justify-center items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <VerticalDotsIcon className="text-default-300" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu variant="faded">
                <DropdownSection title="Edit Zone">
                  <DropdownItem
                    key="edit"
                    className="text-warning"
                    color="warning"
                    startContent={
                      <EditDocumentIcon
                        className={cn(iconClasses, "text-warning")}
                      />
                    }
                    onClick={() => {
                      setTargetRunner(runner);
                      editRunnerModal.onOpen();
                    }}
                  >
                    Edit
                  </DropdownItem>
                  {runner.disabled ? (
                    <DropdownItem
                      key="disable"
                      className="text-success"
                      color="success"
                      startContent={
                        <LockIcon className={cn(iconClasses, "text-success")} />
                      }
                      onClick={() => {
                        setTargetRunner(runner);
                        setStatus(false);
                        changeStatusModal.onOpen();
                      }}
                    >
                      Enable
                    </DropdownItem>
                  ) : (
                    <DropdownItem
                      key="disable"
                      className="text-danger"
                      color="danger"
                      startContent={
                        <LockIcon className={cn(iconClasses, "text-danger")} />
                      }
                      onClick={() => {
                        setTargetRunner(runner);
                        setStatus(true);
                        changeStatusModal.onOpen();
                      }}
                    >
                      Disable
                    </DropdownItem>
                  )}
                </DropdownSection>
                <DropdownSection title="Danger Zone">
                  <DropdownItem
                    key="delete"
                    className="text-danger"
                    color="danger"
                    startContent={
                      <DeleteDocumentIcon
                        className={cn(iconClasses, "text-danger")}
                      />
                    }
                    onClick={() => {
                      setTargetRunner(runner);
                      deleteRunnerModal.onOpen();
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
      <div className="flex items-center justify-between mb-2">
        <p className="text-2xl font-bold mb-0 text-primary">
          AlertFlow Runners
        </p>
        <Button
          color="primary"
          endContent={<PlusIcon height={undefined} width={undefined} />}
          variant="flat"
          onPress={() => addRunnerModal.onOpen()}
        >
          Add Runner
        </Button>
      </div>
      <div>
        <Table
          aria-label="Example table with custom cells"
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="secondary"
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
            <TableColumn key="name" align="start">
              NAME
            </TableColumn>
            <TableColumn key="runner_version" align="start">
              VERSION
            </TableColumn>
            <TableColumn key="project" align="start">
              PROJECT
            </TableColumn>
            <TableColumn key="status" align="start">
              STATUS
            </TableColumn>
            <TableColumn key="registered" align="start">
              REGISTERED
            </TableColumn>
            <TableColumn key="executing_job" align="start">
              EXECUTING JOB
            </TableColumn>
            <TableColumn key="last_heartbeat" align="start">
              LAST HEARTBEAT
            </TableColumn>
            <TableColumn key="functions" align="start">
              FUNCTIONS
            </TableColumn>
            <TableColumn key="actions" align="center">
              ACTIONS
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
      <CreateRunnerModal
        alertflow_runner={true}
        disclosure={addRunnerModal}
        project={"none"}
      />
      <EditRunnerModal disclosure={editRunnerModal} runner={targetRunner} />
      <ChangeRunnerStatusModal
        disclosure={changeStatusModal}
        runner={targetRunner}
        status={status}
      />
      <DeleteRunnerModal disclosure={deleteRunnerModal} runner={targetRunner} />
    </main>
  );
}
