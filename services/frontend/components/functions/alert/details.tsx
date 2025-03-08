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
import { UseDisclosureReturn } from "@heroui/use-disclosure";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ReactTimeago from "react-timeago";

export default function AlertDrawer({
  alert,
  runners,
  flows,
  disclosure,
}: {
  alert: any;
  runners: any;
  flows: any;
  disclosure: UseDisclosureReturn;
}) {
  const { isOpen, onOpenChange } = disclosure;
  const router = useRouter();

  const [showPayload, setShowPayload] = useState(false);

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
                <p className="text-sm text-default-500">{alert.id}</p>
              </DrawerHeader>
              <Divider />
              <DrawerBody>
                <div className="grid grid-cols-3 items-center gap-3">
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
                  <Code className="col-span-2">
                    {alert.execution_id || "N/A"}
                  </Code>

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
                </div>

                {showPayload && (
                  <Snippet hideSymbol>
                    <pre>{JSON.stringify(alert.payload, null, 2)}</pre>
                  </Snippet>
                )}
              </DrawerBody>
              <DrawerFooter>
                <Button color="default" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  variant="flat"
                  onPress={() => {
                    router.push(`/flows/${alert.flow_id}`);
                  }}
                >
                  <Icon icon="hugeicons:workflow-square-10" />
                  View Flow
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    router.push(
                      `/flows/${alert.flow_id}/execution/${alert.execution_id}`,
                    );
                  }}
                >
                  <Icon icon="hugeicons:rocket-02" />
                  View Execution
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
