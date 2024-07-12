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

import Reloader from "@/components/reloader/Reloader";
import FlowBreadcrumbs from "@/components/dashboard/flows/flow/breadcrumbs";
import { subtitle } from "@/components/primitives";
import { IconWrapper } from "@/lib/IconWrapper";
import {
  InfoIcon,
  Server,
  EditDocumentIcon,
  CheckIcon,
  PlayCircleIcon,
} from "@/components/icons";
import EditFlowModal from "@/components/functions/flows/edit";

import FlowTabs from "./flow/tabs";

export function Flow({
  id,
  projects,
  flow,
  executions,
  payloads,
  runners,
  settings,
}: any) {
  const [stopReloading, setStopReloading] = React.useState(false);
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
              <h1
                className={subtitle({ className: "mb-0" })}
                style={{ color: "violet" }}
              >
                {flow.name}
              </h1>
              <p className="text-sm text-default-500">{flow.description}</p>
            </div>
            <Button
              color="warning"
              endContent={<EditDocumentIcon />}
              isDisabled={flow.disabled}
              variant="flat"
              onPress={() => {
                setStopReloading(true);
                editFlowModal.onOpen();
              }}
            >
              Edit Flow
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
                    <IconWrapper className="bg-success/10">
                      <Server
                        className="text-success"
                        fill="currentColor"
                        size={20}
                      />
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
                      <PlayCircleIcon className="text-lg" />
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
                    <IconWrapper className="bg-warning/10 text-warning">
                      <EditDocumentIcon className="text-lg" />
                    </IconWrapper>
                    <p className="text-md font-bold">Last Update</p>
                  </CardHeader>
                  <CardBody>
                    <p className="text-default-500 font-bold">
                      {flow.updated_at
                        ? new Date(flow?.updated_at).toLocaleString("de-DE")
                        : "N/A"}
                    </p>
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
          <div className="w-full mt-6">
            <FlowTabs flow={flow} payloads={payloads} />
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
