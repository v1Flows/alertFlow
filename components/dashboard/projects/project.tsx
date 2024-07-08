import React from "react";
import { Card, CardHeader, CardBody, Divider } from "@nextui-org/react";

import {
  PlayCircleIcon,
  UsersIcon,
  TagIcon,
  CalendarIcon,
  InfoIcon,
} from "@/components/icons";
import { IconWrapper } from "@/lib/IconWrapper";
import { subtitle } from "@/components/primitives";
import GetProject from "@/lib/fetch/project/data";
import GetProjectRunners from "@/lib/fetch/project/runners";
import GetProjectApiKeys from "@/lib/fetch/project/apiKeys";
import Reloader from "@/components/reloader/Reloader";

import EditProjectModal from "./project/modals/Edit";
import ProjectBreadcrumbs from "./project/breadcrumbs";
import ProjectTabs from "./project/tabs";

export async function Project({ id, settings }: any) {
  const data = await GetProject(id);
  const runners = await GetProjectRunners(id);
  const apiKeys = await GetProjectApiKeys(id);

  return (
    <main>
      <div className="grid lg:grid-cols-2 items-center justify-between">
        <ProjectBreadcrumbs id={id} />
        <div className="lg:justify-self-end lg:mt-0 mt-2">
          <Reloader />
        </div>
      </div>
      <div className="flex items-end justify-between mb-4 mt-2">
        <div>
          <h1
            className={subtitle({ className: "mb-0 font-bold" })}
            style={{ color: "#0072f5" }}
          >
            {data.name}
          </h1>
          <p className="text-sm text-default-500">{data.description}</p>
        </div>
        <EditProjectModal project={data} />
      </div>
      <Divider className="mb-4" />
      {data.disabled && (
        <div className="mb-4">
          <Card className="bg-danger/10">
            <CardHeader className="justify-start gap-2 items-center">
              <IconWrapper className="bg-danger/10 text-danger">
                <InfoIcon className="text-lg" />
              </IconWrapper>
              <p className="text-md font-bold text-danger">
                Project is currently disabled
              </p>
            </CardHeader>
            <CardBody>
              <p className="text-default-500 font-bold">
                Reason: {data.disabled_reason}
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
                <IconWrapper className="bg-primary/10 text-primary">
                  <UsersIcon className="text-lg" />
                </IconWrapper>
                <p className="text-md font-bold">Members</p>
              </CardHeader>
              <CardBody>
                <p className="text-default-500 font-bold">
                  {data.members.length}
                </p>
              </CardBody>
            </Card>
          </div>
          <div className="col-span-1">
            <Card fullWidth>
              <CardHeader className="justify-start gap-2 items-center">
                <IconWrapper className="bg-warning/10 text-warning">
                  <PlayCircleIcon className="text-lg" />
                </IconWrapper>
                <p className="text-md font-bold">Runners</p>
              </CardHeader>
              <CardBody>
                {data.alertflow_runners ? (
                  <p className="text-default-500 font-bold">{runners.length}</p>
                ) : (
                  <p className="text-default-500 font-bold">
                    {
                      runners.filter((r: any) => r.alertflow_runner === false)
                        .length
                    }
                  </p>
                )}
              </CardBody>
            </Card>
          </div>
          <div className="col-span-1">
            <Card fullWidth>
              <CardHeader className="justify-start gap-2 items-center">
                <IconWrapper className="bg-default/50 text-foreground">
                  <TagIcon className="text-lg" />
                </IconWrapper>
                <p className="text-md font-bold">API Keys</p>
              </CardHeader>
              <CardBody>
                <p className="text-default-500 font-bold">{apiKeys.length}</p>
              </CardBody>
            </Card>
          </div>
          <div className="col-span-1">
            <Card fullWidth>
              <CardHeader className="justify-start gap-2 items-center">
                <IconWrapper className="bg-secondary/10 text-secondary">
                  <CalendarIcon className="text-lg" />
                </IconWrapper>
                <p className="text-md font-bold">Created At</p>
              </CardHeader>
              <CardBody>
                <p className="text-default-500 font-bold">
                  {new Date(data.created_at).toLocaleString("de-DE")}
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
      <div className="w-full mt-6">
        <ProjectTabs
          apiKeys={apiKeys}
          project={data}
          runners={runners}
          settings={settings}
        />
      </div>
    </main>
  );
}
