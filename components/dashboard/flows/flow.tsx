"use client";

import {
  Divider,
  Card,
  CardHeader,
  CardBody,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import React from "react";
import { Icon } from "@iconify/react";

import Reloader from "@/components/reloader/Reloader";
import FlowBreadcrumbs from "@/components/dashboard/flows/flow/breadcrumbs";
import { IconWrapper } from "@/lib/IconWrapper";
import { InfoIcon } from "@/components/icons";
import EditFlowModal from "@/components/functions/flows/edit";

import FlowTabs from "./flow/tabs";

export function Flow({
  id,
  projects,
  flow,
  actions,
  executions,
  payloads,
  runners,
}: any) {
  const editFlowModal = useDisclosure();

  return (
    <main>
      {/* ERROR showcase */}
      {projects.error || flow.error || executions.error || payloads.error ? (
        <Card className="shadow shadow-danger">
          <CardHeader className="justify-start gap-2 items-center">
            <IconWrapper className="bg-danger/10 text-danger">
              <InfoIcon className="text-lg" />
            </IconWrapper>
            <p className="text-md font-bold text-danger">Error</p>
          </CardHeader>
          <CardBody>
            {projects.error?.message ||
              flow.error?.message ||
              executions.error?.message ||
              payloads.error?.message}
          </CardBody>
        </Card>
      ) : (
        <>
          <div className="grid lg:grid-cols-2 items-center justify-between">
            <FlowBreadcrumbs id={id} />
            <div className="lg:justify-self-end lg:mt-0 mt-2">
              <Reloader />
            </div>
          </div>
          <div className="flex items-end justify-between mb-4 mt-2">
            <div>
              <h1 className="text-2xl font-bold mb-0 text-primary">
                {flow.name}
              </h1>
              <p className="text-sm text-default-500">{flow.description}</p>
            </div>
            <Button
              color="warning"
              isDisabled={flow.disabled}
              startContent={
                <Icon icon="solar:pen-new-square-broken" width={20} />
              }
              variant="flat"
              onPress={() => {
                editFlowModal.onOpen();
              }}
            >
              Edit
            </Button>
          </div>
          <Divider className="mb-4" />
          {flow.disabled && (
            <div className="mb-4">
              <Card className="bg-danger/10">
                <CardHeader className="justify-start gap-2 items-center">
                  <IconWrapper className="bg-danger/10 text-danger">
                    <InfoIcon className="text-lg" />
                  </IconWrapper>
                  <p className="text-md font-bold text-danger">
                    Flow is currently disabled
                  </p>
                </CardHeader>
                <CardBody>
                  <p className="text-default-500 font-bold">
                    Reason: {flow.disabled_reason}
                  </p>
                </CardBody>
              </Card>
            </div>
          )}
          {flow.maintenance_required && (
            <div className="mb-4">
              <Card className="bg-warning/10">
                <CardHeader className="justify-start gap-2 items-center">
                  <IconWrapper className="bg-warning/10 text-warning">
                    <InfoIcon className="text-lg" />
                  </IconWrapper>
                  <p className="text-md font-bold text-warning">
                    Flow is currently in maintenance mode
                  </p>
                </CardHeader>
                <CardBody>
                  <p className="text-default-500 font-bold">
                    Reason: {flow.maintenance_message}
                  </p>
                </CardBody>
              </Card>
            </div>
          )}
          <div>
            <div className="grid lg:grid-cols-4 grid-cols-2 gap-4">
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
                              ? "solar:danger-triangle-broken"
                              : "solar:check-read-broken"
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
                        <Icon icon="solar:box-broken" width={20} />
                      </div>
                      <div>
                        <p className="text-md font-bold">
                          {
                            projects.find(
                              (project: any) => project.id === flow.project_id,
                            )?.name
                          }
                        </p>
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
                        <Icon icon="solar:rocket-2-broken" width={20} />
                      </div>
                      <div>
                        <p className="text-md font-bold">
                          {flow.runner_id === "any"
                            ? "Any"
                            : runners.find(
                              (runner: any) => runner.id === flow.runner_id,
                            )?.name}
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
                        <Icon icon="solar:reorder-line-duotone" width={20} />
                      </div>
                      <div>
                        <p className="text-md font-bold">
                          {
                            executions.filter(
                              (execution: any) => execution.flow_id === flow.id,
                            ).length
                          }
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
              actions={actions}
              executions={executions}
              flow={flow}
              payloads={payloads}
              runners={runners}
            />
          </div>
        </>
      )}
      <EditFlowModal
        disclosure={editFlowModal}
        flow={flow}
        projects={projects}
      />
    </main>
  );
}
