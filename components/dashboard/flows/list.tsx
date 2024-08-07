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
  CardFooter,
  useDisclosure,
  Select,
  SelectItem,
  Spacer,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";

import {
  VerticalDotsIcon,
  EyeIcon,
  InfoIcon,
  PlusIcon,
} from "@/components/icons";
import { IconWrapper } from "@/lib/IconWrapper";
import FunctionDeleteFlow from "@/components/functions/flows/deleteFlow";
import FunctionCreateFlow from "@/components/functions/flows/create";
import ChangeFlowMaintenanceModal from "@/components/functions/flows/changeMaintenance";
import ChangeFlowStatusModal from "@/components/functions/flows/changeStatus";
import EditFlowModal from "@/components/functions/flows/edit";

export default function FlowList({ flows, projects, settings, plan }: any) {
  const router = useRouter();

  const [projectFilter, setProjectFilter] = React.useState(new Set([]) as any);

  const [status, setStatus] = React.useState(false);
  const [maintenance, setMaintenance] = React.useState(false);
  const [targetFlow, setTargetFlow] = React.useState({} as any);
  const editModal = useDisclosure();
  const changeStatusModal = useDisclosure();
  const changeMaintenanceModal = useDisclosure();
  const deleteModal = useDisclosure();
  const newModal = useDisclosure();

  const filteredFlows = flows.filter((flow: any) => {
    if (projectFilter.size === 0) {
      return true;
    }

    return projectFilter.has(flow.project_id);
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

  return (
    <main>
      <div className="grid grid-cols-2 items-center justify-between">
        <p className="text-2xl font-bold">Flow List</p>
        <div className="col-span-1 flex justify-end items-center gap-4">
          <Select
            className="max-w-xs"
            placeholder="Project"
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
          <Button
            color="primary"
            isDisabled={!settings.create_flows || flows.length >= plan.flows}
            radius="lg"
            startContent={<PlusIcon />}
            variant="solid"
            onPress={() => newModal.onOpen()}
          >
            New Flow
          </Button>
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
                className={`shadow hover:shadow-md ${flow.disabled ? "hover:shadow-danger shadow-danger-200" : "hover:shadow-primary shadow-primary-200"}`}
              >
                <CardHeader className="justify-between">
                  <div className="flex flex-col items-start">
                    <p className="text-md">{flow.name}</p>
                    <p className="text-sm text-default-500">
                      {flow.description}
                    </p>
                  </div>
                  <Dropdown backdrop="opaque">
                    <DropdownTrigger>
                      <Button isIconOnly size="sm" variant="light">
                        <VerticalDotsIcon
                          className="text-default-300"
                          height={undefined}
                          width={undefined}
                        />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu variant="faded">
                      <DropdownSection title="Interact">
                        <DropdownItem
                          className="text-primary"
                          color="primary"
                          startContent={
                            <Icon icon="solar:copy-broken" width={20} />
                          }
                          onClick={() => copyFlowIDtoClipboard(flow.id)}
                        >
                          Copy ID
                        </DropdownItem>
                      </DropdownSection>
                      <DropdownSection title="Modify">
                        <DropdownItem
                          key="edit"
                          className="text-warning"
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
                            className="text-warning"
                            color="warning"
                            startContent={
                              <Icon icon="solar:bomb-emoji-broken" width={20} />
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
                            className="text-warning"
                            color="warning"
                            startContent={
                              <Icon icon="solar:bomb-emoji-broken" width={20} />
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
                            <Icon icon="solar:trash-bin-2-broken" width={20} />
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
                </CardHeader>
                <Divider />
                <CardBody>
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
                      color="secondary"
                      radius="sm"
                      size="sm"
                      variant="flat"
                    >
                      <p className="font-bold">ID: {flow.id}</p>
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
                  <div className="flex items-end justify-between">
                    <p className="text-small text-default-500 mt-2">
                      Updated At:{" "}
                      {new Date(flow.updated_at).toLocaleString("de-DE")}
                    </p>
                    <p className="text-small text-default-500 mt-2">
                      Created At:{" "}
                      {new Date(flow.created_at).toLocaleString("de-DE")}
                    </p>
                  </div>
                </CardBody>
                <CardFooter>
                  <Button
                    className="w-full font-bold"
                    color={flow.disabled ? "danger" : "primary"}
                    radius="sm"
                    variant="flat"
                    onPress={() => router.push(`/dashboard/flows/${flow.id}`)}
                  >
                    <EyeIcon />
                    Go to Flow
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))}
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
