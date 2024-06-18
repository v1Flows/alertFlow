import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Avatar,
  AvatarGroup,
} from "@nextui-org/react";
import { Users, Play, KeySquare, PencilRuler } from "lucide-react";

import ProjectTabs from "./tabs";

import { subtitle } from "@/components/primitives";
import GetProject from "@/lib/fetch/project/data";
import GetProjectRunners from "@/lib/fetch/project/runners";
import GetProjectApiKeys from "@/lib/fetch/project/apiKeys";

export async function Project({ id }: any) {
  const data = await GetProject(id);
  const runners = await GetProjectRunners(id);
  const apiKeys = await GetProjectApiKeys(id);

  return (
    <main>
      <h1 className={subtitle()} style={{ color: "violet" }}>
        {id}
      </h1>
      <Divider className="mb-4" />
      <div>
        <div className="grid grid-cols-4 gap-2">
          <div className="col-span-1">
            <Card fullWidth>
              <CardHeader className="justify-start gap-3 items-center">
                <Avatar icon={<Users color="black" />} radius="sm" size="sm" />
                <p className="text-md font-bold">Members</p>
              </CardHeader>
              <CardBody>
                <AvatarGroup isBordered>
                  {data.members.map((member: any) => (
                    <Avatar
                      key={member.email}
                      color={member.role === "Owner" ? "danger" : "secondary"}
                      name={member.email}
                    />
                  ))}
                </AvatarGroup>
              </CardBody>
            </Card>
          </div>
          <div className="col-span-1">
            <Card fullWidth>
              <CardHeader className="justify-start gap-3 items-center">
                <Avatar icon={<Play color="black" />} radius="sm" size="sm" />
                <p className="text-md font-bold">Runners</p>
              </CardHeader>
              <CardBody>
                <span>{runners.length}</span>
              </CardBody>
            </Card>
          </div>
          <div className="col-span-1">
            <Card fullWidth>
              <CardHeader className="justify-start gap-3 items-center">
                <Avatar
                  icon={<KeySquare color="black" />}
                  radius="sm"
                  size="sm"
                />
                <p className="text-md font-bold">API Keys</p>
              </CardHeader>
              <CardBody>
                <span>{apiKeys.length}</span>
              </CardBody>
            </Card>
          </div>
          <div className="col-span-1">
            <Card fullWidth>
              <CardHeader className="justify-start gap-3 items-center">
                <Avatar
                  icon={<PencilRuler color="black" />}
                  radius="sm"
                  size="sm"
                />
                <p className="text-md font-bold">Created At</p>
              </CardHeader>
              <CardBody>
                <span>{new Date(data.created_at).toLocaleString()}</span>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
      <div className="w-full mt-6">
        <Card>
          <CardHeader>
            <ProjectTabs apiKeys={apiKeys} project={data} runners={runners} />
          </CardHeader>
        </Card>
      </div>
    </main>
  );
}
