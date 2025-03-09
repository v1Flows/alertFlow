"use client";

import {
  Card,
  CardBody,
  CardFooter,
  Chip,
  Divider,
  Listbox,
  ListboxItem,
  Pagination,
  Spacer,
  useDisclosure,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useMemo, useState } from "react";
import ReactTimeago from "react-timeago";

import AlertDrawer from "@/components/functions/alert/details";
import { IconWrapper } from "@/lib/IconWrapper";

export default function AlertsList({
  compactMode,
  alerts,
  runners,
  flows,
  maxAlerts,
  canEdit,
  showDelete,
}: {
  compactMode: boolean;
  maxAlerts: number;
  alerts: any;
  runners: any;
  flows?: any;
  canEdit?: boolean;
  showDelete?: boolean;
}) {
  const alertDrawer = useDisclosure();

  const [targetAlert, setTargetAlert] = useState<any>(null);

  // pagination
  const [page, setPage] = useState(1);
  const pages = Math.ceil(
    alerts.filter((alert: any) => !alert.parent_id).length / maxAlerts,
  );
  const items = useMemo(() => {
    const filteredAlerts = alerts.filter((alert: any) => !alert.parent_id);
    const start = (page - 1) * maxAlerts;
    const end = start + maxAlerts;

    return filteredAlerts.slice(start, end);
  }, [page, alerts]);

  return (
    <main>
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

                <div className="flex flex-wrap justify-end gap-2">
                  <Chip color="default" radius="sm" size="md" variant="flat">
                    Flow:{" "}
                    {flows.filter((f: any) => f.id === alert.flow_id)[0].name}
                  </Chip>
                  {alerts.filter((a: any) => a.parent_id === alert.id).length >
                    0 && (
                    <>
                      <Chip
                        color="primary"
                        radius="sm"
                        size="md"
                        variant="flat"
                      >
                        Parent Alert
                      </Chip>
                      <Chip
                        color="default"
                        radius="sm"
                        size="md"
                        variant="flat"
                      >
                        {
                          alerts.filter((a: any) => a.parent_id === alert.id)
                            .length
                        }{" "}
                        Sub Alert/s
                      </Chip>
                    </>
                  )}
                </div>
              </div>

              <Divider className="mt-2" />
              <Spacer y={2} />

              {alerts.filter((a: any) => a.parent_id === alert.id).length >
                0 && (
                <>
                  <p className="text-sm font-bold">Grouped Alerts</p>
                  <Spacer y={2} />
                  <Listbox
                    aria-label="User Menu"
                    className="p-0 gap-0 divide-y divide-default-300/50 dark:divide-default-100/80 bg-content1 overflow-visible shadow-small rounded-medium"
                    itemClasses={{
                      base: "px-3 first:rounded-t-medium last:rounded-b-medium rounded-none gap-3 h-12 data-[hover=true]:bg-default-100/80",
                    }}
                    onAction={(key) => alert(key)}
                  >
                    {alerts.map((a: any) => {
                      if (a.parent_id === alert.id) {
                        return (
                          <ListboxItem
                            key={a.id}
                            className="group h-auto py-3"
                            startContent={
                              <IconWrapper
                                className={`bg-${a.status === "firing" ? "danger" : "success"}/10 text-${a.status === "firing" ? "danger" : "success"}`}
                              >
                                <Icon
                                  className="text-lg"
                                  icon={
                                    a.status === "firing"
                                      ? "hugeicons:fire"
                                      : "hugeicons:checkmark-badge-01"
                                  }
                                />
                              </IconWrapper>
                            }
                            textValue={a.name}
                            onPress={() => {
                              setTargetAlert(a);
                              alertDrawer.onOpenChange();
                            }}
                          >
                            <div className="flex flex-col gap-1">
                              <span>{a.name}</span>
                              <div className="px-2 py-1 rounded-small bg-default-100 group-data-[hover=true]:bg-default-200">
                                <span
                                  className={`text-tiny text-${a.status === "firing" ? "danger" : "success"} capitalize`}
                                >
                                  {a.status || "N/A"}
                                </span>
                                <div className="flex gap-2 text-tiny">
                                  <span className="text-default-500">
                                    <ReactTimeago date={a.created_at} />
                                  </span>
                                  {new Date(a.created_at).getTime() ===
                                    Math.max(
                                      ...alerts
                                        .filter(
                                          (alert: any) =>
                                            alert.parent_id === a.parent_id,
                                        )
                                        .map((alert: any) =>
                                          new Date(alert.created_at).getTime(),
                                        ),
                                    ) && (
                                    <span className="text-success">Latest</span>
                                  )}
                                  {a.execution_id !== "" && (
                                    <span className="text-primary">
                                      Executed
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </ListboxItem>
                        );
                      }
                    })}
                  </Listbox>
                </>
              )}
            </CardBody>
            <CardFooter className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-2">
                {alert.execution_id !== "" && (
                  <Chip color="primary" radius="sm" size="sm" variant="solid">
                    Executed
                  </Chip>
                )}
                {alert.group_key !== "" && (
                  <Chip radius="sm" size="sm" variant="solid">
                    Group Ident: {alert.group_key}
                  </Chip>
                )}
                <Chip radius="sm" size="sm" variant="solid">
                  Plugin: {alert.plugin}
                </Chip>
              </div>
              <div className="flex flex-col lg:justify-end gap-2">
                {alert.updated_at !== "0001-01-01T00:00:00Z" && (
                  <Chip radius="sm" size="sm" variant="flat">
                    <span className="text-default-600">
                      Last Update: <ReactTimeago date={alert.updated_at} />
                    </span>
                  </Chip>
                )}
                <Chip radius="sm" size="sm" variant="flat">
                  <span className="text-default-600">
                    Created: <ReactTimeago date={alert.created_at} />
                  </span>
                </Chip>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      {!compactMode && (
        <div className="flex w-full mt-4 justify-center">
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
        canEdit={canEdit}
        disclosure={alertDrawer}
        flows={flows}
        runners={runners}
        showDelete={showDelete}
      />
    </main>
  );
}
