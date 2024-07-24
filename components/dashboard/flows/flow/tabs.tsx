"use client";
import React from "react";
import { Tabs, Tab, useDisclosure, Button } from "@nextui-org/react";
import { Icon } from "@iconify/react";

import { Flash, PlusIcon } from "@/components/icons";
import FlowPattern from "@/components/dashboard/flows/flow/pattern";
import AddFlowActionModal from "@/components/functions/flows/addAction";

import Executions from "./executions";
import Payloads from "./payloads";

export default function FlowTabs({ flow, executions, payloads, runners }: any) {
  const addFlowActionModal = useDisclosure();
  const [selected, setSelected] = React.useState("actions");

  return (
    <main>
      <div className="flex w-full flex-col">
        <Tabs
          aria-label="Options"
          color="primary"
          selectedKey={selected}
          variant="solid"
          onSelectionChange={(key: any) => setSelected(key as string)}
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
            <div className="flex justify-end">
              <Button
                color="primary"
                startContent={<PlusIcon />}
                onPress={addFlowActionModal.onOpen}
              >
                Add Action
              </Button>
            </div>
            {flow.actions.length === 0 ? (
              <div className="flex flex-col items-center justify-center">
                <p className="text-center text-default-400">No actions found</p>
              </div>
            ) : (
              <>
                {flow.actions.map((action: any, index: number) => (
                  <FlowPattern key={index} action={action} />
                ))}
              </>
            )}
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
            <Executions executions={executions} flow={flow} />
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
            {/* <PayloadsTable
              executions={executions}
              flow={flow}
              payloads={payloads}
              runners={runners}
            /> */}
          </Tab>
        </Tabs>
      </div>
      <AddFlowActionModal disclosure={addFlowActionModal} runners={runners} />
    </main>
  );
}
