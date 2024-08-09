"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  useDisclosure,
  Button,
  Avatar,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";

import { CalendarIcon, InfoIcon } from "@/components/icons";
import { IconWrapper } from "@/lib/IconWrapper";
import { subtitle } from "@/components/primitives";
import Reloader from "@/components/reloader/Reloader";
import EditProjectModal from "@/components/functions/projects/edit";

import ProjectBreadcrumbs from "./project/breadcrumbs";
import ProjectTabs from "./project/tabs";

export default function Project({
  user,
  settings,
  project,
  members,
  runners,
  tokens,
  plan,
  audit,
}: any) {
  const editProjectModal = useDisclosure();

  return (
    <main>
      <div className="grid lg:grid-cols-2 items-center justify-between">
        <ProjectBreadcrumbs id={project.id} />
        <div className="lg:justify-self-end lg:mt-0 mt-2">
          <Reloader />
        </div>
      </div>
      <div className="flex items-center justify-between mb-2 mt-2">
        <div className="flex items-center gap-2">
          <Avatar
            classNames={{
              base: `text-white`,
            }}
            icon={
              <Icon
                icon={
                  project.icon ? project.icon : "solar:question-square-broken"
                }
                width={24}
              />
            }
            radius="md"
            style={{
              backgroundColor: project.color,
            }}
          />
          <div className="flex flex-col items-start">
            <h1
              className={subtitle({ className: "mb-0 font-bold" })}
              style={{ color: "#0072f5" }}
            >
              {project.name}
            </h1>
            <p className="text-sm text-default-500">{project.description}</p>
          </div>
        </div>
        <Button
          color="warning"
          isDisabled={
            project.disabled ||
            members.filter((m: any) => m.user_id === user.id)[0].role ===
              "Viewer"
          }
          startContent={<Icon icon="solar:pen-new-square-broken" width={20} />}
          variant="flat"
          onPress={() => editProjectModal.onOpen()}
        >
          Edit
        </Button>
      </div>
      <Divider className="mb-4" />
      {project.disabled && (
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
                Reason: {project.disabled_reason}
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
                  <Icon icon="solar:smile-square-broken" width={20} />
                </IconWrapper>
                <p className="text-md font-bold">Members</p>
              </CardHeader>
              <CardBody>
                <p className="text-default-500 font-bold">{members.length}</p>
              </CardBody>
            </Card>
          </div>
          <div className="col-span-1">
            <Card fullWidth>
              <CardHeader className="justify-start gap-2 items-center">
                <IconWrapper className="bg-warning/10 text-warning">
                  <Icon icon="solar:rocket-2-broken" width={20} />
                </IconWrapper>
                <p className="text-md font-bold">Runners</p>
              </CardHeader>
              <CardBody>
                {project.alertflow_runners ? (
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
                  <Icon icon="solar:key-square-2-broken" width={20} />
                </IconWrapper>
                <p className="text-md font-bold">Tokens</p>
              </CardHeader>
              <CardBody>
                <p className="text-default-500 font-bold">{tokens.length}</p>
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
                  {new Date(project.created_at).toLocaleString("de-DE")}
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
      <div className="w-full mt-6">
        <ProjectTabs
          audit={audit}
          members={members}
          plan={plan}
          project={project}
          runners={runners}
          settings={settings}
          tokens={tokens}
          user={user}
        />
      </div>
      <EditProjectModal disclosure={editProjectModal} project={project} />
    </main>
  );
}
