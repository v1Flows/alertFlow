import type { UseDisclosureReturn } from "@nextui-org/use-disclosure";

import {
  Button,
  Input,
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

import ChangeTokenStatus from "@/lib/fetch/admin/PUT/ChangeTokenStatus";
import ErrorCard from "@/components/error/ErrorCard";

export default function ChangeTokenStatusModal({
  disclosure,
  token,
  status,
}: {
  disclosure: UseDisclosureReturn;
  token: any;
  status: any;
}) {
  const router = useRouter();

  const { isOpen, onOpenChange } = disclosure;

  const [disableReason, setDisableReason] = React.useState("");
  const [isLoading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [errorText, setErrorText] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  async function changeTokenStatus() {
    setLoading(true);

    const res = (await ChangeTokenStatus(
      token.id,
      status,
      disableReason ? disableReason : "no info provided",
    )) as any;

    if (!res) {
      setLoading(false);
      setError(true);
      setErrorText("Failed to update token status");
      setErrorMessage("Failed to update token status");
      toast.error("Failed to update token status");

      return;
    }

    if (res.success) {
      setLoading(false);
      setError(false);
      setErrorText("");
      setErrorMessage("");
      onOpenChange();
      router.refresh();
      toast.success("Token status updated successfully");
    } else {
      setLoading(false);
      setError(true);
      setErrorText(res.error);
      setErrorMessage(res.message);
      router.refresh();
      toast.error("Failed to update token status");
    }
  }

  return (
    <main>
      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        {status && (
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-wrap items-center">
                  <div className="flex flex-col gap-2">
                    <p className="text-lg font-bold">Disable Token</p>
                    <p className="text-sm text-default-500">
                      Are you sure you want to disable this token?
                    </p>
                  </div>
                </ModalHeader>
                <ModalBody>
                  {error && (
                    <ErrorCard error={errorText} message={errorMessage} />
                  )}
                  <Snippet hideCopyButton hideSymbol>
                    <span>ID: {token.id}</span>
                  </Snippet>
                  <Input
                    label="Disable Reason"
                    labelPlacement="outside"
                    placeholder="Enter the reason for disabling this flow"
                    value={disableReason}
                    variant="flat"
                    onValueChange={setDisableReason}
                  />
                </ModalBody>
                <ModalFooter className="grid grid-cols-2">
                  <Button color="default" variant="ghost" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button
                    color="danger"
                    isLoading={isLoading}
                    onPress={changeTokenStatus}
                  >
                    Disable
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        )}
        {!status && (
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-wrap items-center">
                  <div className="flex flex-col gap-2">
                    <p className="text-lg font-bold">Enable Token</p>
                    <p className="text-sm text-default-500">
                      Are you sure you want to enable this token?
                    </p>
                  </div>
                </ModalHeader>
                <ModalBody>
                  <Snippet hideCopyButton hideSymbol>
                    <span>ID: {token.id}</span>
                  </Snippet>
                </ModalBody>
                <ModalFooter className="grid grid-cols-2">
                  <Button color="default" variant="flat" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button
                    color="success"
                    isLoading={isLoading}
                    onPress={changeTokenStatus}
                  >
                    Enable
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        )}
      </Modal>
    </main>
  );
}
