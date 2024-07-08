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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Snippet,
  useDisclosure,
  Chip,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";

import { IconWrapper } from "@/lib/IconWrapper";
import { EyeIcon, InfoIcon } from "@/components/icons";
import {
  CopyDocumentIcon,
  DeleteDocumentIcon,
  VerticalDotsIcon,
} from "@/components/icons";
import DeleteProject from "@/lib/fetch/project/DELETE/DeleteProject";

import NewProjectModal from "./create";

export function ProjectsList({ projects, settings }: any) {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [projectToDelete, setProjectToDelete] = React.useState("");

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

  function deleteProjectModal(id: string) {
    setProjectToDelete(id);
    onOpenChange();
  }

  function deleteProject() {
    onOpenChange();
    DeleteProject(projectToDelete);
    router.refresh();
  }

  return (
    <main>
      <Toaster richColors position="bottom-center" />
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <p className="text-2xl font-bold mb-0 text-default-500">
            {projects.length}
          </p>
          <p className="text-2xl font-bold mb-0 text-primary">Projects</p>
        </div>
        <NewProjectModal settings={settings} />
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
        <div className="grid lg:grid-cols-2 gap-4">
          {projects.map((project: any) => (
            <div key={project.id} className="col-span-1">
              <Card
                fullWidth
                className="hover:shadow-md hover:shadow-primary shadow shadow-primary-200"
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
                          onClick={() => deleteProjectModal(project.id)}
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
                      <Chip color="danger" radius="sm" size="sm" variant="flat">
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
                    color="primary"
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
      )}
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        placement="center"
        onOpenChange={onOpenChange}
      >
        <ModalContent className="w-full">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-danger">
                Are you sure?
              </ModalHeader>
              <ModalBody>
                <p>
                  You are about to delete the following project which{" "}
                  <span className="font-bold">cannot be undone</span>:
                </p>
                <Divider />
                <Snippet hideCopyButton hideSymbol>
                  <span>
                    Name:{" "}
                    {
                      projects.find(
                        (project: any) => project.id === projectToDelete,
                      ).name
                    }
                  </span>
                  <span>ID: {projectToDelete}</span>
                </Snippet>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="bordered" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="danger" variant="solid" onPress={deleteProject}>
                  DELETE
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </main>
  );
}
