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
} from "@nextui-org/react";
import TimeAgo from "react-timeago";

import {
  DeleteDocumentIcon,
  EditDocumentIcon,
  EyeIcon,
  LockIcon,
  PlusIcon,
  VerticalDotsIcon,
} from "@/components/icons";
import AddAlertflowRunnerModal from "./addRunnerModal";

export function AlertflowRunnerList({ runners }: any) {
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
        return (
          <div>
            <p>{runner.name}</p>
            <p className="text-xs text-default-400">{runner.project_id}</p>
          </div>
        );
      case "registered":
        return (
          <Chip color={runner.registered ? "success" : "danger"} variant="dot">
            {runner.registered ? "Registered" : "Unregistered"}
          </Chip>
        );
      case "active":
        return (
          <Chip color={runner.active ? "primary" : "default"} variant="dot">
            {runner.active ? "Active" : "Inactive"}
          </Chip>
        );
      case "last_heartbeat":
        return (
          <p className={"text-" + heartbeatColor(runner)}>
            <TimeAgo date={runner.last_heartbeat} />
          </p>
        );
      case "available_actions":
        return <p>{runner.available_actions.length}</p>;
      case "available_payload_injectors":
        return <p>{runner.available_payload_injectors.length}</p>;
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
                <DropdownSection showDivider title="Actions">
                  <DropdownItem
                    key="view"
                    className="text-primary"
                    color="primary"
                    description="Take a look on this project"
                    startContent={
                      <EyeIcon className={cn(iconClasses, "text-primary")} />
                    }
                  >
                    View Project
                  </DropdownItem>
                </DropdownSection>
                <DropdownSection title="Danger Zone">
                  <DropdownItem
                    key="edit"
                    className="text-warning"
                    color="warning"
                    description="Apply changes to this project"
                    startContent={
                      <EditDocumentIcon
                        className={cn(iconClasses, "text-warning")}
                      />
                    }
                  >
                    Edit Runner
                  </DropdownItem>
                  <DropdownItem
                    key="disable"
                    className="text-secondary"
                    color="secondary"
                    description="Disable access to this project for members"
                    startContent={
                      <LockIcon className={cn(iconClasses, "text-secondary")} />
                    }
                  >
                    Disable Runner
                  </DropdownItem>
                  <DropdownItem
                    key="delete"
                    className="text-danger"
                    color="danger"
                    description="Permanently delete this project"
                    startContent={
                      <DeleteDocumentIcon
                        className={cn(iconClasses, "text-danger")}
                      />
                    }
                  >
                    Delete Runner
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
        <AddAlertflowRunnerModal />
      </div>
      <div>
        <Table aria-label="Example table with custom cells">
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
            <TableColumn key="registered" align="start">
              REGISTERED
            </TableColumn>
            <TableColumn key="active" align="start">
              ACTIVE
            </TableColumn>
            <TableColumn key="last_heartbeat" align="start">
              LAST HEARTBEAT
            </TableColumn>
            <TableColumn key="available_actions" align="start">
              AVAILABLE ACTIONS
            </TableColumn>
            <TableColumn key="available_payload_injectors" align="start">
              AVAILABLE P-I
            </TableColumn>
            <TableColumn key="actions" align="center">
              ACTIONS
            </TableColumn>
          </TableHeader>
          <TableBody emptyContent={"No rows to display."} items={runners}>
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
    </main>
  );
}
