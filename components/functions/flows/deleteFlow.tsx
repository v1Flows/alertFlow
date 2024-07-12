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

import DeleteFlow from "@/lib/fetch/flow/DELETE/DeleteFlow";

export default function FunctionDeleteFlow({
  disclosure,
  flow,
}: {
  disclosure: UseDisclosureReturn;
  flow: any;
}) {
  const router = useRouter();

  const { isOpen, onOpen, onOpenChange, onClose } = disclosure;

  const [isDeleteLoading, setIsDeleteLoading] = React.useState(false);

  async function deleteFlow() {
    setIsDeleteLoading(true);
    const res = await DeleteFlow(flow.id);

    if (res.error) {
      setIsDeleteLoading(false);
      toast.error("Failed to delete flow");

      return;
    }

    setIsDeleteLoading(false);
    onOpenChange();
    toast.success("Flow deleted successfully");
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
              <ModalHeader className="flex flex-col gap-1 text-danger">
                Are you sure?
              </ModalHeader>
              <ModalBody>
                <p>
                  You are about to delete the following flow which{" "}
                  <span className="font-bold">cannot be undone</span>:
                </p>
                <Divider />
                <Snippet hideCopyButton hideSymbol>
                  <span>Name: {flow.name}</span>
                  <span>ID: {flow.id}</span>
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
                  onPress={deleteFlow}
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
