"use client";

import { Card, CardBody, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Spacer } from "@nextui-org/react";
import { Icon } from "@iconify/react";

import Executions from "./flows/flow/executions";
import ExecutionChartCard from "./executionChartCard";
import PayloadChartCard from "./payloadChartCard";
import ReactTimeago from "react-timeago";
import { Divide } from "lucide-react";
import { useRouter } from "next/navigation";

export function DashboardHome({
  stats,
  notifications,
  flows,
  runners,
  executions,
  payloads,
  user,
}: any) {
  const router = useRouter();

  function runnerHeartbeatStatus(runner: any) {
    var timeAgo =
      (new Date(runner.last_heartbeat).getTime() - Date.now()) / 1000;

    if (timeAgo < 0 && timeAgo > -30) {
      return true;
    } else if (timeAgo <= -30) {
      return false;
    }
  }

  function heartbeatColor(runner: any) {
    var timeAgo =
      (new Date(runner.last_heartbeat).getTime() - Date.now()) / 1000;

    if (timeAgo < 0 && timeAgo > -30) {
      return "success";
    } else if (timeAgo <= -30 && timeAgo > -60) {
      return "warning";
    } else if (timeAgo <= -60) {
      return "danger";
    }
  }

  return (
    <main>
      <p className="text-xl font-bold">Hello, {user.username} 👋</p>
      <p className="text-default-500">
        Here&apos;s the current status for today.
      </p>

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
          <Dropdown placement="bottom" backdrop="opaque">
            <DropdownTrigger>
              <Card fullWidth isPressable isHoverable>
                <CardBody>
                  <div className="flex items-center gap-2">
                    <div className="flex bg-default/30 text-foreground items-center rounded-small justify-center w-10 h-10">
                      <Icon icon="solar:book-bookmark-broken" width={20} />
                    </div>
                    <div>
                      {flows.filter((f: any) => f.maintenance_required).length >
                        0 ? (
                        <p className="text-md font-bold text-warning">
                          {flows.filter((f: any) => f.maintenance_required).length} need attention
                        </p>
                      ) : (
                        <p className="text-md font-bold text-success">OK</p>
                      )}
                      <p className="text-sm text-default-500">Flows</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </DropdownTrigger>
            <DropdownMenu aria-label="Flow Problems">
              {flows
                .filter((f: any) => f.maintenance_required)
                .map((flow: any) => (
                  <DropdownItem key={flow.id} onPress={() => {
                    router.push(`/dashboard/flows/${flow.id}`);
                  }}>
                    <div className="flex justify-between items-center gap-4">
                      <div className="flex items-center justify-start gap-2">
                        <div className="flex bg-default/30 text-foreground items-center rounded-small justify-center w-10 h-10">
                          <Icon icon="solar:danger-triangle-broken" width={20} className="text-warning" />
                        </div>
                        <div className="items-start">
                          <p className="text-md font-bold">{flow.name}</p>
                          <p className="text-sm text-default-500">
                            Message: {flow.maintenance_message}
                          </p>
                        </div>
                      </div>
                      <Icon icon="akar-icons:arrow-right" />
                    </div>
                  </DropdownItem>
                ))}
            </DropdownMenu>
          </Dropdown>
        </div>

        <div className="col-span-1">
          <Dropdown placement="bottom" backdrop="opaque">
            <DropdownTrigger>
              <Card fullWidth isPressable isHoverable>
                <CardBody>
                  <div className="flex items-center gap-2">
                    <div className="flex bg-default/30 text-foreground items-center rounded-small justify-center w-10 h-10">
                      <Icon icon="solar:reorder-line-duotone" width={20} />
                    </div>
                    <div>
                      {executions.filter(
                        (e: any) =>
                          e.error &&
                          new Date(e.created_at).getTime() >
                          Date.now() - 24 * 60 * 60 * 1000,
                      ).length > 0 ? (
                        <p className="text-md font-bold text-danger">
                          {
                            executions.filter(
                              (e: any) =>
                                e.error &&
                                new Date(e.created_at).getTime() >
                                Date.now() - 24 * 60 * 60 * 1000,
                            ).length
                          }{" "}
                          Failed
                        </p>
                      ) : (
                        <p className="text-md font-bold text-success">OK</p>
                      )}
                      <p className="text-sm text-default-500">
                        Executions (last 24hours)
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </DropdownTrigger>
            <DropdownMenu aria-label="Execution Problems">
              {executions
                .filter(
                  (e: any) =>
                    e.error &&
                    new Date(e.created_at).getTime() >
                    Date.now() - 24 * 60 * 60 * 1000,
                )
                .sort((a: any, b: any) =>
                  new Date(a.created_at) < new Date(b.created_at) ? 1 : -1,
                )
                .map((execution: any) => (
                  <DropdownItem key={execution.id} onPress={() => {
                    router.push(`/dashboard/flows/${execution.flow_id}/execution/${execution.id}`);
                  }}>
                    <div className="flex justify-between items-center gap-4">
                      <div className="flex items-center justify-start gap-2">
                        <div className="flex bg-default/30 text-foreground items-center rounded-small justify-center w-10 h-10">
                          <Icon icon="solar:danger-triangle-broken" width={20} className="text-danger" />
                        </div>
                        <div>
                          <p className="text-md font-bold">{execution.id}</p>
                          <p className="text-sm text-default-500">
                            Flow: {flows.find((f: any) => f.id === execution.flow_id).name}
                          </p>
                          <p className="text-sm text-default-500">
                            Executed at: <ReactTimeago date={execution.executed_at} />
                          </p>
                        </div>
                      </div>
                      <Icon icon="akar-icons:arrow-right" />
                    </div>
                  </DropdownItem>
                ))}
            </DropdownMenu>
          </Dropdown>
        </div>

        <div className="col-span-1">
          <Dropdown placement="bottom" backdrop="opaque">
            <DropdownTrigger>
              <Card fullWidth isPressable isHoverable>
                <CardBody>
                  <div className="flex items-center gap-2">
                    <div className="flex bg-default/30 text-foreground items-center rounded-small justify-center w-10 h-10">
                      <Icon icon="solar:rocket-2-broken" width={20} />
                    </div>
                    <div>
                      {runners.filter(
                        (r: any) =>
                          !r.alertflow_runner && !runnerHeartbeatStatus(r),
                      ).length > 0 ? (
                        <p className="text-md font-bold text-danger">
                          {
                            runners.filter(
                              (r: any) =>
                                !r.alertflow_runner && !runnerHeartbeatStatus(r),
                            ).length
                          }{" "}
                          with issues
                        </p>
                      ) : (
                        <p className="text-md font-bold text-success">OK</p>
                      )}
                      <p className="text-sm text-default-500">Runners</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </DropdownTrigger>
            <DropdownMenu aria-label="Runner Problems">
              {runners
                .filter(
                  (r: any) =>
                    !r.alertflow_runner && !runnerHeartbeatStatus(r),
                )
                .map((runner: any) => (
                  <DropdownItem key={runner.id} onPress={() => {
                    router.push(`/dashboard/projects/${runner.project_id}?tab=runners`);
                  }}>
                    <div className="flex justify-between items-center gap-4">
                      <div className="flex items-center justify-start gap-2">
                        <div className="flex bg-default/30 text-foreground items-center rounded-small justify-center w-10 h-10">
                          <Icon icon="solar:danger-triangle-broken" width={20} className={`text-${heartbeatColor(runner)}`} />
                        </div>
                        <div>
                          <p className="text-md font-bold">{runner.name}</p>
                          <p className="text-sm text-default-500">
                            {runner.last_heartbeat
                              ? (
                                <p>Last Heartbeat: <span className={`font-bold text-${heartbeatColor(runner)}`}><ReactTimeago date={runner.last_heartbeat} /></span></p>
                              )
                              : "No heartbeat"}
                          </p>
                        </div>
                      </div>
                      <Icon icon="akar-icons:arrow-right" />
                    </div>
                  </DropdownItem>
                ))}
            </DropdownMenu>
          </Dropdown>
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
