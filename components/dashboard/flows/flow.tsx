import { Divider, Card, CardHeader, CardBody } from "@nextui-org/react";

import Reloader from "@/components/reloader/Reloader";
import GetFlowExecutions from "@/lib/fetch/flow/executions";
import GetFlow from "@/lib/fetch/flow/flow";
import GetFlowPayloads from "@/lib/fetch/flow/payloads";
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
import GetProjects from "@/lib/fetch/project/all";
import GetProjectRunners from "@/lib/fetch/project/runners";

import FlowTabs from "./flow/tabs";

export async function Flow({ id }: any) {
  const projects = await GetProjects();
  const flow = await GetFlow(id);
  const executions = await GetFlowExecutions(id);
  const payloads = await GetFlowPayloads(id);
  const runners = await GetProjectRunners(flow.project_id);

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
            {/* <EditProjectModal project={data} /> */}
          </div>
          <Divider className="mb-4" />
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
    </main>
  );
}
