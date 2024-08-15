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
import { Icon } from "@iconify/react";

import DeleteExecution from "@/lib/fetch/executions/delete";

export default function DeleteExecutionModal({
  disclosure,
  execution,
}: {
  disclosure: UseDisclosureReturn;
  execution: any;
}) {
  const router = useRouter();

  const { isOpen, onOpenChange } = disclosure;

  const [isDeleteLoading, setIsDeleteLoading] = React.useState(false);

  async function deleteExecution() {
    setIsDeleteLoading(true);
    const res = await DeleteExecution(execution.id);

    if (res.error) {
      setIsDeleteLoading(false);
      toast.error("Failed to delete execution");

      return;
    }

    setIsDeleteLoading(false);
    onOpenChange();
    toast.success("Execution deleted successfully");
    router.refresh();
  }

  return (
    <main>
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
                <Icon icon="solar:reorder-line-duotone" width={24} /> Delete
                Execution
              </ModalHeader>
              <ModalBody>
                <p className="text-center">
                  You are about to delete the following execution which{" "}
                  <span className="font-bold">cannot be undone</span>:
                </p>
                <Divider />
                <Snippet hideCopyButton hideSymbol>
                  <span>ID: {execution.id}</span>
                </Snippet>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="bordered" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  isLoading={isDeleteLoading}
                  variant="solid"
                  onPress={deleteExecution}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </main>
  );
}
