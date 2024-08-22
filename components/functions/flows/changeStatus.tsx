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

import ChangeFlowStatus from "@/lib/fetch/admin/PUT/ChangeFlowStatus";

export default function ChangeFlowStatusModal({
  disclosure,
  flow,
  status,
}: {
  disclosure: UseDisclosureReturn;
  flow: any;
  status: any;
}) {
  const router = useRouter();

  const { isOpen, onOpenChange } = disclosure;

  const [disableReason, setDisableReason] = React.useState("");
  const [isLoading, setLoading] = React.useState(false);

  async function changeFlowStatus() {
    setLoading(true);

    const res = await ChangeFlowStatus(
      flow.id,
      status,
      disableReason ? disableReason : "no info provided",
    );

    if (!res.error) {
      setLoading(false);
      onOpenChange();
      router.refresh();
      toast.success("Flow status updated successfully");
    } else {
      setLoading(false);
      router.refresh();
      toast.error("Failed to update flow status");
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
                    <p className="text-lg font-bold">Disable Flow</p>
                    <p className="text-sm text-default-500">
                      Are you sure you want to disable this flow?
                    </p>
                  </div>
                </ModalHeader>
                <ModalBody>
                  <Snippet hideCopyButton hideSymbol>
                    <span>ID: {flow.id}</span>
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
                    onPress={changeFlowStatus}
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
                    <p className="text-lg font-bold">Enable Flow</p>
                    <p className="text-sm text-default-500">
                      Are you sure you want to enable this flow?
                    </p>
                  </div>
                </ModalHeader>
                <ModalBody>
                  <Snippet hideCopyButton hideSymbol>
                    <span>ID: {flow.id}</span>
                  </Snippet>
                </ModalBody>
                <ModalFooter className="grid grid-cols-2">
                  <Button color="default" variant="ghost" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button
                    color="success"
                    isLoading={isLoading}
                    onPress={changeFlowStatus}
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
