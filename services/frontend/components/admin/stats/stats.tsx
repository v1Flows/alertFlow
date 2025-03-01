"use client";
import { Divider, Input, Spacer } from "@heroui/react";
import React from "react";
import { toast } from "sonner";

import AdminGetStats from "@/lib/fetch/admin/stats";

import FlowsStats from "./flows";
import ProjectsStats from "./projects";
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
    incoming_alert_stats: [],
    project_creation_stats: [],
    flow_creation_stats: [],
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
          <p className="mb-0 text-2xl font-bold text-danger">Admin</p>
          <p className="mb-0 text-2xl">|</p>
          <p className="mb-0 text-2xl">Stats</p>
        </div>
        <Input
          className="max-w-[100px]"
          endContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-small text-default-400">days</span>
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
