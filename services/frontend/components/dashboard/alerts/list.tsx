"use client";

import { Card, CardBody, Divider, Spacer } from "@heroui/react";
import { Icon } from "@iconify/react";
import ReactTimeago from "react-timeago";

export default function AlertsList({
  compactMode,
  alerts,
  runners,
}: {
  compactMode: boolean;
  maxAlerts: number;
  alerts: any;
  runners: any;
}) {
  const maxAlerts = 25;

  return (
    <main>
      {alerts.length === 0 && (
        <div className="flex items-center justify-center">
          <p className="text-lg text-default-500">No alerts found</p>
        </div>
      )}
      <div className="grid lg:grid-cols-3 sm:grid-cols-1 grid-cols-2 gap-4">
        {alerts.slice(0, maxAlerts).map((alert: any) => (
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
                    <p className="text-sm text-default-500 capitalize">
                      {alert.status || "N/A"}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-default-500">
                  <ReactTimeago date={alert.created_at} />
                </p>
              </div>

              {!compactMode && (
                <>
                  <Divider className="mt-2" />
                  <Spacer y={2} />

                  <div className="flex flex-col gap-1">
                    <div className="flex flex-cols items-center gap-2">
                      <p className="text-default-500">Plugin:</p>
                      {alert.plugin}
                    </div>
                  </div>
                </>
              )}
            </CardBody>
          </Card>
        ))}
      </div>
    </main>
  );
}
