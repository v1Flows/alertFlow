import type { UseDisclosureReturn } from "@nextui-org/use-disclosure";

import {
  Button,
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
import ErrorCard from "@/components/error/ErrorCard";

export default function FunctionDeleteFlow({
  disclosure,
  flow,
}: {
  disclosure: UseDisclosureReturn;
  flow: any;
}) {
  const router = useRouter();

  const { isOpen, onOpenChange } = disclosure;

  const [isDeleteLoading, setIsDeleteLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [errorText, setErrorText] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  async function deleteFlow() {
    setIsDeleteLoading(true);
    const res = (await DeleteFlow(flow.id)) as any;

    if (!res) {
      setError(true);
      setErrorText("Failed to delete flow");
      setErrorMessage("Failed to delete flow");
      setIsDeleteLoading(false);

      return;
    }

    if (res.success) {
      setError(false);
      setErrorText("");
      setErrorMessage("");
      onOpenChange();
      toast.success("Flow deleted successfully");
      router.refresh();
    } else {
      setError(true);
      setErrorText(res.error);
      setErrorMessage(res.message);
      toast.error("Failed to delete flow");
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
                    You are about to delete the following flow which{" "}
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
                    Name:
                    {flow.name}
                  </span>
                  <span>
                    ID:
                    {flow.id}
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
