"use client";
import { Icon } from "@iconify/react";
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
  Spacer,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

import ChangeFlowMaintenanceModal from "@/components/functions/flows/changeMaintenance";
import ChangeFlowStatusModal from "@/components/functions/flows/changeStatus";
import FunctionCreateFlow from "@/components/functions/flows/create";
import FunctionDeleteFlow from "@/components/functions/flows/deleteFlow";
import EditFlowModal from "@/components/functions/flows/edit";
import { InfoIcon, PlusIcon } from "@/components/icons";
import { IconWrapper } from "@/lib/IconWrapper";

export default function FlowList({ flows, projects, settings, user }: any) {
  const router = useRouter();

  const [projectFilter, setProjectFilter] = React.useState(new Set([]) as any);
  const [search, setSearch] = React.useState("");

  const [status] = React.useState(false);
  const [maintenance, setMaintenance] = React.useState(false);
  const [targetFlow, setTargetFlow] = React.useState({} as any);
  const editModal = useDisclosure();
  const changeStatusModal = useDisclosure();
  const changeMaintenanceModal = useDisclosure();
  const deleteModal = useDisclosure();
  const newModal = useDisclosure();

  const filteredFlows = flows
    .filter((flow: any) => {
      if (projectFilter.size === 0 && !search) {
        return true;
      }

      if (projectFilter.has(flow.project_id)) {
        return true;
      }

      if (search && flow.name.toLowerCase().includes(search.toLowerCase())) {
        return true;
      }

      return false;
    })
    .sort((a: any, b: any) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1;
      }
      if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return 1;
      }

      return 0;
    });

  const copyFlowIDtoClipboard = (key: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(key);
      toast.success("Copied to clipboard!");
    } else {
      toast.error("Failed to copy flow ID to clipboard");
    }
  };

  function createButtonDisabled() {
    if (!settings.create_flows) {
      return true;
    } else if (user.role === "vip") {
      return false;
    } else if (user.role === "admin") {
      return false;
    }

    return false;
  }

  function checkUserCanEdit(flow: any) {
    if (
      projects
        .filter((project: any) => project.id === flow.project_id)
        .map(
          (project: any) =>
            project.members.find((member: any) => member.user_id === user.id)
              .role,
        )[0] === "Viewer"
    ) {
      return false;
    } else {
      return true;
    }
  }

  return (
    <main>
      <div className="grid grid-cols-1 items-center justify-between gap-2 lg:grid-cols-2">
        <p className="text-2xl font-bold">Flows</p>
      </div>
      <Spacer y={4} />
      {flows.error && (
        <Card className="shadow shadow-danger">
          <CardHeader className="items-center justify-start gap-2">
            <IconWrapper className="bg-danger/10 text-danger">
              <InfoIcon className="text-lg" />
            </IconWrapper>
            <p className="text-md font-bold text-danger">Error</p>
          </CardHeader>
          <CardBody>
            <p>{flows.error}. Please try again later.</p>
          </CardBody>
        </Card>
      )}
      {!flows.error && (
        <>
          <Card>
            <CardBody>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-md font-bold text-primary">
                  {filteredFlows.length}{" "}
                  <span className="font-normal text-default-500">
                    Flows found
                  </span>
                </p>
                <div className="flex items-center gap-4">
                  <Popover placement="bottom">
                    <PopoverTrigger>
                      <Button
                        startContent={
                          <Icon
                            icon="solar:sort-horizontal-linear"
                            width={22}
                          />
                        }
                        variant="bordered"
                      >
                        Filter & Sort
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="flex items-center gap-4 p-3">
                      <Input
                        className="max-w-xs"
                        placeholder="Search"
                        radius="sm"
                        size="sm"
                        startContent={
                          <Icon icon="solar:minimalistic-magnifer-outline" />
                        }
                        value={search}
                        variant="flat"
                        onValueChange={setSearch}
                      />
                      <Divider />
                      <Select
                        className="max-w-xs"
                        placeholder="Project Filter"
                        radius="sm"
                        selectedKeys={projectFilter}
                        selectionMode="multiple"
                        size="sm"
                        variant="flat"
                        onSelectionChange={(keys) =>
                          setProjectFilter(keys as any)
                        }
                      >
                        {projects
                          .map((project: any) => (
                            <SelectItem key={project.id}>
                              {project.name}
                            </SelectItem>
                          ))
                          .sort()}
                      </Select>
                    </PopoverContent>
                  </Popover>
                  <Button
                    color="primary"
                    isDisabled={createButtonDisabled()}
                    variant="bordered"
                    onPress={() => newModal.onOpen()}
                  >
                    <PlusIcon />
                    Add New
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
          <Spacer y={4} />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
            {filteredFlows.map((flow: any) => (
              <div key={flow.id} className="col-span-1">
                <Card
                  fullWidth
                  isDisabled={flow.disabled}
                  isPressable={!flow.disabled}
                  onPress={() => router.push(`/flows/${flow.id}`)}
                >
                  <CardHeader className="items-center justify-between p-3 pb-0">
                    <div className="flex items-center text-default-500 gap-2">
                      <Icon
                        icon={
                          projects.find(
                            (project: any) => project.id === flow.project_id,
                          ).icon || "hugeicons:bubble-chat-question"
                        }
                        width={20}
                      />
                      <p className="text-sm">
                        {projects.map(
                          (project: any) =>
                            project.id === flow.project_id && project.name,
                        )}
                      </p>
                    </div>
                    <Dropdown backdrop="opaque">
                      <DropdownTrigger>
                        <Button isIconOnly size="sm" variant="light">
                          <Icon icon="solar:menu-dots-bold" width={24} />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu variant="flat">
                        <DropdownSection title="Actions">
                          <DropdownItem
                            key="copy"
                            color="primary"
                            startContent={
                              <Icon icon="solar:copy-outline" width={20} />
                            }
                            onPress={() => copyFlowIDtoClipboard(flow.id)}
                          >
                            Copy ID
                          </DropdownItem>
                          <DropdownItem
                            key="edit"
                            color="warning"
                            isDisabled={
                              flow.disabled || !checkUserCanEdit(flow)
                            }
                            startContent={
                              <Icon
                                icon="hugeicons:pencil-edit-02"
                                width={20}
                              />
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
                              color="warning"
                              isDisabled={
                                flow.disabled || !checkUserCanEdit(flow)
                              }
                              startContent={
                                <Icon
                                  icon="solar:bomb-emoji-outline"
                                  width={20}
                                />
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
                              color="warning"
                              isDisabled={
                                flow.disabled || !checkUserCanEdit(flow)
                              }
                              startContent={
                                <Icon
                                  icon="solar:bomb-emoji-outline"
                                  width={20}
                                />
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
                        </DropdownSection>
                        <DropdownSection title="Danger zone">
                          <DropdownItem
                            key="delete"
                            className="text-danger"
                            color="danger"
                            isDisabled={
                              flow.disabled || !checkUserCanEdit(flow)
                            }
                            startContent={
                              <Icon
                                icon="hugeicons:delete-02"
                                width={20}
                              />
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
                  </CardHeader>
                  <CardBody>
                    {flow.maintenance && (
                      <>
                        <Alert
                          color="warning"
                          description={flow.maintenance_message}
                          title="Maintenance"
                          variant="flat"
                        />
                        <Spacer y={2} />
                      </>
                    )}
                    {flow.disabled && (
                      <>
                        <Alert
                          color="danger"
                          description={flow.disabled_reason}
                          title="Disabled"
                          variant="flat"
                        />
                        <Spacer y={2} />
                      </>
                    )}
                    <div className="flex flex-cols items-end justify-between gap-2">
                      <div>
                        <p className="text-lg font-bold">{flow.name}</p>
                        <p className="text-sm text-default-500">
                          {flow.description.length > 50 ? (
                            <Tooltip
                              content={flow.description}
                              style={{ maxWidth: "450px" }}
                            >
                              <span>
                                {flow.description.slice(0, 50)}
                                ...
                              </span>
                            </Tooltip>
                          ) : (
                            flow.description
                          )}
                        </p>
                      </div>
                      <Chip
                        color={
                          flow.disabled
                            ? "danger"
                            : flow.maintenance
                              ? "warning"
                              : "success"
                        }
                        radius="sm"
                        size="sm"
                        variant="light"
                      >
                        <p className="font-bold">
                          {flow.disabled
                            ? "Disabled"
                            : flow.maintenance
                              ? "Maintenance"
                              : "Active"}
                        </p>
                      </Chip>
                    </div>
                  </CardBody>
                </Card>
              </div>
            ))}
          </div>
        </>
      )}
      <FunctionCreateFlow disclosure={newModal} projects={projects} />
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
