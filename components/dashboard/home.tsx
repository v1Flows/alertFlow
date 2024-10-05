"use client";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Progress,
  Spacer,
  useDisclosure,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";

import { IconWrapper } from "@/lib/IconWrapper";

import SelectPlanModal from "../functions/payment/selectPlan";

import Executions from "./flows/flow/executions";
import ExecutionChartCard from "./executionChartCard";
import PayloadChartCard from "./payloadChartCard";

export function DashboardHome({
  stats,
  notifications,
  flows,
  runners,
  executions,
  payloads,
  user,
}: any) {
  function runnerHeartbeatStatus(runner: any) {
    var timeAgo =
      (new Date(runner.last_heartbeat).getTime() - Date.now()) / 1000;

    if (timeAgo < 0 && timeAgo > -30) {
      return true;
    } else if (timeAgo <= -30) {
      return false;
    }
  }

  return (
    <main>
      <p className="text-xl font-bold">Hello, {user.username} 👋</p>
      <p className="text-default-500">Here's the current status for today.</p>

      <Spacer y={2} />
      <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 items-stretch gap-4">
        <div className="col-span-1">
          <Card fullWidth>
            <CardBody>
              <div className="flex items-center gap-2">
                <div className="flex bg-default/30 text-foreground items-center rounded-small justify-center w-10 h-10">
                  <Icon icon="solar:bell-broken" width={20} />
                </div>
                <div>
                  <p className="text-md font-bold">
                    {notifications.filter((n: any) => !n.is_read).length}
                  </p>
                  <p className="text-sm text-default-500">Notifications</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="col-span-1">
          <Card fullWidth>
            <CardBody>
              <div className="flex items-center gap-2">
                <div className="flex bg-default/30 text-foreground items-center rounded-small justify-center w-10 h-10">
                  <Icon icon="solar:book-bookmark-broken" width={20} />
                </div>
                <div>
                  {flows.filter((f: any) => f.maintenance_required).length > 0 ? (
                    <p className="text-md font-bold text-warning">
                      Needs attention
                    </p>
                  ) : (
                    <p className="text-md font-bold text-success">OK</p>
                  )}
                  <p className="text-sm text-default-500">Flows</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="col-span-1">
          <Card fullWidth>
            <CardBody>
              <div className="flex items-center gap-2">
                <div className="flex bg-default/30 text-foreground items-center rounded-small justify-center w-10 h-10">
                  <Icon icon="solar:reorder-line-duotone" width={20} />
                </div>
                <div>
                  {executions.filter((e: any) => e.error && new Date(e.created_at).getTime() > Date.now() - 24 * 60 * 60 * 1000).length > 0 ? (
                    <p className="text-md font-bold text-danger">
                      {executions.filter((e: any) => e.error && new Date(e.created_at).getTime() > Date.now() - 24 * 60 * 60 * 1000).length} failed
                    </p>
                  ) : (
                    <p className="text-md font-bold text-success">OK</p>
                  )}
                  <p className="text-sm text-default-500">Executions (last 24hours)</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="col-span-1">
          <Card fullWidth>
            <CardBody>
              <div className="flex items-center gap-2">
                <div className="flex bg-default/30 text-foreground items-center rounded-small justify-center w-10 h-10">
                  <Icon icon="solar:rocket-2-broken" width={20} />
                </div>
                <div>
                  {runners.filter(
                    (r: any) => !r.alertflow_runner && !runnerHeartbeatStatus(r),
                  ).length > 0 ? (
                    <p className="text-md font-bold text-danger">
                      {runners.filter(
                        (r: any) => !r.alertflow_runner && !runnerHeartbeatStatus(r),
                      ).length} with issues
                    </p>
                  ) : (
                    <p className="text-md font-bold text-success">OK</p>
                  )}
                  <p className="text-sm text-default-500">Runners</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      <Spacer y={2} />

      {/* Stats */}
      <div className="grid lg:grid-cols-2 grid-cols-1 items-stretch items-center justify-between gap-4">
        <ExecutionChartCard stats={stats} />
        <PayloadChartCard stats={stats} />
      </div>

      {/* Latest executions */}
      <div className="flex items-end justify-between my-4">
        <div>
          <p className="text-2xl font-bold mb-0">
            Latest <span className="text-primary">Executions</span>
          </p>
        </div>
      </div>
      <Executions displayToFlow executions={executions} payloads={payloads} />
    </main>
  );
}
