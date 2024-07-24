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
} from "@nextui-org/react";
import { useRouter } from "next/navigation";

import {
  VerticalDotsIcon,
  DeleteDocumentIcon,
  CopyDocumentIcon,
  EyeIcon,
  InfoIcon,
  PlusIcon,
} from "@/components/icons";
import { IconWrapper } from "@/lib/IconWrapper";
import FunctionDeleteFlow from "@/components/functions/flows/deleteFlow";
import FunctionCreateFlow from "@/components/functions/flows/create";

export default function FlowList({ flows, projects, settings }: any) {
  const router = useRouter();

  const [projectFilter, setProjectFilter] = React.useState(new Set([]) as any);

  const [deleteFlow, setDeleteFlow] = React.useState({} as any);
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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <p className="text-2xl font-bold mb-0 text-default-500">
            {flows.length}
          </p>
          <p className="text-2xl font-bold mb-0 text-primary">Flows</p>
        </div>
        <div className="flex items-center justify-end gap-4">
          <Select
            className="w-64"
            placeholder="Select an project"
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
            isDisabled={!settings.create_flows}
            radius="sm"
            startContent={<PlusIcon />}
            variant="solid"
            onPress={() => newModal.onOpen()}
          >
            New Flow
          </Button>
        </div>
      </div>
      <Divider className="mb-4 mt-4" />
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
                    <DropdownMenu>
                      <DropdownSection title="Actions">
                        <DropdownItem
                          startContent={<CopyDocumentIcon />}
                          onClick={() => copyFlowIDtoClipboard(flow.id)}
                        >
                          Copy ID
                        </DropdownItem>
                      </DropdownSection>
                      <DropdownSection title="Danger zone">
                        <DropdownItem
                          className="text-danger"
                          color="danger"
                          startContent={<DeleteDocumentIcon />}
                          onClick={() => {
                            setDeleteFlow(flow);
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
      <FunctionDeleteFlow disclosure={deleteModal} flow={deleteFlow} />
    </main>
  );
}
