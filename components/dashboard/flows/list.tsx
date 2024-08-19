"use client";
import React from "react";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
  Button,
  Chip,
  useDisclosure,
  Select,
  SelectItem,
  Spacer,
  Input,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";

import { EyeIcon, InfoIcon } from "@/components/icons";
import { IconWrapper } from "@/lib/IconWrapper";
import FunctionDeleteFlow from "@/components/functions/flows/deleteFlow";
import FunctionCreateFlow from "@/components/functions/flows/create";
import ChangeFlowMaintenanceModal from "@/components/functions/flows/changeMaintenance";
import ChangeFlowStatusModal from "@/components/functions/flows/changeStatus";
import EditFlowModal from "@/components/functions/flows/edit";

export default function FlowList({
  flows,
  projects,
  settings,
  plan,
  user,
}: any) {
  const router = useRouter();

  const [projectFilter, setProjectFilter] = React.useState(new Set([]) as any);
  const [search, setSearch] = React.useState("");

  const [status, setStatus] = React.useState(false);
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
    // eslint-disable-next-line no-undef
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      // eslint-disable-next-line no-undef
      navigator.clipboard.writeText(key);
      toast.success("Copied to clipboard!");
    } else {
      toast.error("Failed to copy flow ID to clipboard");
    }
  };

  function createButtonDisabled() {
    if (!settings.create_flows) {
      return true;
    } else if (user.role === "VIP") {
      return false;
    } else if (flows.length >= plan.flows) {
      return true;
    }

    return false;
  }

  function createButtonPressable() {
    if (!settings.create_flows) {
      return false;
    } else if (user.role === "VIP") {
      return true;
    } else if (flows.length >= plan.flows) {
      return false;
    }

    return true;
  }


  return (
    <main>
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-2 items-center justify-between">
        <p className="text-2xl font-bold">Flow List</p>
        <div className="flex flex-cols justify-end items-center gap-4">
          <Input
            className="max-w-xs"
            placeholder="Search"
            radius="sm"
            size="md"
            startContent={<Icon icon="solar:minimalistic-magnifer-broken" />}
            value={search}
            variant="flat"
            onValueChange={setSearch}
          />
          <Select
            className="max-w-xs"
            placeholder="Project Filter"
            radius="sm"
            selectedKeys={projectFilter}
            selectionMode="multiple"
            variant="faded"
            onSelectionChange={(keys) => setProjectFilter(keys as any)}
          >
            {projects
              .map((project: any) => (
                <SelectItem key={project.id}>{project.name}</SelectItem>
              ))
              .sort()}
          </Select>
        </div>
      </div>
      <Spacer y={8} />
      {flows.error && (
        <Card className="shadow shadow-danger">
          <CardHeader className="justify-start gap-2 items-center">
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
        <div className="grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 gap-4">
          {filteredFlows.map((flow: any) => (
            <div key={flow.id} className="col-span-1">
              <Card
                fullWidth
                className={`shadow ${flow.disabled ? "shadow-danger-200" : "shadow-primary-200"}`}
              >
                <CardBody>
                  <div className="bg-default-100 rounded-large w-full flex items-center justify-between p-3">
                    <div className="flex flex-col items-start">
                      <p className="text-md font-bold">{flow.name}</p>
                      <p className="text-sm text-default-500">
                        {flow.description}
                      </p>
                    </div>
                    <Dropdown backdrop="opaque">
                      <DropdownTrigger>
                        <Button isIconOnly size="sm" variant="light">
                          <Icon icon="solar:menu-dots-broken" width={24} />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu variant="flat">
                        <DropdownSection title="Actions">
                          <DropdownItem
                            color="primary"
                            startContent={
                              <Icon icon="solar:copy-broken" width={20} />
                            }
                            onClick={() => copyFlowIDtoClipboard(flow.id)}
                          >
                            Copy ID
                          </DropdownItem>
                          <DropdownItem
                            key="edit"
                            color="warning"
                            startContent={
                              <Icon
                                icon="solar:pen-new-square-broken"
                                width={20}
                              />
                            }
                            onClick={() => {
                              setTargetFlow(flow);
                              editModal.onOpen();
                            }}
                          >
                            Edit
                          </DropdownItem>
                          {flow.maintenance_required ? (
                            <DropdownItem
                              key="disable"
                              color="warning"
                              startContent={
                                <Icon
                                  icon="solar:bomb-emoji-broken"
                                  width={20}
                                />
                              }
                              onClick={() => {
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
                              startContent={
                                <Icon
                                  icon="solar:bomb-emoji-broken"
                                  width={20}
                                />
                              }
                              onClick={() => {
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
                          {flow.disabled ? (
                            <DropdownItem
                              key="disable"
                              className="text-success"
                              color="success"
                              startContent={
                                <Icon
                                  icon="solar:lock-keyhole-unlocked-broken"
                                  width={20}
                                />
                              }
                              onClick={() => {
                                setTargetFlow(flow);
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
                                  icon="solar:lock-keyhole-broken"
                                  width={20}
                                />
                              }
                              onClick={() => {
                                setTargetFlow(flow);
                                setStatus(true);
                                changeStatusModal.onOpen();
                              }}
                            >
                              Disable
                            </DropdownItem>
                          )}
                          <DropdownItem
                            className="text-danger"
                            color="danger"
                            startContent={
                              <Icon
                                icon="solar:trash-bin-2-broken"
                                width={20}
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
                  <Spacer y={4} />
                  <div className="flex items-center justify-start gap-2 flex-wrap">
                    <Chip color="primary" radius="sm" size="sm" variant="flat">
                      <p className="font-bold">
                        Project:{" "}
                        {projects.map(
                          (project: any) =>
                            project.id === flow.project_id && project.name,
                        )}
                      </p>
                    </Chip>
                    <Chip
                      color={flow.disabled ? "danger" : "success"}
                      radius="sm"
                      size="sm"
                      variant="flat"
                    >
                      <p className="font-bold">
                        Status: {flow.disabled ? "Disabled" : "Active"}
                      </p>
                    </Chip>
                    {flow.disabled && (
                      <Chip color="danger" radius="sm" size="sm" variant="flat">
                        <p className="font-bold">
                          Disable Reason: {flow.disabled_reason}
                        </p>
                      </Chip>
                    )}
                    {flow.maintenance_required && (
                      <Chip
                        color="warning"
                        radius="sm"
                        size="sm"
                        variant="flat"
                      >
                        <p className="font-bold">
                          Maintenance Required:{" "}
                          <span className="capitalize">
                            {flow.maintenance_message}
                          </span>
                        </p>
                      </Chip>
                    )}
                  </div>
                  <Spacer y={2} />
                  <div className="flex flex-wrap items-center justify-start gap-2">
                    <p className="text-sm font-bold text-default-500">
                      Created At:
                    </p>
                    <p className="text-default-500 text-sm">
                      {new Date(flow.created_at).toLocaleString("de-DE")}
                    </p>
                  </div>
                  <Spacer y={4} />
                  <Divider />
                  <Spacer y={2} />
                  <Button
                    className="w-full font-bold"
                    color={flow.disabled ? "danger" : "primary"}
                    radius="sm"
                    variant="light"
                    onPress={() => router.push(`/dashboard/flows/${flow.id}`)}
                  >
                    <EyeIcon />
                    Go to Flow
                  </Button>
                </CardBody>
              </Card>
            </div>
          ))}
          <Card
            isHoverable
            className="border border-primary border-3 border-dashed"
            isDisabled={createButtonDisabled()}
            isPressable={createButtonPressable()}
            onPress={() => newModal.onOpen()}
          >
            <CardBody className="flex flex-col items-center justify-center gap-2">
              <div className="flex items-center rounded-large justify-center bg-primary bg-opacity-25 w-12 h-12">
                <Icon
                  className="text-primary"
                  icon="solar:add-square-broken"
                  width={38}
                />
              </div>
              <p className="text-lg font-bold text-default-500">
                Create new flow
              </p>
            </CardBody>
          </Card>
        </div>
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
