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
  Tooltip,
  CardHeader,
  CardFooter,
  Alert,
  AvatarGroup,
  Avatar,
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
import { PlusIcon } from "@/components/icons";

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

  function checkUserEditPermissions(project: any) {
    if (
      project.members.find((member: any) => member.user_id === user.id).role ===
      "Viewer"
    ) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <main>
      <Card>
        <CardBody>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-md font-bold text-primary">
              {projects.length}{" "}
              <span className="text-default-500 font-normal">
                Projects found
              </span>
            </p>
            <div className="flex items-center gap-4">
              <Button
                color="primary"
                isDisabled={createButtonDisabled()}
                variant="bordered"
                onPress={() => newProjectModal.onOpen()}
              >
                <PlusIcon />
                Add New
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
      <Spacer y={4} />
      <div className="grid lg:grid-cols-4 grid-cols-2 gap-4">
        {projects.map((project: any) => (
          <div key={project.id} className="col-span-1">
            <Card
              fullWidth
              isDisabled={project.disabled}
              isPressable={!project.disabled}
              style={{
                boxShadow: `1px 1px 0 0 ${project.color}`,
              }}
              onPress={() => {
                router.push(`/dashboard/projects/${project.id}`);
              }}
            >
              <CardHeader className="justify-between items-center p-3 pb-0">
                <Chip
                  color={project.disabled ? "danger" : "success"}
                  radius="sm"
                  size="sm"
                  variant="flat"
                >
                  <p className="font-bold">
                    {project.disabled ? "Disabled" : "Active"}
                  </p>
                </Chip>
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
                        isDisabled={
                          checkUserEditPermissions(project) || project.disabled
                        }
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
                        isDisabled={
                          checkUserEditPermissions(project) || project.disabled
                        }
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
              </CardHeader>
              <CardBody>
                {project.disabled && (
                  <>
                    <Alert
                      color="danger"
                      description={project.disabled_reason}
                      title="Disabled"
                      variant="flat"
                    />
                    <Spacer y={2} />
                  </>
                )}
                <Spacer y={2} />
                <div className="flex items-center gap-2">
                  <Icon
                    icon={
                      project.icon
                        ? project.icon
                        : "solar:question-square-outline"
                    }
                    width={32}
                  />
                  <p className="text-lg font-bold">{project.name}</p>
                </div>
                <Spacer y={2} />
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
                <Spacer y={3} />
                <Divider />
              </CardBody>
              <CardFooter className="flex items-center gap-2 justify-between text-default-500">
                <AvatarGroup isBordered className="pl-2" size="sm">
                  {project.members
                    .map((member: any) => (
                      <>
                        <Tooltip content={member.username}>
                          <Avatar
                            key={member.user_id}
                            showFallback
                            color={
                              member.role === "Owner"
                                ? "danger"
                                : member.role === "Editor"
                                  ? "primary"
                                  : "default"
                            }
                            name={member.username}
                          />
                        </Tooltip>
                      </>
                    ))
                    .slice(0, 5)}
                </AvatarGroup>
                <div className="flex items-center gap-1">
                  <Icon icon="solar:calendar-date-linear" width={26} />
                  <p className="text-sm">
                    {new Date(project.created_at).toLocaleString("de-DE")}
                  </p>
                </div>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
      {pending_projects.length > 0 && (
        <>
          <Spacer y={4} />
          <SparklesText
            className="text-lg"
            text="Pending Project Invitations"
          />
          <Spacer y={4} />
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
            {pending_projects.map((project: any) => (
              <div key={project.id} className="col-span-1">
                <Card fullWidth>
                  <CardBody>
                    <div className="flex items-center gap-2">
                      <Icon
                        icon={
                          project.icon
                            ? project.icon
                            : "solar:question-square-outline"
                        }
                        style={{ color: project.color }}
                        width={32}
                      />
                      <p className="text-lg font-bold">{project.name}</p>
                    </div>
                    <Spacer y={2} />
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
                    <Spacer y={3} />
                    <Divider />
                  </CardBody>
                  <CardFooter className="flex items-center gap-2">
                    <Button
                      fullWidth
                      color="danger"
                      variant="flat"
                      onPress={() => {
                        DeclineProjectInvite(project.id);
                        router.refresh();
                      }}
                    >
                      <Icon icon="solar:danger-triangle-outline" width={24} />
                      Decline
                    </Button>
                    <Button
                      fullWidth
                      color="success"
                      variant="flat"
                      onPress={() => {
                        AcceptProjectInvite(project.id);
                        router.refresh();
                      }}
                    >
                      <Icon icon="solar:check-read-outline" width={24} />
                      Accept
                    </Button>
                  </CardFooter>
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
