"use client";
import React from "react";
import { Divider, Input, Spacer } from "@nextui-org/react";
import { toast } from "sonner";

import AdminGetStats from "@/lib/fetch/admin/stats";

import ProjectsStats from "./projects";
import FlowsStats from "./flows";
import UsersStats from "./users";

export function PageStats({
  flows,
  projects,
  users,
}: {
  flows: any;
  projects: any;
  users: any;
}) {
  const [interval, setInterval] = React.useState(7);
  const [stats, setStats] = React.useState({
    started_execution_stats: [],
    failed_execution_stats: [],
    user_registration_stats: [],
    incoming_payload_stats: [],
    project_creation_stats: [],
    flow_creation_stats: [],
    users_per_plan_stats: [],
    users_per_role_stats: [],
  });

  async function getStats() {
    const stats = await AdminGetStats(interval);

    if (!stats.success) {
      if ("error" in stats) {
        toast.error(stats.error);
      }
    } else {
      setStats(stats.data);
    }
  }

  React.useEffect(() => {
    getStats();
  }, [interval]);

  return (
    <main>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <p className="text-2xl font-bold mb-0 text-danger">Admin</p>
          <p className="text-2xl mb-0">|</p>
          <p className="text-2xl mb-0">Stats</p>
        </div>
        <Input
          className="max-w-[100px]"
          endContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">days</span>
            </div>
          }
          label="Interval"
          radius="sm"
          type="number"
          value={interval.toString()}
          onChange={(e) => setInterval(Number(e.target.value))}
        />
      </div>
      <Divider className="my-4" />
      <UsersStats interval={interval} stats={stats} users={users} />
      <Spacer y={4} />
      <ProjectsStats interval={interval} projects={projects} stats={stats} />
      <Spacer y={4} />
      <FlowsStats flows={flows} interval={interval} stats={stats} />
    </main>
  );
}
