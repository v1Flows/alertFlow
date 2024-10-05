"use client";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Progress,
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
      {/* Stats */}
      <div className="flex items-end justify-between my-4">
        <div>
          <p className="text-2xl font-bold mb-0">
            Here are your <span className="text-primary">Stats</span>
          </p>
        </div>
      </div>
      <div className="grid lg:grid-cols-3 grid-cols-1 items-stretch items-center justify-between gap-4">
        <Card>
          <CardBody className="flex justify-center">
            <ul className="flex flex-col gap-2">
              {/* Notifications */}
              {notifications.filter((n: any) => !n.is_read).length > 0 ? (
                <li className="flex items-center gap-2">
                  <IconWrapper className="bg-warning/10 text-warning">
                    <Icon icon="solar:bell-bing-broken" width={24} />
                  </IconWrapper>
                  <p className="text-md font-bold">
                    Notifications:{" "}
                    {notifications.filter((n: any) => !n.is_read).length}{" "}
                    <span className="text-warning">Missed</span>
                  </p>
                </li>
              ) : (
                <li className="flex items-center gap-2">
                  <IconWrapper className="bg-success/10 text-success">
                    <Icon icon="solar:verified-check-broken" width={24} />
                  </IconWrapper>
                  <p className="text-md font-bold">
                    Notifications: <span className="text-success">OK</span>
                  </p>
                </li>
              )}
              {/* Flows */}
              {flows.filter((f: any) => f.maintenance_required).length > 0 ? (
                <li className="flex items-center gap-2">
                  <IconWrapper className="bg-warning/10 text-warning">
                    <Icon icon="solar:info-square-broken" width={24} />
                  </IconWrapper>
                  <p className="text-md font-bold">
                    Flows: <span className="text-warning">need attention</span>
                  </p>
                </li>
              ) : (
                <li className="flex items-center gap-2">
                  <IconWrapper className="bg-success/10 text-success">
                    <Icon icon="solar:verified-check-broken" width={24} />
                  </IconWrapper>
                  <p className="text-md font-bold">
                    Flows: <span className="text-success">OK</span>
                  </p>
                </li>
              )}
              {/* Executions */}
              {executions.filter((e: any) => e.error).length > 0 ? (
                <li className="flex items-center gap-2">
                  <IconWrapper className="bg-danger/10 text-danger">
                    <Icon icon="solar:slash-circle-broken" width={24} />
                  </IconWrapper>
                  <p className="text-md font-bold">
                    Executions: {executions.filter((e: any) => e.error).length}{" "}
                    <span className="text-danger">Failed</span>
                  </p>
                </li>
              ) : (
                <li className="flex items-center gap-2">
                  <IconWrapper className="bg-success/10 text-success">
                    <Icon icon="solar:verified-check-broken" width={24} />
                  </IconWrapper>
                  <p className="text-md font-bold">
                    Executions: <span className="text-success">OK</span>
                  </p>
                </li>
              )}
              {/* Runners */}
              {runners.filter(
                (r: any) => !r.alertflow_runner && !runnerHeartbeatStatus(r),
              ).length > 0 ? (
                <li className="flex items-center gap-2">
                  <IconWrapper className="bg-danger/10 text-danger">
                    <Icon icon="solar:heart-pulse-broken" width={24} />
                  </IconWrapper>
                  <p className="text-md font-bold">
                    Runners: <span className="text-danger">Unhealthy</span>
                  </p>
                </li>
              ) : (
                <li className="flex items-center gap-2">
                  <IconWrapper className="bg-success/10 text-success">
                    <Icon icon="solar:verified-check-broken" width={24} />
                  </IconWrapper>
                  <p className="text-md font-bold">
                    Runners: <span className="text-success">OK</span>
                  </p>
                </li>
              )}
            </ul>
          </CardBody>
        </Card>
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
