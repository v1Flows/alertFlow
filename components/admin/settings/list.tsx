"use client";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Switch,
} from "@nextui-org/react";
import {
  ConstructionIcon,
  FileTerminalIcon,
  MilestoneIcon,
} from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";

import {
  Flash,
  MailIcon,
  PlayCircleIcon,
  Server,
  TagIcon,
  UsersIcon,
} from "@/components/icons";
import UpdateSettings from "@/lib/fetch/admin/POST/UpdateSettings";

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
  const [createApiKeys, setCreateApiKeys] = React.useState(
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
      createApiKeys,
      addProjectMembers,
      addFlowActions,
      startExecutions,
      injectPayloads,
    );

    if (!response.error) {
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
      <Toaster richColors position="bottom-center" />
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
          <CardHeader className="flex justify-between items-center">
            <div className="flex items-center space-x-1">
              <ConstructionIcon className="h-4 w-4" />
              <p className="text-md font-bold">Maintenance</p>
            </div>
            <Switch
              color="danger"
              isSelected={maintenance}
              size="sm"
              onValueChange={setMaintenance}
            />
          </CardHeader>
          <CardBody>
            <p className="text-sm text-default-500">
              Enabling maintenance mode will have to following effects to users:
            </p>
          </CardBody>
        </Card>

        <Card
          className={`${signup ? "border-success-200" : "border-danger-200"} border-2`}
        >
          <CardHeader className="flex justify-between items-center">
            <div className="flex items-center space-x-1">
              <MilestoneIcon className="h-4 w-4" />
              <p className="text-md font-bold">SignUp</p>
            </div>
            <Switch
              color="success"
              isSelected={signup}
              size="sm"
              onValueChange={setSignup}
            />
          </CardHeader>
          <CardBody>
            <p className="text-sm text-default-500">
              Disabling this option will prevent users from signing up.
            </p>
          </CardBody>
        </Card>

        <Card
          className={`${createProjects ? "border-success-200" : "border-danger-200"} border-2`}
        >
          <CardHeader className="flex justify-between items-center">
            <div className="flex items-center space-x-1">
              <Server className="h-4 w-4" />
              <p className="text-md font-bold">Create Projects</p>
            </div>
            <Switch
              color="success"
              isSelected={createProjects}
              size="sm"
              onValueChange={setCreateProjects}
            />
          </CardHeader>
          <CardBody>
            <p className="text-sm text-default-500">
              Disabling this option will prevent users from creating new
              projects.
            </p>
          </CardBody>
        </Card>

        <Card
          className={`${createFlows ? "border-success-200" : "border-danger-200"} border-2`}
        >
          <CardHeader className="flex justify-between items-center">
            <div className="flex items-center space-x-1">
              <Flash className="h-4 w-4" />
              <p className="text-md font-bold">Create Flows</p>
            </div>
            <Switch
              color="success"
              isSelected={createFlows}
              size="sm"
              onValueChange={setCreateFlows}
            />
          </CardHeader>
          <CardBody>
            <p className="text-sm text-default-500">
              Disabling this option will prevent users from creating new flows.
            </p>
          </CardBody>
        </Card>

        <Card
          className={`${createRunners ? "border-success-200" : "border-danger-200"} border-2`}
        >
          <CardHeader className="flex justify-between items-center">
            <div className="flex items-center space-x-1">
              <PlayCircleIcon className="h-4 w-4" />
              <p className="text-md font-bold">Create Runners</p>
            </div>
            <Switch
              color="success"
              isSelected={createRunners}
              size="sm"
              onValueChange={setCreateRunners}
            />
          </CardHeader>
          <CardBody>
            <p className="text-sm text-default-500">
              Disabling this option will prevent users from creating new runners
              within projects.
            </p>
          </CardBody>
        </Card>

        <Card
          className={`${createApiKeys ? "border-success-200" : "border-danger-200"} border-2`}
        >
          <CardHeader className="flex justify-between items-center">
            <div className="flex items-center space-x-1">
              <TagIcon className="h-4 w-4" />
              <p className="text-md font-bold">Create API Keys</p>
            </div>
            <Switch
              color="success"
              isSelected={createApiKeys}
              size="sm"
              onValueChange={setCreateApiKeys}
            />
          </CardHeader>
          <CardBody>
            <p className="text-sm text-default-500">
              Disabling this option will prevent users from creating new api
              keys within projects.
            </p>
          </CardBody>
        </Card>

        <Card
          className={`${addProjectMembers ? "border-success-200" : "border-danger-200"} border-2`}
        >
          <CardHeader className="flex justify-between items-center">
            <div className="flex items-center space-x-1">
              <UsersIcon className="h-4 w-4" />
              <p className="text-md font-bold">Add Project Members</p>
            </div>
            <Switch
              color="success"
              isSelected={addProjectMembers}
              size="sm"
              onValueChange={setAddProjectMembers}
            />
          </CardHeader>
          <CardBody>
            <p className="text-sm text-default-500">
              Disabling this option will prevent project owners from adding new
              members to projects.
            </p>
          </CardBody>
        </Card>

        <Card
          className={`${addFlowActions ? "border-success-200" : "border-danger-200"} border-2`}
        >
          <CardHeader className="flex justify-between items-center">
            <div className="flex items-center space-x-1">
              <Flash className="h-4 w-4" />
              <p className="text-md font-bold">Add Flow Actions</p>
            </div>
            <Switch
              color="success"
              isSelected={addFlowActions}
              size="sm"
              onValueChange={setAddFlowActions}
            />
          </CardHeader>
          <CardBody>
            <p className="text-sm text-default-500">
              Disabling this option will prevent project owners & editors from
              adding new actions to any flow.
            </p>
          </CardBody>
        </Card>

        <Card
          className={`${startExecutions ? "border-success-200" : "border-danger-200"} border-2`}
        >
          <CardHeader className="flex justify-between items-center">
            <div className="flex items-center space-x-1">
              <FileTerminalIcon className="h-4 w-4" />
              <p className="text-md font-bold">Start Executions</p>
            </div>
            <Switch
              color="success"
              isSelected={startExecutions}
              size="sm"
              onValueChange={setStartExecutions}
            />
          </CardHeader>
          <CardBody>
            <p className="text-sm text-default-500">
              Disabling this option will prevent runners from starting a new
              execution.
            </p>
          </CardBody>
        </Card>

        <Card
          className={`${injectPayloads ? "border-success-200" : "border-danger-200"} border-2`}
        >
          <CardHeader className="flex justify-between items-center">
            <div className="flex items-center space-x-1">
              <MailIcon className="h-4 w-4" />
              <p className="text-md font-bold">Inject Payloads</p>
            </div>
            <Switch
              color="success"
              isSelected={injectPayloads}
              size="sm"
              onValueChange={setInjectPayloads}
            />
          </CardHeader>
          <CardBody>
            <p className="text-sm text-default-500">
              Disabling this option will prevent incoming payloads from being
              registered at AlertFlow.
            </p>
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
