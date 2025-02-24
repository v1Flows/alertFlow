import type { UseDisclosureReturn } from "@heroui/use-disclosure";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Snippet,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

import DeletePayload from "@/lib/fetch/flow/DELETE/DeleteAlert";
import ErrorCard from "@/components/error/ErrorCard";

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
  const [error, setError] = React.useState(false);
  const [errorText, setErrorText] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  async function deletePayload() {
    setIsDeleteLoading(true);
    const res = (await DeletePayload(flow.id, payload.id)) as any;

    if (!res) {
      setError(true);
      setErrorText("Failed to delete payload");
      setErrorMessage("Failed to delete payload");
      setIsDeleteLoading(false);

      return;
    }

    if (res.success) {
      setError(false);
      setErrorText("");
      setErrorMessage("");
      toast.success("Payload deleted successfully");
      router.refresh();
      onOpenChange();
    } else {
      setError(true);
      setErrorText(res.message);
      setErrorMessage(res.error);
      toast.error("Failed to delete payload");
    }

    setIsDeleteLoading(false);
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
                {error && (
                  <ErrorCard error={errorText} message={errorMessage} />
                )}
                <Snippet hideCopyButton hideSymbol>
                  <span>
                    ID:
                    {payload.id}
                  </span>
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
