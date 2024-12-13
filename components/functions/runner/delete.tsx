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
import React, { useEffect } from "react";
import { toast } from "sonner";

import DeleteProjectRunner from "@/lib/fetch/project/DELETE/DeleteRunner";
import GetRunnerFlowLinks from "@/lib/fetch/runner/GetRunnerFlowLinks";

export default function DeleteRunnerModal({
  disclosure,
  runner,
}: {
  disclosure: UseDisclosureReturn;
  runner: any;
}) {
  const router = useRouter();
  const { isOpen, onOpenChange } = disclosure;

  const [flowLinks, setFlowLinks] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    runner.id && getFlowLinks();
  }, [runner]);

  async function getFlowLinks() {
    const flows = await GetRunnerFlowLinks({ runnerId: runner.id });

    if (flows.success) {
      setFlowLinks(flows.data.flows);
    }
  }

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
              <ModalHeader className="flex flex-wrap items-center">
                <div className="flex flex-col gap-2">
                  <p className="text-lg font-bold">Are you sure?</p>
                  <p className="text-sm text-default-500">
                    You are about to delete the following runner which{" "}
                    <span className="font-bold">cannot be undone</span>
                  </p>
                </div>
              </ModalHeader>
              <ModalBody>
                <Snippet hideCopyButton hideSymbol>
                  <span>Name: {runner.name}</span>
                  <span>ID: {runner.id}</span>
                </Snippet>
                {flowLinks.length > 0 && (
                  <>
                    <Divider />
                    <p>
                      The runner is assigned to the following flows which will
                      need{" "}
                      <span className="text-warning font-bold">
                        Maintenance
                      </span>{" "}
                      after the runner got deleted:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {flowLinks.map((flow: any) => (
                        <Chip
                          key={flow.id}
                          color="warning"
                          radius="sm"
                          variant="flat"
                        >
                          {flow.name}
                        </Chip>
                      ))}
                    </div>
                  </>
                )}
              </ModalBody>
              <ModalFooter className="grid grid-cols-2">
                <Button color="default" variant="ghost" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  isLoading={isLoading}
                  variant="solid"
                  onPress={deleteRunner}
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
