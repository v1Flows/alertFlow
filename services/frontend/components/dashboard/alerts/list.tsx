"use client";

import { Card, CardBody, Chip, Divider, Spacer } from "@heroui/react";
import { Icon } from "@iconify/react";
import NumberFlow from "@number-flow/react";
import { toLower } from "lodash";
import ReactTimeago from "react-timeago";

export default function AlertsList({ alerts, runners }: any) {
  return (
    <main>
      <div className="grid lg:grid-cols-3 sm:grid-cols-1 grid-cols-2 gap-4">
        {alerts.map((alert: any) => (
          <Card key={alert.id} fullWidth isPressable>
            <CardBody>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex size-10 items-center justify-center rounded-small bg-danger/10 text-danger">
                    <Icon icon="hugeicons:fire" width={24} />
                  </div>
                  <div>
                    <p className="text-md font-bold text-danger">
                      {alert.name || "N/A"}
                    </p>
                    <p className="text-sm text-default-500">Firing</p>
                  </div>
                </div>
                <p className="text-sm text-default-500">
                  <ReactTimeago date={alert.created_at} />
                </p>
              </div>

              <Divider className="mt-2" />
              <Spacer y={2} />

              <div className="flex flex-col gap-1">
                <div className="flex flex-cols items-center gap-2">
                  <p className="text-default-500">Affected:</p>
                  {alert.affected.map((affected: any) => (
                    <Chip key={affected} radius="sm" variant="bordered">
                      {affected || "N/A"}
                    </Chip>
                  ))}
                </div>
                <div className="flex flex-cols items-center gap-2">
                  <p className="text-default-500">Grouped Alerts:</p>
                  <p
                    className={`text-md font-bold ${
                      alert.grouped_alerts.length > 0
                        ? "text-danger"
                        : "text-default"
                    }`}
                  >
                    <NumberFlow
                      locales="en-US"
                      value={alert.grouped_alerts.length}
                    />
                  </p>
                </div>
                <div className="flex flex-cols items-center gap-2">
                  <p className="text-default-500">Origin:</p>
                  {alert.origin}
                </div>
                <Spacer y={1} />
                {runners.map((runner: any) =>
                  runner.alert_endpoints.map((endpoint: any) => {
                    if (toLower(endpoint.name) === toLower(alert.plugin)) {
                      return (
                        <div key={endpoint} className="flex items-center gap-2">
                          <Icon
                            icon={
                              endpoint.icon || "hugeicons:bubble-chat-question"
                            }
                            width={24}
                          />
                          <div>
                            <p>{endpoint.name}</p>
                            <p className="text-xs text-default-500">Endpoint</p>
                          </div>
                        </div>
                      );
                    }
                  }),
                )}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </main>
  );
}
