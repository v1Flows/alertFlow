"use client";

import {
  Divider,
  Card,
  CardBody,
  Button,
  useDisclosure,
  Spacer,
  Alert,
} from "@nextui-org/react";
import React from "react";
import { Icon } from "@iconify/react";
import NumberFlow from "@number-flow/react";

import Reloader from "@/components/reloader/Reloader";
import FlowBreadcrumbs from "@/components/dashboard/flows/flow/breadcrumbs";
import EditFlowModal from "@/components/functions/flows/edit";
import SimulatePayloadModal from "@/components/functions/flows/simulatePayload";

import FlowTabs from "./flow/tabs";

export function Flow({
  id,
  projects,
  project,
  members,
  flow,
  executions,
  payloads,
  runners,
  user,
}: any) {
  const editFlowModal = useDisclosure();
  const simulatePayloadModal = useDisclosure();

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
      <div className="grid lg:grid-cols-2 items-center justify-between">
        <FlowBreadcrumbs id={id} />
        <div className="lg:justify-self-end lg:mt-0 mt-2">
          <Reloader />
        </div>
      </div>
      <Spacer y={2} />
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-0 text-primary">{flow.name}</h1>
          <p className="text-sm text-default-500">{flow.description}</p>
        </div>
        <div className="flex gap-4">
          <Button
            color="secondary"
            isDisabled={flow.disabled}
            startContent={<Icon icon="solar:play-bold-duotone" width={20} />}
            variant="ghost"
            onPress={() => {
              simulatePayloadModal.onOpen();
            }}
          >
            Simulate Payload
          </Button>
          <Button
            color="warning"
            isDisabled={flow.disabled || !checkUserCanEdit()}
            startContent={
              <Icon icon="solar:pen-new-square-outline" width={20} />
            }
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
        <div className="grid lg:grid-cols-5 grid-cols-2 gap-4">
          <div className="col-span-1">
            <Card fullWidth>
              <CardBody>
                <div className="flex items-center gap-2">
                  <div
                    className={`flex bg-${flow.disabled ? "danger" : "success"}/10 text-${flow.disabled ? "danger" : "success"} items-center rounded-small justify-center w-10 h-10`}
                  >
                    <Icon
                      icon={
                        flow.disabled
                          ? "solar:danger-triangle-outline"
                          : "solar:check-read-outline"
                      }
                      width={26}
                    />
                  </div>
                  <div>
                    <p className="text-md font-bold">
                      {flow.disabled ? "Disabled" : "Active"}
                    </p>
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
                  <div className="flex bg-primary/10 text-primary items-center rounded-small justify-center w-10 h-10">
                    <Icon icon="solar:inbox-archive-outline" width={20} />
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
                  <div className="flex bg-primary/10 text-primary items-center rounded-small justify-center w-10 h-10">
                    <Icon icon="solar:rocket-2-outline" width={20} />
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
                  <div className="flex bg-primary/10 text-primary items-center rounded-small justify-center w-10 h-10">
                    <Icon icon="solar:letter-opened-outline" width={20} />
                  </div>
                  <div>
                    <p className="text-md font-bold">
                      <NumberFlow
                        locales="en-US" // Intl.NumberFormat locales
                        value={
                          payloads.filter(
                            (payload: any) => payload.flow_id === flow.id,
                          ).length
                        }
                      />
                    </p>
                    <p className="text-sm text-default-500">Payloads</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
          <div className="col-span-1">
            <Card fullWidth>
              <CardBody>
                <div className="flex items-center gap-2">
                  <div className="flex bg-primary/10 text-primary items-center rounded-small justify-center w-10 h-10">
                    <Icon icon="solar:reorder-linear" width={20} />
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
      <div className="w-full mt-6">
        <FlowTabs
          canEdit={checkUserCanEdit() && !flow.disabled}
          executions={executions}
          flow={flow}
          payloads={payloads}
          runners={runners}
          user={user}
        />
      </div>
      <EditFlowModal
        disclosure={editFlowModal}
        flow={flow}
        projects={projects}
      />
      <SimulatePayloadModal disclosure={simulatePayloadModal} flow={flow} />
    </main>
  );
}
