import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Progress,
} from "@nextui-org/react";

import {
  PlayCircleIcon,
  UsersIcon,
  TagIcon,
  CalendarIcon,
} from "@/components/icons";
import { IconWrapper } from "@/lib/IconWrapper";
import { subtitle } from "@/components/primitives";
import GetProject from "@/lib/fetch/project/data";
import GetProjectRunners from "@/lib/fetch/project/runners";
import GetProjectApiKeys from "@/lib/fetch/project/apiKeys";
import Reloader from "@/components/reloader/Reloader";

import EditProjectModal from "./project/Edit";
import ProjectBreadcrumbs from "./breadcrumbs";
import ProjectTabs from "./tabs";

export async function Project({ id }: any) {
  const data = await GetProject(id);
  const runners = await GetProjectRunners(id);
  const apiKeys = await GetProjectApiKeys(id);

  return (
    <main>
      <div className="flex items-center justify-between">
        <ProjectBreadcrumbs id={id} />
        <Reloader />
      </div>
      <div className="flex items-end justify-between mb-4 mt-2">
        <div>
          <h1 className={subtitle()} style={{ color: "violet" }}>
            {data.name}
          </h1>
          <p className="text-sm text-default-500">{data.description}</p>
        </div>
        <EditProjectModal project={data} />
      </div>
      <Divider className="mb-4" />
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
                  {new Date(data.created_at).toLocaleString()}
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
      <div className="w-full mt-6">
        <ProjectTabs apiKeys={apiKeys} project={data} runners={runners} />
      </div>
    </main>
  );
}
