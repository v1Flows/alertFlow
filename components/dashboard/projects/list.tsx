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
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Icon } from "@iconify/react";

import { IconWrapper } from "@/lib/IconWrapper";
import { EyeIcon, InfoIcon, PlusIcon } from "@/components/icons";
import {
  CopyDocumentIcon,
  DeleteDocumentIcon,
  VerticalDotsIcon,
} from "@/components/icons";
import DeleteProjectModal from "@/components/functions/projects/delete";
import CreateProjectModal from "@/components/functions/projects/create";
import SparklesText from "@/components/magicui/sparkles-text";

export function ProjectsList({ projects, pending_projects, settings }: any) {
  const router = useRouter();

  const [targetProject, setTargetProject] = React.useState({});
  const deleteProjectModal = useDisclosure();
  const newProjectModal = useDisclosure();

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
        <div className="flex items-center space-x-1">
          <p className="text-2xl font-bold mb-0 text-default-500">
            {projects.length}
          </p>
          <p className="text-2xl font-bold mb-0 text-primary">Projects</p>
        </div>
        <Button
          color="primary"
          isDisabled={!settings.create_projects}
          radius="sm"
          startContent={<PlusIcon />}
          variant="solid"
          onPress={() => newProjectModal.onOpen()}
        >
          New Project
        </Button>
      </div>
      <Divider className="mb-4 mt-4" />
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
                  className={`shadow hover:shadow-md ${project.disabled ? "hover:shadow-danger shadow-danger-200" : "hover:shadow-primary shadow-primary-200"}`}
                >
                  <CardHeader className="justify-between">
                    <div className="flex flex-col items-start">
                      <p className="text-md">{project.name}</p>
                      <p className="text-sm text-default-500">
                        {project.description}
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
                            onClick={() => copyProjectIDtoClipboard(project.id)}
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
                    <p className="text-small text-default-500 mt-2">
                      Created At:{" "}
                      {new Date(project.created_at).toLocaleString("de-DE")}
                    </p>
                  </CardBody>
                  <CardFooter>
                    <Button
                      className="w-full font-bold"
                      color={project.disabled ? "danger" : "primary"}
                      radius="sm"
                      variant="flat"
                      onPress={() =>
                        router.push(`/dashboard/projects/${project.id}`)
                      }
                    >
                      <EyeIcon />
                      Go to Project
                    </Button>
                  </CardFooter>
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
                                onClick={() =>
                                  copyProjectIDtoClipboard(project.id)
                                }
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
                        <p className="text-small text-default-500 mt-2">
                          Created At:{" "}
                          {new Date(project.created_at).toLocaleString("de-DE")}
                        </p>
                      </CardBody>
                      <CardFooter className="flex items-center justify-between gap-2">
                        <Button
                          className="w-full font-bold"
                          color="danger"
                          radius="sm"
                          variant="flat"
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
      <DeleteProjectModal
        disclosure={deleteProjectModal}
        project={targetProject}
      />
    </main>
  );
}
