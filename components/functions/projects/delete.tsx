"use client";

import type { UseDisclosureReturn } from "@nextui-org/use-disclosure";

import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Snippet,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

import DeleteProject from "@/lib/fetch/project/DELETE/DeleteProject";
import { Icon } from "@iconify/react";

export default function DeleteProjectModal({
  disclosure,
  project,
}: {
  disclosure: UseDisclosureReturn;
  project: any;
}) {
  const router = useRouter();
  const { isOpen, onOpenChange } = disclosure;

  const [isLoading, setIsLoading] = React.useState(false);

  async function deleteProject() {
    setIsLoading(true);
    const response = await DeleteProject(project.id);

    if (!response.error) {
      router.refresh();
      onOpenChange();
      setIsLoading(false);
      toast.success("Project deleted successfully");
    } else {
      setIsLoading(false);
      toast.error("Failed to delete project");
    }
  }

  return (
    <>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        placement="center"
        onOpenChange={onOpenChange}
        size="lg"
      >
        <ModalContent className="w-full">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 items-center text-danger">
                <Icon icon="solar:danger-triangle-broken" width={58} />
                Are you sure?
              </ModalHeader>
              <ModalBody>
                <p className="text-center">
                  You are about to delete the following project which{" "}
                  <span className="font-bold">cannot be undone</span>:
                </p>
                <Divider />
                <Snippet hideCopyButton hideSymbol>
                  <span>Name: {project.name}</span>
                  <span>ID: {project.id}</span>
                </Snippet>
              </ModalBody>
              <ModalFooter className="grid grid-cols-2">
                <Button color="default" variant="bordered" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  isLoading={isLoading}
                  variant="solid"
                  onPress={deleteProject}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
