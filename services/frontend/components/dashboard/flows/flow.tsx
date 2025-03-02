"use client";

import { Icon } from "@iconify/react";
import {
  Alert,
  Button,
  Card,
  CardBody,
  Divider,
  Spacer,
  useDisclosure,
} from "@heroui/react";
import NumberFlow from "@number-flow/react";
import React from "react";

import FlowBreadcrumbs from "@/components/dashboard/flows/flow/breadcrumbs";
import EditFlowModal from "@/components/functions/flows/edit";
import SimulateAlertModal from "@/components/functions/flows/simulateAlert";
import Reloader from "@/components/reloader/Reloader";

import FlowTabs from "./flow/tabs";

export function Flow({
  id,
  projects,
  project,
  members,
  flow,
  executions,
  alerts,
  runners,
  user,
}: any) {
  const editFlowModal = useDisclosure();
  const simulateAlertModal = useDisclosure();

  function checkUserCanEdit() {
    if (
      members.find((member: any) => member.user_id === user.id)?.role ===
      "Viewer"
    ) {
      return false;
    } else {
      return true;
    }
  }

  return (
    <main>
      <div className="grid items-center justify-between lg:grid-cols-2">
        <FlowBreadcrumbs id={id} />
        <div className="mt-2 lg:mt-0 lg:justify-self-end">
          <Reloader />
        </div>
      </div>
      <Spacer y={2} />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="mb-0 text-2xl font-bold text-primary">{flow.name}</h1>
          <p className="text-sm text-default-500">{flow.description}</p>
        </div>
        <div className="flex gap-4">
          <Button
            color="secondary"
            isDisabled={flow.disabled}
            startContent={<Icon icon="hugeicons:alert-02" width={20} />}
            variant="flat"
            onPress={() => {
              simulateAlertModal.onOpen();
            }}
          >
            Simulate Alert
          </Button>
          <Button
            color="warning"
            isDisabled={flow.disabled || !checkUserCanEdit()}
            startContent={<Icon icon="hugeicons:pencil-edit-02" width={20} />}
            variant="flat"
            onPress={() => {
              editFlowModal.onOpen();
            }}
          >
            Edit
          </Button>
        </div>
      </div>
      <Divider className="my-4" />
      {flow.disabled && (
        <div className="mb-4">
          <Alert
            color="danger"
            description={flow.disabled_reason}
            title="Flow is currently disabled"
            variant="flat"
          />
        </div>
      )}
      {flow.maintenance && (
        <div className="mb-4">
          <Alert
            color="danger"
            description={flow.maintenance_message}
            title="Flow is currently in maintenance mode"
            variant="flat"
          />
        </div>
      )}
      <div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <div className="col-span-1">
            <Card fullWidth>
              <CardBody>
                <div className="flex items-center gap-2">
                  <div className="flex size-10 items-center justify-center rounded-small bg-primary/10 text-primary">
                    <Icon icon="hugeicons:stethoscope-02" width={24} />
                  </div>
                  <div>
                    {flow.disabled ? (
                      <p className="text-md font-bold text-danger">Disabled</p>
                    ) : (
                      <p className="text-md font-bold text-success">Active</p>
                    )}
                    <p className="text-sm text-default-500">Status</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
          <div className="col-span-1">
            <Card fullWidth>
              <CardBody>
                <div className="flex items-center gap-2">
                  <div className="flex size-10 items-center justify-center rounded-small bg-primary/10 text-primary">
                    <Icon icon="hugeicons:ai-folder-01" width={24} />
                  </div>
                  <div>
                    <p className="text-md font-bold">{project.name}</p>
                    <p className="text-sm text-default-500">Project</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
          <div className="col-span-1">
            <Card fullWidth>
              <CardBody>
                <div className="flex items-center gap-2">
                  <div className="flex size-10 items-center justify-center rounded-small bg-primary/10 text-primary">
                    <Icon icon="hugeicons:ai-brain-04" width={24} />
                  </div>
                  <div>
                    <p className="text-md font-bold">
                      {flow.runner_id === "any"
                        ? "Any"
                        : runners.find(
                            (runner: any) => runner.id === flow.runner_id,
                          )?.name || "Unknown"}
                    </p>
                    <p className="text-sm text-default-500">Runner</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
          <div className="col-span-1">
            <Card fullWidth>
              <CardBody>
                <div className="flex items-center gap-2">
                  <div className="flex size-10 items-center justify-center rounded-small bg-primary/10 text-primary">
                    <Icon icon="hugeicons:alert-02" width={24} />
                  </div>
                  <div>
                    <p className="text-md font-bold">
                      <NumberFlow
                        locales="en-US" // Intl.NumberFormat locales
                        value={
                          alerts.filter(
                            (alert: any) => alert.flow_id === flow.id,
                          ).length
                        }
                      />
                    </p>
                    <p className="text-sm text-default-500">Alerts</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
          <div className="col-span-1">
            <Card fullWidth>
              <CardBody>
                <div className="flex items-center gap-2">
                  <div className="flex size-10 items-center justify-center rounded-small bg-primary/10 text-primary">
                    <Icon icon="hugeicons:rocket-02" width={24} />
                  </div>
                  <div>
                    <p className="text-md font-bold">
                      <NumberFlow
                        locales="en-US" // Intl.NumberFormat locales
                        value={
                          executions.filter(
                            (execution: any) => execution.flow_id === flow.id,
                          ).length
                        }
                      />
                    </p>
                    <p className="text-sm text-default-500">Executions</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
      <div className="mt-6 w-full">
        <FlowTabs
          alerts={alerts}
          canEdit={checkUserCanEdit() && !flow.disabled}
          executions={executions}
          flow={flow}
          runners={runners}
          user={user}
        />
      </div>
      <EditFlowModal
        disclosure={editFlowModal}
        flow={flow}
        projects={projects}
      />
      <SimulateAlertModal disclosure={simulateAlertModal} flow={flow} />
    </main>
  );
}
