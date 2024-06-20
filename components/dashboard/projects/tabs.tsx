"use client";
import React from "react";
import { Tabs, Tab } from "@nextui-org/react";

import { PlayCircleIcon, UsersIcon, TagIcon } from "@/components/icons";

import ProjectMembers from "./UserTable";
import ProjectAPIKeys from "./APIKeysTable";
import Runners from "./Runners";

export default function ProjectTabs({ project, runners, apiKeys }: any) {
  const [selected, setSelected] = React.useState("photos");

  return (
    <main>
      <div className="flex w-full flex-col">
        <Tabs
          aria-label="Options"
          color="primary"
          selectedKey={selected}
          variant="underlined"
          onSelectionChange={(key: any) => setSelected(key as string)}
        >
          <Tab
            key="members"
            title={
              <div className="flex items-center space-x-2">
                <UsersIcon className="h-5 w-5" />
                <span>Members</span>
              </div>
            }
          >
            <ProjectMembers members={project.members} projectID={project.id} />
          </Tab>
          <Tab
            key="runners"
            title={
              <div className="flex items-center space-x-2">
                <PlayCircleIcon className="h-5 w-5" />
                <span>Runners</span>
              </div>
            }
          >
            <Runners project={project} runners={runners} />
          </Tab>
          <Tab
            key="apikeys"
            title={
              <div className="flex items-center space-x-2">
                <TagIcon className="h-5 w-5" />
                <span>API Keys</span>
              </div>
            }
          >
            <ProjectAPIKeys apiKeys={apiKeys} project={project} />
          </Tab>
        </Tabs>
      </div>
    </main>
  );
}
