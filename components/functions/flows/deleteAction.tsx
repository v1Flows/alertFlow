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

import DeleteAction from "@/lib/fetch/flow/DELETE/DeleteAction";

export default function DeleteActionModal({
  disclosure,
  flowID,
  actionID,
}: {
  disclosure: UseDisclosureReturn;
  flowID: any;
  actionID: any;
}) {
  const router = useRouter();

  const { isOpen, onOpenChange } = disclosure;

  const [isDeleteLoading, setIsDeleteLoading] = React.useState(false);

  async function deleteAction() {
    setIsDeleteLoading(true);
    const res = await DeleteAction(flowID, actionID);

    if (res.error) {
      setIsDeleteLoading(false);
      toast.error("Failed to delete action");

      return;
    }

    setIsDeleteLoading(false);
    onOpenChange();
    toast.success("Action deleted successfully");
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
                  You are about to delete the following action which{" "}
                  <span className="font-bold">cannot be undone</span>:
                </p>
                <Divider />
                <Snippet hideCopyButton hideSymbol>
                  <span>ID: {actionID}</span>
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
                  onPress={deleteAction}
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
