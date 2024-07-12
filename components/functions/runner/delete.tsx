"use client";

import type { UseDisclosureReturn } from "@nextui-org/use-disclosure";

import {
  Button,
  Chip,
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

import { DeleteDocumentIcon, InfoIcon } from "@/components/icons";
import DeleteProjectRunner from "@/lib/fetch/project/DELETE/DeleteRunner";

export default function DeleteRunnerModal({
  disclosure,
  runner,
}: {
  disclosure: UseDisclosureReturn;
  runner: any;
}) {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = disclosure;

  const [isLoading, setIsLoading] = React.useState(false);

  async function deleteRunner() {
    setIsLoading(true);

    const response = await DeleteProjectRunner(runner.id);

    if (response.result === "success") {
      onOpenChange();
      toast.success("Runner deleted successfully");
      router.refresh();
    } else {
      toast.error("Failed to create runner");
    }

    setIsLoading(false);
  }

  return (
    <>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        placement="center"
        onOpenChange={onOpenChange}
      >
        <ModalContent className="w-full">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-wrap items-center justify-center gap-2 font-bold text-danger">
                <InfoIcon />
                Are you sure?
              </ModalHeader>
              <ModalBody>
                <p>
                  You are about to delete the following runner which{" "}
                  <span className="font-bold">cannot be undone.</span>
                </p>
                <p className="items-center">
                  Any Flow which has this runner assigned will receive the flag{" "}
                  <Chip
                    color="warning"
                    size="sm"
                    startContent={<InfoIcon height={15} width={15} />}
                    variant="flat"
                  >
                    Maintenace Required
                  </Chip>
                </p>
                <Divider />
                <Snippet hideCopyButton hideSymbol>
                  <span>Name: {runner.name}</span>
                  <span>ID: {runner.id}</span>
                </Snippet>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="bordered" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  className="font-bold"
                  color="danger"
                  isLoading={isLoading}
                  startContent={<DeleteDocumentIcon />}
                  variant="solid"
                  onPress={deleteRunner}
                >
                  DELETE
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
