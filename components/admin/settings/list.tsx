"use client";
import {
  Button,
  Card,
  CardBody,
  Divider,
  Switch,
  Tooltip,
} from "@nextui-org/react";
import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Icon } from "@iconify/react";

import UpdateSettings from "@/lib/fetch/admin/PUT/UpdateSettings";

export function Settings({ settings }: any) {
  const router = useRouter();

  const [maintenance, setMaintenance] = React.useState(settings.maintenance);
  const [signup, setSignup] = React.useState(settings.signup);
  const [createProjects, setCreateProjects] = React.useState(
    settings.create_projects,
  );
  const [createFlows, setCreateFlows] = React.useState(settings.create_flows);
  const [createRunners, setCreateRunners] = React.useState(
    settings.create_runners,
  );
  const [createTokens, setCreateTokens] = React.useState(
    settings.create_api_keys,
  );
  const [addProjectMembers, setAddProjectMembers] = React.useState(
    settings.add_project_members,
  );
  const [addFlowActions, setAddFlowActions] = React.useState(
    settings.add_flow_actions,
  );
  const [startExecutions, setStartExecutions] = React.useState(
    settings.start_executions,
  );
  const [injectPayloads, setInjectPayloads] = React.useState(
    settings.inject_payloads,
  );

  const [isLoading, setIsLoading] = React.useState(false);

  async function updateSettings() {
    setIsLoading(true);
    const response = await UpdateSettings(
      maintenance,
      signup,
      createProjects,
      createFlows,
      createRunners,
      createTokens,
      addProjectMembers,
      addFlowActions,
      startExecutions,
      injectPayloads,
    ) as any;

    if (response.success) {
      setIsLoading(false);
      toast.success("Settings updated successfully");
      router.refresh();
    } else {
      setIsLoading(false);
      router.refresh();
      toast.error("Failed to update settings");
    }
  }

  return (
    <main>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <p className="text-2xl font-bold mb-0 text-danger">Admin</p>
          <p className="text-2xl mb-0">|</p>
          <p className="text-2xl mb-0">Settings</p>
        </div>
      </div>
      <Divider className="my-4" />
      <div className="grid md:grid-cols-2 gap-4 items-center justify-between">
        <Card
          className={`${maintenance ? "border-danger-200" : "border-default-200"} border-2`}
        >
          <CardBody>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div
                  className={`flex ${maintenance ? "bg-danger/10 text-danger" : "bg-primary/10 text-primary"} items-center rounded-small justify-center w-10 h-10`}
                >
                  <Icon icon="solar:paint-roller-broken" width={20} />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-md font-bold">
                      {maintenance ? "Active" : "Inactive"}
                    </p>
                    <Tooltip
                      content={
                        <p className="text-sm text-default-500">
                          {maintenance
                            ? "Users will see a maintenance page when they visit the website."
                            : "Users will be able to access the website normally."}
                        </p>
                      }
                    >
                      <Icon
                        className="text-default-500"
                        icon="solar:info-circle-bold"
                        width={18}
                      />
                    </Tooltip>
                  </div>
                  <p className="text-sm text-default-500">Maintenance</p>
                </div>
              </div>
              <Switch
                color="danger"
                isSelected={maintenance}
                size="sm"
                onValueChange={setMaintenance}
              />
            </div>
          </CardBody>
        </Card>

        <Card
          className={`${signup ? "border-success-200" : "border-danger-200"} border-2`}
        >
          <CardBody>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div
                  className={`flex ${signup ? "bg-primary/10 text-primary" : "bg-danger/10 text-danger"} items-center rounded-small justify-center w-10 h-10`}
                >
                  <Icon icon="solar:user-plus-broken" width={20} />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-md font-bold">
                      {signup ? "Enabled" : "Disabled"}
                    </p>
                    <Tooltip
                      content={
                        "Disabling this option will prevent users from signing up."
                      }
                    >
                      <Icon
                        className="text-default-500"
                        icon="solar:info-circle-bold"
                        width={18}
                      />
                    </Tooltip>
                  </div>
                  <p className="text-sm text-default-500">Sign Up</p>
                </div>
              </div>
              <Switch
                color="success"
                isSelected={signup}
                size="sm"
                onValueChange={setSignup}
              />
            </div>
          </CardBody>
        </Card>

        <Card
          className={`${createProjects ? "border-success-200" : "border-danger-200"} border-2`}
        >
          <CardBody>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div
                  className={`flex ${createProjects ? "bg-primary/10 text-primary" : "bg-danger/10 text-danger"} items-center rounded-small justify-center w-10 h-10`}
                >
                  <Icon icon="solar:box-broken" width={20} />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-md font-bold">
                      {createProjects ? "Enabled" : "Disabled"}
                    </p>
                    <Tooltip
                      content={
                        "Disabling this option will prevent users from creating new projects"
                      }
                    >
                      <Icon
                        className="text-default-500"
                        icon="solar:info-circle-bold"
                        width={18}
                      />
                    </Tooltip>
                  </div>
                  <p className="text-sm text-default-500">Create Projects</p>
                </div>
              </div>
              <Switch
                color="success"
                isSelected={createProjects}
                size="sm"
                onValueChange={setCreateProjects}
              />
            </div>
          </CardBody>
        </Card>

        <Card
          className={`${createFlows ? "border-success-200" : "border-danger-200"} border-2`}
        >
          <CardBody>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div
                  className={`flex ${createFlows ? "bg-primary/10 text-primary" : "bg-danger/10 text-danger"} items-center rounded-small justify-center w-10 h-10`}
                >
                  <Icon icon="solar:book-2-outline" width={20} />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-md font-bold">
                      {createFlows ? "Enabled" : "Disabled"}
                    </p>
                    <Tooltip
                      content={
                        "Disabling this option will prevent users from creating new flows"
                      }
                    >
                      <Icon
                        className="text-default-500"
                        icon="solar:info-circle-bold"
                        width={18}
                      />
                    </Tooltip>
                  </div>
                  <p className="text-sm text-default-500">Create Flows</p>
                </div>
              </div>
              <Switch
                color="success"
                isSelected={createFlows}
                size="sm"
                onValueChange={setCreateFlows}
              />
            </div>
          </CardBody>
        </Card>

        <Card
          className={`${createRunners ? "border-success-200" : "border-danger-200"} border-2`}
        >
          <CardBody>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div
                  className={`flex ${createRunners ? "bg-primary/10 text-primary" : "bg-danger/10 text-danger"} items-center rounded-small justify-center w-10 h-10`}
                >
                  <Icon icon="solar:rocket-2-broken" width={20} />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-md font-bold">
                      {createRunners ? "Enabled" : "Disabled"}
                    </p>
                    <Tooltip
                      content={
                        "Disabling this option will prevent users from creating new runners within projects"
                      }
                    >
                      <Icon
                        className="text-default-500"
                        icon="solar:info-circle-bold"
                        width={18}
                      />
                    </Tooltip>
                  </div>
                  <p className="text-sm text-default-500">Create Runners</p>
                </div>
              </div>
              <Switch
                color="success"
                isSelected={createRunners}
                size="sm"
                onValueChange={setCreateRunners}
              />
            </div>
          </CardBody>
        </Card>

        <Card
          className={`${createTokens ? "border-success-200" : "border-danger-200"} border-2`}
        >
          <CardBody>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div
                  className={`flex ${createTokens ? "bg-primary/10 text-primary" : "bg-danger/10 text-danger"} items-center rounded-small justify-center w-10 h-10`}
                >
                  <Icon icon="solar:key-square-2-broken" width={20} />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-md font-bold">
                      {createTokens ? "Enabled" : "Disabled"}
                    </p>
                    <Tooltip
                      content={
                        "Disabling this option will prevent users from creating new tokens within projects"
                      }
                    >
                      <Icon
                        className="text-default-500"
                        icon="solar:info-circle-bold"
                        width={18}
                      />
                    </Tooltip>
                  </div>
                  <p className="text-sm text-default-500">Create Tokens</p>
                </div>
              </div>
              <Switch
                color="success"
                isSelected={createTokens}
                size="sm"
                onValueChange={setCreateTokens}
              />
            </div>
          </CardBody>
        </Card>

        <Card
          className={`${addProjectMembers ? "border-success-200" : "border-danger-200"} border-2`}
        >
          <CardBody>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div
                  className={`flex ${addProjectMembers ? "bg-primary/10 text-primary" : "bg-danger/10 text-danger"} items-center rounded-small justify-center w-10 h-10`}
                >
                  <Icon
                    icon="solar:users-group-two-rounded-bold-duotone"
                    width={20}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-md font-bold">
                      {addProjectMembers ? "Enabled" : "Disabled"}
                    </p>
                    <Tooltip
                      content={
                        "Disabling this option will prevent project owners and editors from inviting new members to projects"
                      }
                    >
                      <Icon
                        className="text-default-500"
                        icon="solar:info-circle-bold"
                        width={18}
                      />
                    </Tooltip>
                  </div>
                  <p className="text-sm text-default-500">
                    Invite Project Members
                  </p>
                </div>
              </div>
              <Switch
                color="success"
                isSelected={addProjectMembers}
                size="sm"
                onValueChange={setAddProjectMembers}
              />
            </div>
          </CardBody>
        </Card>

        <Card
          className={`${addFlowActions ? "border-success-200" : "border-danger-200"} border-2`}
        >
          <CardBody>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div
                  className={`flex ${addFlowActions ? "bg-primary/10 text-primary" : "bg-danger/10 text-danger"} items-center rounded-small justify-center w-10 h-10`}
                >
                  <Icon icon="solar:bolt-bold-duotone" width={20} />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-md font-bold">
                      {addFlowActions ? "Enabled" : "Disabled"}
                    </p>
                    <Tooltip
                      content={
                        "Disabling this option will prevent project owners & editors from adding new actions to any flow"
                      }
                    >
                      <Icon
                        className="text-default-500"
                        icon="solar:info-circle-bold"
                        width={18}
                      />
                    </Tooltip>
                  </div>
                  <p className="text-sm text-default-500">Add Flow Actions</p>
                </div>
              </div>
              <Switch
                color="success"
                isSelected={addFlowActions}
                size="sm"
                onValueChange={setAddFlowActions}
              />
            </div>
          </CardBody>
        </Card>

        <Card
          className={`${startExecutions ? "border-success-200" : "border-danger-200"} border-2`}
        >
          <CardBody>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div
                  className={`flex ${startExecutions ? "bg-primary/10 text-primary" : "bg-danger/10 text-danger"} items-center rounded-small justify-center w-10 h-10`}
                >
                  <Icon icon="solar:reorder-line-duotone" width={20} />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-md font-bold">
                      {startExecutions ? "Enabled" : "Disabled"}
                    </p>
                    <Tooltip
                      content={
                        "Disabling this option will prevent runners from starting a new executions"
                      }
                    >
                      <Icon
                        className="text-default-500"
                        icon="solar:info-circle-bold"
                        width={18}
                      />
                    </Tooltip>
                  </div>
                  <p className="text-sm text-default-500">Start Executions</p>
                </div>
              </div>
              <Switch
                color="success"
                isSelected={startExecutions}
                size="sm"
                onValueChange={setStartExecutions}
              />
            </div>
          </CardBody>
        </Card>

        <Card
          className={`${injectPayloads ? "border-success-200" : "border-danger-200"} border-2`}
        >
          <CardBody>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div
                  className={`flex ${injectPayloads ? "bg-primary/10 text-primary" : "bg-danger/10 text-danger"} items-center rounded-small justify-center w-10 h-10`}
                >
                  <Icon icon="solar:letter-opened-broken" width={20} />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-md font-bold">
                      {injectPayloads ? "Enabled" : "Disabled"}
                    </p>
                    <Tooltip
                      content={
                        "Disabling this option will prevent incoming payloads from being registered at AlertFlow."
                      }
                    >
                      <Icon
                        className="text-default-500"
                        icon="solar:info-circle-bold"
                        width={18}
                      />
                    </Tooltip>
                  </div>
                  <p className="text-sm text-default-500">Inject Payloads</p>
                </div>
              </div>
              <Switch
                color="success"
                isSelected={injectPayloads}
                size="sm"
                onValueChange={setInjectPayloads}
              />
            </div>
          </CardBody>
        </Card>
      </div>
      <div className="my-4 w-full">
        <Button
          className="w-full"
          color="primary"
          isLoading={isLoading}
          variant="flat"
          onPress={updateSettings}
        >
          Save Settings
        </Button>
      </div>
    </main>
  );
}
