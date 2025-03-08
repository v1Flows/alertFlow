"use client";
import { Icon } from "@iconify/react";
import { Tab, Tabs } from "@heroui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

import AlertsList from "../../alerts/list";

import Actions from "./actions";
import Executions from "./executions";
import FlowStats from "./stats";
import FlowSettings from "./settings";

export default function FlowTabs({
  flow,
  executions,
  alerts,
  runners,
  user,
  canEdit,
}: any) {
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
                <Icon height={20} icon="hugeicons:blockchain-06" width="20" />
                <span>Actions</span>
              </div>
            }
          >
            <Actions
              canEdit={canEdit}
              flow={flow}
              runners={runners}
              user={user}
            />
          </Tab>
          <Tab
            key="executions"
            title={
              <div className="flex items-center space-x-2">
                <Icon height={20} icon="hugeicons:rocket-02" width="20" />
                <span>Executions</span>
              </div>
            }
          >
            <Executions
              alerts={alerts}
              canEdit={canEdit}
              executions={executions}
            />
          </Tab>
          <Tab
            key="alerts"
            title={
              <div className="flex items-center space-x-2">
                <Icon height="20" icon="hugeicons:alert-02" width="20" />
                <span>Alerts</span>
              </div>
            }
          >
            <AlertsList
              alerts={alerts}
              canEdit={canEdit}
              compactMode={false}
              flows={[flow]}
              maxAlerts={18}
              runners={runners}
              showDelete={true}
            />
          </Tab>
          <Tab
            key="settings"
            title={
              <div className="flex items-center space-x-2">
                <Icon icon="hugeicons:settings-02" width={20} />
                <span>Settings</span>
              </div>
            }
          >
            <FlowSettings flow={flow} />
          </Tab>
          <Tab
            key="stats"
            title={
              <div className="flex items-center space-x-2">
                <Icon
                  height="20"
                  icon="hugeicons:chart-line-data-01"
                  width="20"
                />
                <span>Stats</span>
              </div>
            }
          >
            <FlowStats flowID={flow.id} />
          </Tab>
        </Tabs>
      </div>
    </main>
  );
}
