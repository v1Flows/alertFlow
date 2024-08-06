"use client";
import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  Button,
  CardFooter,
  useDisclosure,
  Chip,
  Spacer,
  Avatar,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Icon } from "@iconify/react";

import { IconWrapper } from "@/lib/IconWrapper";
import { EditDocumentIcon, InfoIcon, PlusIcon } from "@/components/icons";
import { CopyDocumentIcon } from "@/components/icons";
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
}: any) {
  const router = useRouter();

  const [viewLoading, setViewLoading] = React.useState(false);

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

  return (
    <main>
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold">Project List</p>
        <Button
          color="primary"
          isDisabled={
            !settings.create_projects || projects.length >= plan.projects
          }
          radius="lg"
          startContent={<PlusIcon />}
          variant="solid"
          onPress={() => newProjectModal.onOpen()}
        >
          Create New
        </Button>
      </div>
      <Spacer y={8} />
      {projects.error && (
        <Card className="shadow shadow-danger">
          <CardHeader className="justify-start gap-2 items-center">
            <IconWrapper className="bg-danger/10 text-danger">
              <InfoIcon className="text-lg" />
            </IconWrapper>
            <p className="text-md font-bold text-danger">Error</p>
          </CardHeader>
          <CardBody>
            <p>{projects.error}. Please try again later.</p>
          </CardBody>
        </Card>
      )}
      {!projects.error && (
        <>
          <div className="grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 gap-4">
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
                                  : "solar:question-square-broken"
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
                      <Dropdown backdrop="opaque">
                        <DropdownTrigger>
                          <Button isIconOnly size="sm" variant="light">
                            <Icon icon="solar:menu-dots-broken" width={24} />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu variant="flat">
                          <DropdownSection title="Actions">
                            <DropdownItem
                              startContent={<CopyDocumentIcon />}
                              onClick={() =>
                                copyProjectIDtoClipboard(project.id)
                              }
                            >
                              Copy ID
                            </DropdownItem>
                            <DropdownItem
                              showDivider
                              color="warning"
                              startContent={<EditDocumentIcon />}
                              onClick={() => {
                                setTargetProject(project);
                                editProjectModal.onOpen();
                              }}
                            >
                              Edit
                            </DropdownItem>
                          </DropdownSection>
                          <DropdownSection title="Danger Zone">
                            <DropdownItem
                              className="text-danger"
                              color="danger"
                              startContent={
                                <Icon
                                  icon="solar:trash-bin-trash-broken"
                                  width={16}
                                />
                              }
                              onClick={() => {
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
                      <Button
                        className="w-full font-bold items-center"
                        color={project.disabled ? "danger" : "primary"}
                        isLoading={viewLoading}
                        radius="sm"
                        variant="light"
                        onPress={() => {
                          setViewLoading(true);
                          router.push(`/dashboard/projects/${project.id}`);
                        }}
                      >
                        <Icon icon="solar:eye-broken" width={18} />
                        View Project
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </div>
            ))}
          </div>
          {pending_projects.length > 0 && (
            <>
              <Spacer y={4} />
              <SparklesText
                className="text-lg text-default-500"
                text="Pending Project Invitations"
              />
              <Spacer y={4} />
              <div className="grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 gap-4">
                {pending_projects.map((project: any) => (
                  <div key={project.id} className="col-span-1">
                    <Card fullWidth>
                      <CardHeader className="justify-between">
                        <div className="flex flex-col items-start">
                          <p className="text-md">{project.name}</p>
                          <p className="text-sm text-default-500">
                            {project.description}
                          </p>
                        </div>
                      </CardHeader>
                      <Divider />
                      <CardBody>
                        <div className="flex items-center justify-start gap-2 flex-wrap">
                          <Chip
                            color="secondary"
                            radius="sm"
                            size="sm"
                            variant="flat"
                          >
                            <p className="font-bold">ID: {project.id}</p>
                          </Chip>
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
                      </CardBody>
                      <CardFooter className="flex items-center justify-between gap-2">
                        <Button
                          className="w-full font-bold"
                          color="danger"
                          radius="sm"
                          variant="flat"
                          onPress={() => {
                            DeclineProjectInvite(project.id);
                            router.refresh();
                          }}
                        >
                          <Icon
                            icon="solar:danger-triangle-broken"
                            width={24}
                          />
                          Decline
                        </Button>
                        <Button
                          className="w-full font-bold"
                          color="success"
                          radius="sm"
                          variant="flat"
                          onPress={() => {
                            AcceptProjectInvite(project.id);
                            router.refresh();
                          }}
                        >
                          <Icon icon="solar:check-read-broken" width={24} />
                          Accept
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                ))}
              </div>
            </>
          )}
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
