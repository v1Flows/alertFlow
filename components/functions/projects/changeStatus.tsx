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

import ChangeProjectStatus from "@/lib/fetch/project/PUT/ChangeProjectStatus";
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
                <ModalHeader className="flex flex-wrap items-center justify-center gap-2 font-bold text-danger">
                  <LockIcon /> Disable Project
                </ModalHeader>
                <ModalBody>
                  <Snippet hideCopyButton hideSymbol>
                    <span>ID: {project.id}</span>
                  </Snippet>
                  <Input
                    label="Disable Reason"
                    placeholder="Enter the reason for disabling this project"
                    value={disableReason}
                    variant="bordered"
                    onValueChange={setDisableReason}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="default" variant="flat" onPress={onClose}>
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
                <ModalHeader className="flex flex-wrap items-center justify-center gap-2 font-bold text-success">
                  <CheckIcon /> Enable Project
                </ModalHeader>
                <ModalBody>
                  <Snippet hideCopyButton hideSymbol>
                    <span>ID: {project.id}</span>
                  </Snippet>
                </ModalBody>
                <ModalFooter>
                  <Button color="default" variant="flat" onPress={onClose}>
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
