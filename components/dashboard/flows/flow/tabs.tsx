"use client";
import React from "react";
import { Tabs, Tab, useDisclosure, Button } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Flash, PlusIcon } from "@/components/icons";
import AddFlowActionModal from "@/components/functions/flows/addAction";

import Executions from "./executions";
import Payloads from "./payloads";
import Actions from "./actions";

export default function FlowTabs({
  actions,
  flow,
  executions,
  payloads,
  runners,
}: any) {
  const addFlowActionModal = useDisclosure();
  const [selected, setSelected] = React.useState("actions");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  React.useEffect(() => {
    const tab = params.get("tab") || "actions";

    setSelected(tab);
  }, [params]);

  const handleTabChange = (key: any) => {
    params.set("tab", key);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <main>
      <div className="flex w-full flex-col">
        <Tabs
          aria-label="Options"
          color="primary"
          selectedKey={selected}
          variant="solid"
          onSelectionChange={handleTabChange}
        >
          <Tab
            key="actions"
            title={
              <div className="flex items-center space-x-2">
                <Flash fill="currentColor" size={20} />
                <span>Actions</span>
              </div>
            }
          >
            {actions.length === 0 ? (
              <div className="flex flex-col items-center justify-center">
                <p className="text-center text-default-400 mt-4">
                  No actions found
                </p>
              </div>
            ) : (
              <Actions actions={actions} flow={flow} runners={runners} />
            )}
            <Button
              fullWidth
              className="mt-4"
              color="primary"
              isDisabled={flow.disabled}
              startContent={<PlusIcon />}
              variant="flat"
              onPress={addFlowActionModal.onOpen}
            >
              Add Action
            </Button>
          </Tab>
          <Tab
            key="executions"
            title={
              <div className="flex items-center space-x-2">
                <Icon
                  height={20}
                  icon="solar:reorder-line-duotone"
                  width="20"
                />
                <span>Executions</span>
              </div>
            }
          >
            <Executions executions={executions} payloads={payloads} />
          </Tab>
          <Tab
            key="payloads"
            title={
              <div className="flex items-center space-x-2">
                <Icon
                  height="20"
                  icon="solar:letter-opened-broken"
                  width="20"
                />
                <span>Payloads</span>
              </div>
            }
          >
            <Payloads
              executions={executions}
              flow={flow}
              payloads={payloads}
              runners={runners}
            />
          </Tab>
        </Tabs>
      </div>
      <AddFlowActionModal
        disclosure={addFlowActionModal}
        flowID={flow.id}
        runners={runners}
      />
    </main>
  );
}
