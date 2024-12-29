"use client";
import { Icon } from "@iconify/react";
import {
  Button,
  Chip,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Pagination,
  Snippet,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React from "react";

import ChangeFlowMaintenanceModal from "@/components/functions/flows/changeMaintenance";
import ChangeFlowStatusModal from "@/components/functions/flows/changeStatus";
import FunctionCreateFlow from "@/components/functions/flows/create";
import FunctionDeleteFlow from "@/components/functions/flows/deleteFlow";
import EditFlowModal from "@/components/functions/flows/edit";
import { PlusIcon } from "@/components/icons";

export function FlowsList({ flows, projects, runners }: any) {
  const router = useRouter();

  const [status, setStatus] = React.useState(false);
  const [maintenance, setMaintenance] = React.useState(false);
  const [targetFlow, setTargetFlow] = React.useState({} as any);
  const createModal = useDisclosure();
  const editModal = useDisclosure();
  const changeMaintenanceModal = useDisclosure();
  const changeStatusModal = useDisclosure();
  const deleteModal = useDisclosure();

  // pagination
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 7;
  const pages = Math.ceil(flows.length / rowsPerPage);
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return flows.slice(start, end);
  }, [page, flows]);

  const renderCell = React.useCallback((flow: any, columnKey: any) => {
    const cellValue = flow[columnKey];

    switch (columnKey) {
      case "id":
        return (
          <Snippet hideSymbol size="sm" variant="flat">
            {cellValue}
          </Snippet>
        );
      case "name":
        return (
          <div>
            <p className="font-bold">{flow.name}</p>
            <p className="text-sm text-default-500">{flow.description}</p>
          </div>
        );
      case "project_id":
        return (
          <div>
            <p>{projects.find((p: any) => p.id === flow.project_id)?.name}</p>
            <p className="text-xs text-default-400">{flow.project_id}</p>
          </div>
        );
      case "runner_id":
        return (
          <div>
            {flow.runner_id !== "any" ? (
              <>
                <p>{runners.find((r: any) => r.id === flow.runner_id)?.name}</p>
                <p className="text-xs text-default-400">{flow.runner_id}</p>
              </>
            ) : (
              <p>Any</p>
            )}
          </div>
        );
      case "disabled":
        return (
          <div>
            <Chip
              className="capitalize"
              color={
                flow.disabled
                  ? "danger"
                  : flow.maintenance
                    ? "warning"
                    : "success"
              }
              radius="sm"
              size="sm"
              variant="flat"
            >
              {flow.disabled
                ? "Disabled"
                : flow.maintenance
                  ? "Maintenance"
                  : "Enabled"}
            </Chip>
            {flow.disabled && (
              <p className="text-sm text-default-400">{flow.disabled_reason}</p>
            )}
            {flow.maintenance && (
              <p className="text-sm text-default-400">
                {flow.maintenance_message}
              </p>
            )}
          </div>
        );
      case "created_at":
        return new Date(flow.created_at).toLocaleString("de-DE");
      case "updated_at":
        return new Date(flow.updated_at).toLocaleString("de-DE");
      case "actions":
        return (
          <div className="relative flex items-center justify-center gap-2">
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
                <DropdownSection showDivider title="Actions">
                  <DropdownItem
                    key="view"
                    color="primary"
                    startContent={<Icon icon="solar:eye-broken" width={20} />}
                    onPress={() => router.push(`/dashboard/flows/${flow.id}`)}
                  >
                    View
                  </DropdownItem>
                </DropdownSection>
                <DropdownSection title="Edit Zone">
                  <DropdownItem
                    key="edit"
                    className="text-warning"
                    color="warning"
                    startContent={
                      <Icon icon="solar:pen-new-square-broken" width={20} />
                    }
                    onPress={() => {
                      setTargetFlow(flow);
                      editModal.onOpen();
                    }}
                  >
                    Edit
                  </DropdownItem>
                  {flow.maintenance ? (
                    <DropdownItem
                      key="disable"
                      className="text-warning"
                      color="warning"
                      startContent={
                        <Icon icon="solar:bomb-emoji-broken" width={20} />
                      }
                      onPress={() => {
                        setTargetFlow(flow);
                        setMaintenance(false);
                        changeMaintenanceModal.onOpen();
                      }}
                    >
                      Remove Maintenance
                    </DropdownItem>
                  ) : (
                    <DropdownItem
                      key="disable"
                      className="text-warning"
                      color="warning"
                      startContent={
                        <Icon icon="solar:bomb-emoji-broken" width={20} />
                      }
                      onPress={() => {
                        setTargetFlow(flow);
                        setMaintenance(true);
                        changeMaintenanceModal.onOpen();
                      }}
                    >
                      Set Maintenance
                    </DropdownItem>
                  )}
                  {flow.disabled && (
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
                        setTargetFlow(flow);
                        setStatus(false);
                        changeStatusModal.onOpen();
                      }}
                    >
                      Enable
                    </DropdownItem>
                  )}
                  {!flow.disabled && (
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
                        setTargetFlow(flow);
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
          <p className="mb-0 text-2xl font-bold text-danger">Admin</p>
          <p className="mb-0 text-2xl">|</p>
          <p className="mb-0 text-2xl">Flows</p>
        </div>
        <Button
          color="primary"
          radius="lg"
          startContent={<PlusIcon />}
          variant="solid"
          onPress={() => createModal.onOpen()}
        >
          New Flow
        </Button>
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
            <TableColumn key="name" align="start">
              Name
            </TableColumn>
            <TableColumn key="id" align="start">
              ID
            </TableColumn>
            <TableColumn key="project_id" align="start">
              Project
            </TableColumn>
            <TableColumn key="runner_id" align="start">
              Runner
            </TableColumn>
            <TableColumn key="disabled" align="start">
              Status
            </TableColumn>
            <TableColumn key="created_at" align="start">
              Created At
            </TableColumn>
            <TableColumn key="updated_at" align="start">
              Updated At
            </TableColumn>
            <TableColumn key="actions" align="center">
              Actions
            </TableColumn>
          </TableHeader>
          <TableBody emptyContent="No rows to display." items={items}>
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
      <FunctionCreateFlow disclosure={createModal} projects={projects} />
      <EditFlowModal
        disclosure={editModal}
        flow={targetFlow}
        projects={projects}
      />
      <ChangeFlowStatusModal
        disclosure={changeStatusModal}
        flow={targetFlow}
        status={status}
      />
      <ChangeFlowMaintenanceModal
        disclosure={changeMaintenanceModal}
        flow={targetFlow}
        maintenance={maintenance}
      />
      <FunctionDeleteFlow disclosure={deleteModal} flow={targetFlow} />
    </main>
  );
}
