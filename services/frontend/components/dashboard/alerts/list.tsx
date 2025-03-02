"use client";

import {
  Button,
  Card,
  CardBody,
  Divider,
  Pagination,
  Spacer,
  useDisclosure,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useMemo, useState } from "react";
import ReactTimeago from "react-timeago";
import { useRouter } from "next/navigation";

import AlertDrawer from "@/components/functions/alert/details";

export default function AlertsList({
  compactMode,
  alerts,
  runners,
  flows,
  maxAlerts,
}: {
  compactMode: boolean;
  maxAlerts: number;
  alerts: any;
  runners: any;
  flows: any;
}) {
  const alertDrawer = useDisclosure();
  const router = useRouter();

  const [targetAlert, setTargetAlert] = useState<any>(null);

  // pagination
  const [page, setPage] = useState(1);
  const pages = Math.ceil(alerts.length / maxAlerts);
  const items = useMemo(() => {
    const start = (page - 1) * maxAlerts;
    const end = start + maxAlerts;

    return alerts.slice(start, end);
  }, [page, alerts]);

  return (
    <main>
      {items.length === 0 && (
        <div className="flex items-center justify-center">
          <p className="text-lg text-default-500">No alerts found</p>
        </div>
      )}
      <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
        {items.map((alert: any) => (
          <Card
            key={alert.id}
            fullWidth
            isPressable
            onPress={() => {
              setTargetAlert(alert);
              alertDrawer.onOpenChange();
            }}
          >
            <CardBody>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex size-10 items-center justify-center rounded-small bg-${alert.status === "firing" ? "danger" : "success"}/10 text-${alert.status === "firing" ? "danger" : "success"}`}
                  >
                    <Icon
                      icon={
                        alert.status === "firing"
                          ? "hugeicons:fire"
                          : "hugeicons:checkmark-badge-01"
                      }
                      width={24}
                    />
                  </div>
                  <div>
                    <p className="text-md font-bold">{alert.name || "N/A"}</p>
                    <p
                      className={`text-sm text-${alert.status === "firing" ? "danger" : "success"} capitalize`}
                    >
                      {alert.status || "N/A"}
                    </p>
                  </div>
                </div>

                {alert.execution_id && (
                  <div className="flex items-center gap-2 h-full">
                    <Button
                      color="primary"
                      size="sm"
                      variant="flat"
                      onPress={() => {
                        router.push(
                          `/flows/${alert.flow_id}/execution/${alert.execution_id}`,
                        );
                      }}
                    >
                      <Icon
                        className="text-primary"
                        icon="hugeicons:rocket-02"
                        width={18}
                      />
                      To Execution
                    </Button>
                  </div>
                )}
              </div>

              <Divider className="mt-2" />
              <Spacer y={2} />

              {/* {!compactMode && (
                <>
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-cols items-center gap-2">
                      <p className="text-default-500">Plugin:</p>
                      {alert.plugin}
                    </div>
                  </div>
                </>
              )} */}

              {/* <Spacer y={2} /> */}

              <div className="flex items-center justify-between">
                <p className="text-sm text-default-500">{alert.plugin}</p>
                <p className="text-sm text-default-500">
                  <ReactTimeago date={alert.created_at} />
                </p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
      {!compactMode && (
        <div className="flex w-full justify-center">
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={page}
            total={pages}
            onChange={(page) => setPage(page)}
          />
        </div>
      )}
      <AlertDrawer
        alert={targetAlert}
        disclosure={alertDrawer}
        flows={flows}
        runners={runners}
      />
    </main>
  );
}
