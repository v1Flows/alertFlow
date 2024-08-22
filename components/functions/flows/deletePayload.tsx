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

import DeletePayload from "@/lib/fetch/flow/DELETE/DeletePayload";

export default function FunctionDeletePayloadModal({
  disclosure,
  flow,
  payload,
}: {
  disclosure: UseDisclosureReturn;
  flow: any;
  payload: any;
}) {
  const router = useRouter();

  const { isOpen, onOpenChange } = disclosure;

  const [isDeleteLoading, setIsDeleteLoading] = React.useState(false);

  async function deletePayload() {
    setIsDeleteLoading(true);
    const res = await DeletePayload(flow.id, payload.id);

    if (res.error) {
      setIsDeleteLoading(false);
      toast.error("Failed to delete payload");

      return;
    }

    setIsDeleteLoading(false);
    onOpenChange();
    toast.success("Payload deleted successfully");
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
              <ModalHeader className="flex flex-wrap items-center">
                <div className="flex flex-col gap-2">
                  <p className="text-lg font-bold">Are you sure?</p>
                  <p className="text-sm text-default-500">
                    You are about to delete the following payload which{" "}
                    <span className="font-bold">cannot be undone</span>
                  </p>
                </div>
              </ModalHeader>
              <ModalBody>
                <Snippet hideCopyButton hideSymbol>
                  <span>ID: {payload.id}</span>
                </Snippet>
              </ModalBody>
              <ModalFooter className="grid grid-cols-2">
                <Button color="default" variant="ghost" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  isLoading={isDeleteLoading}
                  variant="solid"
                  onPress={deletePayload}
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
