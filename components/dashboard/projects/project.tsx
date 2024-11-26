"use client";

import React from "react";
import {
  Card,
  CardBody,
  Divider,
  useDisclosure,
  Button,
  Avatar,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import NumberFlow from "@number-flow/react";

import { InfoIcon } from "@/components/icons";
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
  flows,
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
                  project.icon ? project.icon : "solar:question-square-outline"
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
            <h1 className={subtitle({ className: "mb-0 font-bold" })}>
              {project.name}
            </h1>
            <p className="text-sm text-default-500">{project.description}</p>
          </div>
        </div>
        <Button
          color="warning"
          isDisabled={
            project.disabled ||
            (members.find((m: any) => m.user_id === user.id) &&
              members.filter((m: any) => m.user_id === user.id)[0].role ===
                "Viewer")
          }
          startContent={<Icon icon="solar:pen-new-square-outline" width={20} />}
          variant="flat"
          onPress={() => editProjectModal.onOpen()}
        >
          Edit
        </Button>
      </div>
      <Divider className="mb-4" />
      {project.disabled && (
        <div className="mb-4">
          <Card className="bg-danger/20">
            <CardBody>
              <div className="flex items-center gap-2">
                <IconWrapper className="bg-danger/10 text-danger">
                  <InfoIcon className="text-lg" />
                </IconWrapper>
                <p className="text-md font-bold text-danger">
                  Project is currently disabled
                </p>
              </div>
              <p className="text-default-500 font-bold">
                Reason: {project.disabled_reason}
              </p>
            </CardBody>
          </Card>
        </div>
      )}
      <div>
        <div className="grid lg:grid-cols-4 grid-cols-2 items-stretch gap-4">
          <div className="col-span-1">
            <Card fullWidth className="h-full">
              <CardBody>
                <div className="flex items-center gap-2">
                  <div className="flex bg-primary/10 text-primary items-center rounded-small justify-center w-10 h-10">
                    <Icon icon="solar:smile-square-outline" width={20} />
                  </div>
                  <div>
                    <p className="text-md font-bold">
                      <NumberFlow
                        locales="en-US" // Intl.NumberFormat locales
                        value={members.length}
                      />
                    </p>
                    <p className="text-sm text-default-500">Members</p>
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
                    <Icon icon="solar:book-2-outline" width={20} />
                  </div>
                  <div>
                    <p className="text-md font-bold">{flows.length}</p>
                    <p className="text-sm text-default-500">Flows</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
          <div className="col-span-1">
            <Card fullWidth className="h-full">
              <CardBody>
                <div className="flex items-center gap-2">
                  <div className="flex bg-primary/10 text-primary items-center rounded-small justify-center w-10 h-10">
                    <Icon icon="solar:rocket-2-outline" width={20} />
                  </div>
                  <div>
                    <p className="text-md font-bold">
                      {project.alertflow_runners ? (
                        <NumberFlow
                          locales="en-US" // Intl.NumberFormat locales
                          value={runners.length}
                        />
                      ) : (
                        <NumberFlow
                          locales="en-US" // Intl.NumberFormat locales
                          value={
                            runners.filter(
                              (r: any) => r.alertflow_runner === false,
                            ).length
                          }
                        />
                      )}
                    </p>
                    <p className="text-sm text-default-500">Runners</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
          <div className="col-span-1">
            <Card fullWidth className="h-full">
              <CardBody>
                <div className="flex items-center gap-2">
                  <div className="flex bg-primary/10 text-primary items-center rounded-small justify-center w-10 h-10">
                    <Icon icon="solar:key-square-2-outline" width={20} />
                  </div>
                  <div>
                    <p className="text-md font-bold">
                      <NumberFlow
                        locales="en-US" // Intl.NumberFormat locales
                        value={tokens.length}
                      />
                    </p>
                    <p className="text-sm text-default-500">Tokens</p>
                  </div>
                </div>
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
