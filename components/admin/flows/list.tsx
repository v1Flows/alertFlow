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
  Divider,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
  cn,
  useDisclosure,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";

import {
  DeleteDocumentIcon,
  EditDocumentIcon,
  EyeIcon,
  LockIcon,
  VerticalDotsIcon,
} from "@/components/icons";
import FunctionDeleteFlow from "@/components/functions/flows/deleteFlow";

export function FlowsList({ flows, projects }: any) {
  const router = useRouter();

  const [targetFlow, setTargetFlow] = React.useState({} as any);
  const deleteModal = useDisclosure();

  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";

  const renderCell = React.useCallback((flow: any, columnKey: any) => {
    const cellValue = flow[columnKey];

    switch (columnKey) {
      case "id":
        return <p className="text-sm text-default-500">{flow.id}</p>;
      case "name":
        return (
          <div>
            <p>{flow.name}</p>
            <p className="text-sm text-default-500">{flow.description}</p>
          </div>
        );
      case "project_id":
        return (
          <div>
            <p>{projects.find((p: any) => p.id === flow.project_id).name}</p>
            <p className="text-xs text-default-400">{flow.project_id}</p>
          </div>
        );
      case "disabled":
        return (
          <div>
            <Chip
              className="capitalize"
              color={flow.disabled ? "danger" : "success"}
              radius="sm"
              size="sm"
              variant="flat"
            >
              {flow.disabled ? "Disabled" : "Active"}
            </Chip>
            {flow.disabled && (
              <p className="text-sm text-default-400">{flow.disabled_reason}</p>
            )}
          </div>
        );
      case "a_actions":
        return <p>{flow.actions.length}</p>;
      case "created_at":
        return new Date(flow.created_at).toLocaleString("de-DE");
      case "updated_at":
        return new Date(flow.updated_at).toLocaleString("de-DE");
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
                    description="Take a look on this flow"
                    startContent={
                      <EyeIcon className={cn(iconClasses, "text-primary")} />
                    }
                  >
                    View
                  </DropdownItem>
                </DropdownSection>
                <DropdownSection title="Edit Zone">
                  <DropdownItem
                    key="edit"
                    className="text-warning"
                    color="warning"
                    description="Apply changes to this flow"
                    startContent={
                      <EditDocumentIcon
                        className={cn(iconClasses, "text-warning")}
                      />
                    }
                  >
                    Edit
                  </DropdownItem>
                  {flow.disabled && (
                    <DropdownItem
                      key="disable"
                      className="text-success"
                      color="success"
                      description="Disable access to this flow for members"
                      startContent={
                        <LockIcon className={cn(iconClasses, "text-success")} />
                      }
                    >
                      Enable
                    </DropdownItem>
                  )}
                  {!flow.disabled && (
                    <DropdownItem
                      key="disable"
                      className="text-danger"
                      color="danger"
                      description="Disable access to this flow for members"
                      startContent={
                        <LockIcon className={cn(iconClasses, "text-danger")} />
                      }
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
                    description="Permanently delete this flow"
                    startContent={
                      <DeleteDocumentIcon
                        className={cn(iconClasses, "text-danger")}
                      />
                    }
                    onClick={() => {
                      setTargetFlow(flow);
                      deleteModal.onOpen();
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
          <p className="text-2xl mb-0">Flows</p>
        </div>
      </div>
      <Divider className="my-4" />
      <div>
        <Table aria-label="Example table with custom cells">
          <TableHeader>
            <TableColumn key="name" align="start">
              NAME
            </TableColumn>
            <TableColumn key="id" align="start">
              ID
            </TableColumn>
            <TableColumn key="project_id" align="start">
              PROJECT
            </TableColumn>
            <TableColumn key="runner_id" align="start">
              RUNNER
            </TableColumn>
            <TableColumn key="disabled" align="start">
              STATUS
            </TableColumn>
            <TableColumn key="a_actions" align="start">
              AVL. ACTIONS
            </TableColumn>
            <TableColumn key="created_at" align="start">
              CREATED AT
            </TableColumn>
            <TableColumn key="updated_at" align="start">
              UPDATED AT
            </TableColumn>
            <TableColumn key="actions" align="center">
              ACTIONS
            </TableColumn>
          </TableHeader>
          <TableBody emptyContent={"No rows to display."} items={flows}>
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
      <FunctionDeleteFlow disclosure={deleteModal} flow={targetFlow} />
    </main>
  );
}
