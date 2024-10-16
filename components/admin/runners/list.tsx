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
  useDisclosure,
  Pagination,
} from "@nextui-org/react";
import TimeAgo from "react-timeago";
import { Icon } from "@iconify/react";

import DeleteRunnerModal from "@/components/functions/runner/delete";
import ChangeRunnerStatusModal from "@/components/functions/runner/changeStatus";
import EditRunnerModal from "@/components/functions/runner/edit";

export function SelfHostedRunnerList({ runners, projects }: any) {
  const [status, setStatus] = React.useState(false);
  const [targetRunner, setTargetRunner] = React.useState({} as any);
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
        return (
          <div>
            <p>{projects.find((p: any) => p.id === runner.project_id)?.name}</p>
            <p className="text-xs text-default-400">{runner.project_id}</p>
          </div>
        );
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
                  <Icon
                    className="text-default-400"
                    icon="solar:menu-dots-broken"
                    width={24}
                  />
                </Button>
              </DropdownTrigger>
              <DropdownMenu variant="faded">
                <DropdownSection showDivider title="Edit Zone">
                  <DropdownItem
                    key="edit"
                    className="text-warning"
                    color="warning"
                    startContent={
                      <Icon icon="solar:pen-new-square-broken" width={20} />
                    }
                    onPress={() => {
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
                        <Icon
                          icon="solar:lock-keyhole-minimalistic-unlocked-broken"
                          width={20}
                        />
                      }
                      onPress={() => {
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
                        <Icon
                          icon="solar:lock-keyhole-minimalistic-broken"
                          width={20}
                        />
                      }
                      onPress={() => {
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
                      <Icon icon="solar:trash-bin-trash-outline" width={20} />
                    }
                    onPress={() => {
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
      <p className="text-2xl font-bold mb-0 text-secondary mb-2">
        Self-Hosted Runners
      </p>
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
