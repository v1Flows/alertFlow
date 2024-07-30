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
import { Icon } from "@iconify/react";

import { CheckIcon } from "@/components/icons";
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
                <ModalHeader className="flex flex-wrap items-center justify-center gap-2 font-bold text-warning">
                  <Icon icon="solar:bomb-emoji-broken" width={24} /> Set
                  Maintenance
                </ModalHeader>
                <ModalBody>
                  <Snippet hideCopyButton hideSymbol>
                    <span>ID: {flow.id}</span>
                  </Snippet>
                  <Input
                    label="Maintenance Message"
                    placeholder="Enter the reason for the maintenance"
                    value={maintenanceReason}
                    variant="bordered"
                    onValueChange={setMaintenanceReason}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="default" variant="flat" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button
                    color="warning"
                    isLoading={isLoading}
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
                <ModalHeader className="flex flex-wrap items-center justify-center gap-2 font-bold text-success">
                  <CheckIcon /> Disable Maintenance
                </ModalHeader>
                <ModalBody>
                  <Snippet hideCopyButton hideSymbol>
                    <span>ID: {flow.id}</span>
                  </Snippet>
                </ModalBody>
                <ModalFooter>
                  <Button color="default" variant="flat" onPress={onClose}>
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
