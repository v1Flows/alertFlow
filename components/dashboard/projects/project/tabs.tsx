"use client";
import React from "react";
import { Tabs, Tab, Tooltip } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import ProjectMembers from "@/components/dashboard/projects/project/tables/UserTable";
import ProjectTokens from "@/components/dashboard/projects/project/tables/TokensTable";
import Runners from "@/components/dashboard/projects/project/Runners";

import ProjectAuditLogs from "./tables/AuditTable";

export default function ProjectTabs({
  project,
  members,
  runners,
  tokens,
  settings,
  plan,
  audit,
  user,
}: any) {
  const [selected, setSelected] = React.useState("members");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  React.useEffect(() => {
    var tab = params.get("tab") || "members";

    if (tab === "audit" && plan.id !== "enterprise" && user.role !== "admin") {
      tab = "members";
    }

    setSelected(tab);
  }, [params]);

  const handleTabChange = (key: any) => {
    if (key === "audit" && plan.id !== "enterprise" && user.role !== "admin") {
      return;
    }

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
            key="members"
            title={
              <div className="flex items-center space-x-2">
                <Icon icon="solar:smile-square-outline" width={20} />
                <span>Members</span>
              </div>
            }
          >
            <ProjectMembers
              members={members}
              plan={plan}
              project={project}
              settings={settings}
              user={user}
            />
          </Tab>
          <Tab
            key="runners"
            title={
              <div className="flex items-center space-x-2">
                <Icon icon="solar:rocket-2-outline" width={20} />
                <span>Runners</span>
              </div>
            }
          >
            <Runners
              members={members}
              plan={plan}
              project={project}
              runners={runners}
              settings={settings}
              user={user}
            />
          </Tab>
          <Tab
            key="tokens"
            title={
              <div className="flex items-center space-x-2">
                <Icon icon="solar:key-square-2-outline" width={20} />
                <span>Tokens</span>
              </div>
            }
          >
            <ProjectTokens
              members={members}
              project={project}
              settings={settings}
              tokens={tokens}
              user={user}
            />
          </Tab>
          <Tab
            key="audit"
            isDisabled={plan.id !== "enterprise" && user.role !== "admin"}
            title={
              plan.id !== "enterprise" && user.role !== "admin" ? (
                <Tooltip color="secondary" content="Enterprise Feature">
                  <div className="flex items-center space-x-2">
                    <Icon icon="solar:notes-outline" width={20} />
                    <span>Audit</span>
                  </div>
                </Tooltip>
              ) : (
                <div className="flex items-center space-x-2">
                  <Icon icon="solar:notes-outline" width={20} />
                  <span>Audit</span>
                </div>
              )
            }
          >
            <ProjectAuditLogs audit={audit} members={members} user={user} />
          </Tab>
        </Tabs>
      </div>
    </main>
  );
}
