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

import ChangeFlowMaintenance from "@/lib/fetch/flow/PUT/ChangeFlowMaintenance";

export default function ChangeFlowMaintenanceModal({
  disclosure,
  flow,
  maintenance,
}: {
  disclosure: UseDisclosureReturn;
  flow: any;
  maintenance: any;
}) {
  const router = useRouter();

  const { isOpen, onOpenChange } = disclosure;

  const [maintenanceReason, setMaintenanceReason] = React.useState("");
  const [isLoading, setLoading] = React.useState(false);

  async function changeFlowMaintenance() {
    setLoading(true);

    const res = await ChangeFlowMaintenance(
      flow.id,
      maintenance,
      maintenanceReason ? maintenanceReason : "no info provided",
    );

    if (!res.error) {
      setLoading(false);
      onOpenChange();
      router.refresh();
      toast.success("Flow maintenance updated successfully");
    } else {
      setLoading(false);
      router.refresh();
      toast.error("Failed to update flow maintenance");
    }
  }

  return (
    <main>
      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        {maintenance && (
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-wrap items-center">
                  <div className="flex flex-col gap-2">
                    <p className="text-lg font-bold">Set Maintenance</p>
                    <p className="text-sm text-default-500">
                      Are you sure you want to set maintenance for this flow?
                    </p>
                  </div>
                </ModalHeader>
                <ModalBody>
                  <Snippet hideCopyButton hideSymbol>
                    <span>ID: {flow.id}</span>
                  </Snippet>
                  <Input
                    label="Maintenance Message"
                    labelPlacement="outside"
                    placeholder="Enter the reason for the maintenance"
                    value={maintenanceReason}
                    variant="flat"
                    onValueChange={setMaintenanceReason}
                  />
                </ModalBody>
                <ModalFooter className="grid grid-cols-2">
                  <Button color="default" variant="ghost" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button
                    color="warning"
                    isLoading={isLoading}
                    variant="flat"
                    onPress={changeFlowMaintenance}
                  >
                    Set Maintenance
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        )}
        {!maintenance && (
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-wrap items-center">
                  <div className="flex flex-col gap-2">
                    <p className="text-lg font-bold">Remove Maintenance</p>
                    <p className="text-sm text-default-500">
                      Are you sure you want to remove the maintenance for this
                      flow?
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
                    onPress={changeFlowMaintenance}
                  >
                    Disable Maintenance
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
