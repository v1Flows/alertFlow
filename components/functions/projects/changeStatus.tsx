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

import ChangeProjectStatus from "@/lib/fetch/admin/PUT/ChangeProjectStatus";
import { CheckIcon, LockIcon } from "@/components/icons";

export default function ChangeProjectStatusModal({
  disclosure,
  project,
  status,
}: {
  disclosure: UseDisclosureReturn;
  project: any;
  status: any;
}) {
  const router = useRouter();

  const { isOpen, onOpenChange } = disclosure;

  const [disableReason, setDisableReason] = React.useState("");
  const [isLoading, setLoading] = React.useState(false);

  async function changeProjectStatus() {
    setLoading(true);

    const res = await ChangeProjectStatus(
      project.id,
      status,
      disableReason ? disableReason : "no info provided",
    );

    if (!res.error) {
      setLoading(false);
      onOpenChange();
      router.refresh();
      toast.success("Project status updated successfully");
    } else {
      setLoading(false);
      router.refresh();
      toast.error("Failed to update project status");
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
                    <p className="text-lg font-bold">Disable Project</p>
                    <p className="text-sm text-default-500">
                      Are you sure you want to disable this project?
                    </p>
                  </div>
                </ModalHeader>
                <ModalBody>
                  <Snippet hideCopyButton hideSymbol>
                    <span>ID: {project.id}</span>
                  </Snippet>
                  <Input
                    label="Disable Reason"
                    labelPlacement="outside"
                    placeholder="Enter the reason for disabling this project"
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
                    onPress={changeProjectStatus}
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
                    <p className="text-lg font-bold">Enable Project</p>
                    <p className="text-sm text-default-500">
                      Are you sure you want to enable this project?
                    </p>
                  </div>
                </ModalHeader>
                <ModalBody>
                  <Snippet hideCopyButton hideSymbol>
                    <span>ID: {project.id}</span>
                  </Snippet>
                </ModalBody>
                <ModalFooter className="grid grid-cols-2">
                  <Button color="default" variant="ghost" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button
                    color="success"
                    isLoading={isLoading}
                    onPress={changeProjectStatus}
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
