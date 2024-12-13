"use client";
import React from "react";
import {
  Card,
  CardBody,
  Divider,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  Button,
  useDisclosure,
  Chip,
  Spacer,
  Avatar,
  Tooltip,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Icon } from "@iconify/react";

import DeleteProjectModal from "@/components/functions/projects/delete";
import CreateProjectModal from "@/components/functions/projects/create";
import SparklesText from "@/components/magicui/sparkles-text";
import AcceptProjectInvite from "@/lib/fetch/project/PUT/AcceptProjectInvite";
import DeclineProjectInvite from "@/lib/fetch/project/PUT/DeclineProjectInvite";
import EditProjectModal from "@/components/functions/projects/edit";

export function ProjectsList({
  projects,
  pending_projects,
  settings,
  plan,
  user,
}: any) {
  const router = useRouter();

  const [targetProject, setTargetProject] = React.useState({});
  const newProjectModal = useDisclosure();
  const editProjectModal = useDisclosure();
  const deleteProjectModal = useDisclosure();

  const copyProjectIDtoClipboard = (key: string) => {
    // eslint-disable-next-line no-undef
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      // eslint-disable-next-line no-undef
      navigator.clipboard.writeText(key);
      toast.success("Copied to clipboard!");
    } else {
      toast.error("Failed to copy project ID to clipboard");
    }
  };

  function createButtonDisabled() {
    if (!settings.create_projects) {
      return true;
    } else if (user.role === "vip") {
      return false;
    } else if (user.role === "admin") {
      return false;
    } else if (projects.length >= plan.projects) {
      return true;
    }

    return false;
  }

  function createButtonPressable() {
    if (!settings.create_projects) {
      return false;
    } else if (user.role === "vip") {
      return true;
    } else if (user.role === "admin") {
      return true;
    } else if (projects.length >= plan.projects) {
      return false;
    }

    return true;
  }

  return (
    <main>
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
        {projects.map((project: any) => (
          <div key={project.id} className="col-span-1">
            <Card
              fullWidth
              className={`shadow ${project.disabled ? "shadow-danger-200" : "shadow-primary-200"}`}
            >
              <CardBody>
                <div className="bg-default-100 rounded-large w-full flex items-center justify-between p-3">
                  <div className="flex items-center space-x-2">
                    <Avatar
                      classNames={{
                        base: `text-white`,
                      }}
                      icon={
                        <Icon
                          icon={
                            project.icon
                              ? project.icon
                              : "solar:question-square-outline"
                          }
                          width={24}
                        />
                      }
                      radius="md"
                      style={{
                        backgroundColor: project.color,
                      }}
                    />
                    <div className="flex flex-col items-start">
                      <p className="text-md font-bold">{project.name}</p>
                      <p className="text-sm text-default-500">
                        {project.description.length > 50 ? (
                          <Tooltip
                            content={project.description}
                            style={{ maxWidth: "450px" }}
                          >
                            <span>{project.description.slice(0, 50)}...</span>
                          </Tooltip>
                        ) : (
                          project.description
                        )}
                      </p>
                    </div>
                  </div>
                  <Dropdown backdrop="opaque">
                    <DropdownTrigger>
                      <Button isIconOnly size="sm" variant="light">
                        <Icon icon="solar:menu-dots-outline" width={24} />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu variant="flat">
                      <DropdownSection title="Actions">
                        <DropdownItem
                          key="copy"
                          startContent={
                            <Icon icon="solar:copy-outline" width={18} />
                          }
                          onPress={() => copyProjectIDtoClipboard(project.id)}
                        >
                          Copy ID
                        </DropdownItem>
                        <DropdownItem
                          key="edit"
                          showDivider
                          color="warning"
                          startContent={
                            <Icon
                              icon="solar:pen-new-square-outline"
                              width={18}
                            />
                          }
                          onPress={() => {
                            setTargetProject(project);
                            editProjectModal.onOpen();
                          }}
                        >
                          Edit
                        </DropdownItem>
                      </DropdownSection>
                      <DropdownSection title="Danger Zone">
                        <DropdownItem
                          key="delete"
                          className="text-danger"
                          color="danger"
                          startContent={
                            <Icon
                              icon="solar:trash-bin-trash-outline"
                              width={18}
                            />
                          }
                          onPress={() => {
                            setTargetProject(project);
                            deleteProjectModal.onOpen();
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
                  <Chip
                    color={project.disabled ? "danger" : "success"}
                    radius="sm"
                    size="sm"
                    variant="flat"
                  >
                    <p className="font-bold">
                      Status: {project.disabled ? "Disabled" : "Active"}
                    </p>
                  </Chip>
                  {project.disabled && (
                    <Chip color="danger" radius="sm" size="sm" variant="flat">
                      <p className="font-bold">
                        Disable Reason: {project.disabled_reason}
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
                    {new Date(project.created_at).toLocaleString("de-DE")}
                  </p>
                </div>
                <Spacer y={4} />
                <div className="flex flex-col gap-2 w-full">
                  <Divider />
                  <Button
                    className="w-full font-bold items-center"
                    color={project.disabled ? "danger" : "primary"}
                    radius="sm"
                    variant="light"
                    onPress={() => {
                      router.push(`/dashboard/projects/${project.id}`);
                    }}
                  >
                    <Icon icon="solar:eye-outline" width={18} />
                    View Project
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        ))}
        <Card
          isHoverable
          className="border border-primary border-3 border-dashed"
          isDisabled={createButtonDisabled()}
          isPressable={createButtonPressable()}
          onPress={() => newProjectModal.onOpen()}
        >
          <CardBody className="flex flex-col items-center justify-center gap-2">
            <div className="flex items-center rounded-large justify-center bg-primary bg-opacity-25 w-12 h-12">
              <Icon
                className="text-primary"
                icon="solar:add-square-outline"
                width={38}
              />
            </div>
            <p className="text-lg font-bold text-default-500">
              Create new project
            </p>
          </CardBody>
        </Card>
      </div>
      {pending_projects.length > 0 && (
        <>
          <Spacer y={4} />
          <SparklesText
            className="text-lg text-default-500"
            text="Pending Project Invitations"
          />
          <Spacer y={4} />
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
            {pending_projects.map((project: any) => (
              <div key={project.id} className="col-span-1">
                <Card fullWidth>
                  <CardBody>
                    <div className="bg-default-100 rounded-large w-full flex items-center justify-between p-3">
                      <div className="flex items-center space-x-2">
                        <Avatar
                          classNames={{
                            base: `text-white`,
                          }}
                          icon={
                            <Icon
                              icon={
                                project.icon
                                  ? project.icon
                                  : "solar:question-square-outline"
                              }
                              width={24}
                            />
                          }
                          radius="md"
                          style={{
                            backgroundColor: project.color,
                          }}
                        />
                        <div className="flex flex-col items-start">
                          <p className="text-md font-bold">{project.name}</p>
                          <p className="text-sm text-default-500">
                            {project.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Spacer y={4} />
                    <div className="flex items-center justify-start gap-2 flex-wrap">
                      <Chip
                        color={project.disabled ? "danger" : "success"}
                        radius="sm"
                        size="sm"
                        variant="flat"
                      >
                        <p className="font-bold">
                          Status: {project.disabled ? "Disabled" : "Active"}
                        </p>
                      </Chip>
                      {project.disabled && (
                        <Chip
                          color="danger"
                          radius="sm"
                          size="sm"
                          variant="flat"
                        >
                          <p className="font-bold">
                            Disable Reason: {project.disabled_reason}
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
                        {new Date(project.created_at).toLocaleString("de-DE")}
                      </p>
                    </div>
                    <Spacer y={4} />
                    <div className="flex flex-col gap-2 w-full">
                      <Divider />
                      <div className="grid grid-cols-2 items-center justify-between gap-2 w-full">
                        <Button
                          className="font-bold"
                          color="danger"
                          radius="sm"
                          variant="flat"
                          onPress={() => {
                            DeclineProjectInvite(project.id);
                            router.refresh();
                          }}
                        >
                          <Icon
                            icon="solar:danger-triangle-outline"
                            width={24}
                          />
                          Decline
                        </Button>
                        <Button
                          className="font-bold"
                          color="success"
                          radius="sm"
                          variant="flat"
                          onPress={() => {
                            AcceptProjectInvite(project.id);
                            router.refresh();
                          }}
                        >
                          <Icon icon="solar:check-read-outline" width={24} />
                          Accept
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            ))}
          </div>
        </>
      )}
      <CreateProjectModal disclosure={newProjectModal} />
      <EditProjectModal disclosure={editProjectModal} project={targetProject} />
      <DeleteProjectModal
        disclosure={deleteProjectModal}
        project={targetProject}
      />
    </main>
  );
}
