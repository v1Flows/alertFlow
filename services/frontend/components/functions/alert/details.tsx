import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Chip,
  Snippet,
  Code,
  Divider,
} from "@heroui/react";
import { useDisclosure, UseDisclosureReturn } from "@heroui/use-disclosure";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ReactTimeago from "react-timeago";

import FunctionDeleteAlertModal from "../flows/deleteAlert";

export default function AlertDrawer({
  alert,
  runners,
  flows,
  disclosure,
  canEdit,
  showDelete,
}: {
  alert: any;
  runners: any;
  flows: any;
  disclosure: UseDisclosureReturn;
  canEdit?: boolean;
  showDelete?: boolean;
}) {
  const { isOpen, onOpenChange } = disclosure;
  const router = useRouter();

  const [showPayload, setShowPayload] = useState(false);
  const deleteAlertModal = useDisclosure();

  const handleDelete = () => {
    deleteAlertModal.onOpen();
    onOpenChange();
  };

  return (
    <>
      <Drawer isOpen={isOpen} size="lg" onOpenChange={onOpenChange}>
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col">
                <div className="flex flex-cols items-center gap-2">
                  {alert.name || "Untitled"}
                  <Chip
                    className="capitalize"
                    color={alert.status === "resolved" ? "success" : "danger"}
                    radius="sm"
                    size="sm"
                    variant="flat"
                  >
                    {alert.status}
                  </Chip>
                  <Chip
                    className="capitalize"
                    color={alert.encrypted ? "success" : "warning"}
                    radius="sm"
                    size="sm"
                    variant="flat"
                  >
                    {alert.encrypted ? "Encrypted" : "Unencrypted"}
                  </Chip>
                </div>
              </DrawerHeader>
              <Divider />
              <DrawerBody>
                <div className="grid grid-cols-3 items-center gap-3">
                  <p className="font-bold text-default-500 col-span-1">ID</p>
                  <Snippet
                    hideSymbol
                    className="col-span-2"
                    size="sm"
                    variant="flat"
                  >
                    {alert.id}
                  </Snippet>

                  <p className="font-bold text-default-500 col-span-1">
                    Runner
                  </p>
                  <p className="text-sm col-span-2">
                    {runners.find((runner) => runner.id === alert.runner_id)
                      ?.name || "N/A"}
                  </p>

                  <p className="font-bold text-default-500 col-span-1">Flow</p>
                  <p className="text-sm col-span-2">
                    {flows.find((flow) => flow.id === alert.flow_id)?.name ||
                      "N/A"}
                  </p>

                  <p className="font-bold text-default-500 col-span-1">
                    Execution ID
                  </p>
                  <Snippet
                    hideSymbol
                    className="col-span-2"
                    size="sm"
                    variant="flat"
                  >
                    {alert.execution_id || "N/A"}
                  </Snippet>

                  {alert.parent_id && (
                    <>
                      <p className="font-bold text-default-500 col-span-1">
                        Parent Alert
                      </p>
                      <Code className="col-span-2">
                        {alert.parent_id || "N/A"}
                      </Code>
                    </>
                  )}

                  <p className="font-bold text-default-500 col-span-1">
                    Payload
                  </p>
                  <Button
                    className="col-span-2"
                    color="primary"
                    size="sm"
                    variant="flat"
                    onPress={() => setShowPayload(!showPayload)}
                  >
                    {showPayload ? "Hide" : "Show"} Payload
                  </Button>

                  <p className="font-bold text-default-500 col-span-1">
                    Created At
                  </p>
                  <span className="col-span-2">
                    <ReactTimeago date={alert.created_at} />
                  </span>

                  <p className="font-bold text-default-500 col-span-1">
                    Updated At
                  </p>
                  <span className="col-span-2">
                    {alert.updated_at !== "0001-01-01T00:00:00Z" ? (
                      <ReactTimeago date={alert.updated_at} />
                    ) : (
                      "N/A"
                    )}
                  </span>

                  <p className="font-bold text-default-500 col-span-1">
                    Resolved At
                  </p>
                  <span className="col-span-2">
                    {alert.resolved_at !== "0001-01-01T00:00:00Z" ? (
                      <ReactTimeago date={alert.resolved_at} />
                    ) : (
                      "N/A"
                    )}
                  </span>

                  {alert.note && (
                    <>
                      <Divider className="col-span-3" />
                      <p className="font-bold col-span-1">Note</p>
                      <span className="col-span-2 font-bold">{alert.note}</span>
                    </>
                  )}
                </div>

                {showPayload && (
                  <Snippet hideSymbol>
                    <pre>{JSON.stringify(alert.payload, null, 2)}</pre>
                  </Snippet>
                )}
              </DrawerBody>
              <DrawerFooter className="flex flex-wrap items-center justify-between">
                <div className="flex flex-col gap-2">
                  <Button
                    color="primary"
                    variant="flat"
                    onPress={() => {
                      router.push(`/flows/${alert.flow_id}`);
                    }}
                  >
                    <Icon icon="hugeicons:workflow-square-10" width={20} />
                    View Flow
                  </Button>
                  {alert.execution_id && (
                    <Button
                      color="primary"
                      onPress={() => {
                        router.push(
                          `/flows/${alert.flow_id}/execution/${alert.execution_id}`,
                        );
                      }}
                    >
                      <Icon icon="hugeicons:rocket-02" width={20} />
                      View Execution
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {showDelete && (
                    <Button
                      color="danger"
                      isDisabled={!canEdit}
                      variant="flat"
                      onPress={() => handleDelete()}
                    >
                      <Icon icon="hugeicons:delete-02" width={20} />
                      Delete
                    </Button>
                  )}
                  <Button color="default" variant="flat" onPress={onClose}>
                    Close
                  </Button>
                </div>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
      <FunctionDeleteAlertModal alert={alert} disclosure={deleteAlertModal} />
    </>
  );
}
