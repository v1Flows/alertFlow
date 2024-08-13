"use client";

import {
  Divider,
  Card,
  CardHeader,
  CardBody,
  Button,
  useDisclosure,
  Spinner,
} from "@nextui-org/react";
import React from "react";
import { Icon } from "@iconify/react";

import Reloader from "@/components/reloader/Reloader";
import FlowBreadcrumbs from "@/components/dashboard/flows/flow/breadcrumbs";
import { IconWrapper } from "@/lib/IconWrapper";
import { InfoIcon, CheckIcon } from "@/components/icons";
import EditFlowModal from "@/components/functions/flows/edit";

import FlowTabs from "./flow/tabs";

export function Flow({
  id,
  projects,
  flow,
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
                  <CardHeader className="justify-start gap-2 items-center">
                    <IconWrapper
                      className={`bg-${flow.disabled ? "danger" : "success"}/10 text-${flow.disabled ? "danger" : "success"}`}
                    >
                      {flow.disabled ? (
                        <InfoIcon className="text-lg" />
                      ) : (
                        <CheckIcon className="text-lg" />
                      )}
                    </IconWrapper>
                    <p className="text-md font-bold">Status</p>
                  </CardHeader>
                  <CardBody>
                    <p className="text-default-500 font-bold">
                      {flow.disabled ? "Disabled" : "Active"}
                    </p>
                  </CardBody>
                </Card>
              </div>
              <div className="col-span-1">
                <Card fullWidth>
                  <CardHeader className="justify-start gap-2 items-center">
                    <IconWrapper className="bg-primary/10 text-primary">
                      <Icon icon="solar:box-broken" width={20} />
                    </IconWrapper>
                    <p className="text-md font-bold">Project</p>
                  </CardHeader>
                  <CardBody>
                    <p className="text-default-500 font-bold">
                      {
                        projects.find(
                          (project: any) => project.id === flow.project_id,
                        )?.name
                      }
                    </p>
                  </CardBody>
                </Card>
              </div>
              <div className="col-span-1">
                <Card fullWidth>
                  <CardHeader className="justify-start gap-2 items-center">
                    <IconWrapper className="bg-primary/10 text-primary">
                      <Icon icon="solar:rocket-2-broken" width={20} />
                    </IconWrapper>
                    <p className="text-md font-bold">Runner</p>
                  </CardHeader>
                  <CardBody>
                    <p className="text-default-500 font-bold">
                      {flow.runner_id === "any"
                        ? "Any"
                        : runners.find(
                          (runner: any) => runner.id === flow.runner_id,
                        )?.name}
                    </p>
                  </CardBody>
                </Card>
              </div>
              <div className="col-span-1">
                <Card fullWidth>
                  <CardHeader className="justify-start gap-2 items-center">
                    <IconWrapper className="bg-primary/10 text-primary">
                      <Icon icon="solar:reorder-line-duotone" width={20} />
                    </IconWrapper>
                    <p className="text-md font-bold">Executions</p>
                  </CardHeader>
                  <CardBody>
                    <div className="flex flex-wrap items-center justify-start gap-4">
                      <p className="flex items-center gap-2 text-default-500 font-bold">
                        {executions.length} Total
                      </p>
                      {executions.filter((e: any) => e.running).length > 0 && (
                        <>
                          <Divider className="h-6" orientation="vertical" />
                          <p className="flex items-center gap-2 text-default-500 font-bold">
                            <Spinner color="primary" size="sm" />
                            {executions.filter((e: any) => e.running).length}{" "}
                            Running
                          </p>
                        </>
                      )}
                      {executions.filter((e: any) => e.waiting).length > 0 && (
                        <>
                          <Divider className="h-6" orientation="vertical" />
                          <p className="flex items-center gap-2 text-default-500 font-bold">
                            <Icon
                              className="text-warning"
                              icon="solar:pause-broken"
                              width={20}
                            />
                            {executions.filter((e: any) => e.waiting).length}{" "}
                            Waiting
                          </p>
                        </>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
          <div className="w-full mt-6">
            <FlowTabs
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
