"use client";
import { Divider, Switch, cn } from "@nextui-org/react";
import React from "react";

export function Settings({ settings }: any) {
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
      <div className="grid grid-cols-2 gap-4 items-center justify-between">
        <Switch
          classNames={{
            base: cn(
              "inline-flex flex-row-reverse w-full max-w-full bg-content1 hover:bg-content2 items-center",
              "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
              "data-[selected=true]:border-danger",
            ),
            wrapper: "p-0 h-4 overflow-visible",
            thumb: cn(
              "w-6 h-6 border-2 shadow-lg",
              "group-data-[hover=true]:border-danger",
              //selected
              "group-data-[selected=true]:ml-6",
              // pressed
              "group-data-[pressed=true]:w-7",
              "group-data-[selected]:group-data-[pressed]:ml-4",
            ),
          }}
          color="danger"
          isSelected={maintenance}
          onValueChange={setMaintenance}
        >
          <div className="flex flex-col gap-1">
            <p className="text-medium">Maintenance</p>
            <p className="text-tiny text-default-400">
              Get access to new features before they are released.
            </p>
          </div>
        </Switch>

        <Switch
          classNames={{
            base: cn(
              "inline-flex flex-row-reverse w-full max-w-full bg-content1 hover:bg-content2 items-center",
              "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
              "data-[selected=true]:border-success",
              "border-danger",
            ),
            wrapper: "p-0 h-4 overflow-visible",
            thumb: cn(
              "w-6 h-6 border-2 shadow-lg",
              "group-data-[hover=true]:border-success",
              //selected
              "group-data-[selected=true]:ml-6",
              // pressed
              "group-data-[pressed=true]:w-7",
              "group-data-[selected]:group-data-[pressed]:ml-4",
            ),
          }}
          color="success"
          isSelected={signup}
          onValueChange={setSignup}
        >
          <div className="flex flex-col gap-1">
            <p className="text-medium">SignUp</p>
            <p className="text-tiny text-default-400">
              Get access to new features before they are released.
            </p>
          </div>
        </Switch>

        <Switch
          classNames={{
            base: cn(
              "inline-flex flex-row-reverse w-full max-w-full bg-content1 hover:bg-content2 items-center",
              "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
              "data-[selected=true]:border-success",
              "border-danger",
            ),
            wrapper: "p-0 h-4 overflow-visible",
            thumb: cn(
              "w-6 h-6 border-2 shadow-lg",
              "group-data-[hover=true]:border-success",
              //selected
              "group-data-[selected=true]:ml-6",
              // pressed
              "group-data-[pressed=true]:w-7",
              "group-data-[selected]:group-data-[pressed]:ml-4",
            ),
          }}
          color="success"
          isSelected={createProjects}
          onValueChange={setCreateProjects}
        >
          <div className="flex flex-col gap-1">
            <p className="text-medium">Create Projects</p>
            <p className="text-tiny text-default-400">
              Get access to new features before they are released.
            </p>
          </div>
        </Switch>

        <Switch
          classNames={{
            base: cn(
              "inline-flex flex-row-reverse w-full max-w-full bg-content1 hover:bg-content2 items-center",
              "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
              "data-[selected=true]:border-success",
              "border-danger",
            ),
            wrapper: "p-0 h-4 overflow-visible",
            thumb: cn(
              "w-6 h-6 border-2 shadow-lg",
              "group-data-[hover=true]:border-success",
              //selected
              "group-data-[selected=true]:ml-6",
              // pressed
              "group-data-[pressed=true]:w-7",
              "group-data-[selected]:group-data-[pressed]:ml-4",
            ),
          }}
          color="success"
          isSelected={createFlows}
          onValueChange={setCreateFlows}
        >
          <div className="flex flex-col gap-1">
            <p className="text-medium">Create Flows</p>
            <p className="text-tiny text-default-400">
              Get access to new features before they are released.
            </p>
          </div>
        </Switch>

        <Switch
          classNames={{
            base: cn(
              "inline-flex flex-row-reverse w-full max-w-full bg-content1 hover:bg-content2 items-center",
              "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
              "data-[selected=true]:border-success",
              "border-danger",
            ),
            wrapper: "p-0 h-4 overflow-visible",
            thumb: cn(
              "w-6 h-6 border-2 shadow-lg",
              "group-data-[hover=true]:border-success",
              //selected
              "group-data-[selected=true]:ml-6",
              // pressed
              "group-data-[pressed=true]:w-7",
              "group-data-[selected]:group-data-[pressed]:ml-4",
            ),
          }}
          color="success"
          isSelected={createRunners}
          onValueChange={setCreateRunners}
        >
          <div className="flex flex-col gap-1">
            <p className="text-medium">Create Runners</p>
            <p className="text-tiny text-default-400">
              Get access to new features before they are released.
            </p>
          </div>
        </Switch>

        <Switch
          classNames={{
            base: cn(
              "inline-flex flex-row-reverse w-full max-w-full bg-content1 hover:bg-content2 items-center",
              "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
              "data-[selected=true]:border-success",
              "border-danger",
            ),
            wrapper: "p-0 h-4 overflow-visible",
            thumb: cn(
              "w-6 h-6 border-2 shadow-lg",
              "group-data-[hover=true]:border-success",
              //selected
              "group-data-[selected=true]:ml-6",
              // pressed
              "group-data-[pressed=true]:w-7",
              "group-data-[selected]:group-data-[pressed]:ml-4",
            ),
          }}
          color="success"
          isSelected={createApiKeys}
          onValueChange={setCreateApiKeys}
        >
          <div className="flex flex-col gap-1">
            <p className="text-medium">Create API Keys</p>
            <p className="text-tiny text-default-400">
              Get access to new features before they are released.
            </p>
          </div>
        </Switch>

        <Switch
          classNames={{
            base: cn(
              "inline-flex flex-row-reverse w-full max-w-full bg-content1 hover:bg-content2 items-center",
              "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
              "data-[selected=true]:border-success",
              "border-danger",
            ),
            wrapper: "p-0 h-4 overflow-visible",
            thumb: cn(
              "w-6 h-6 border-2 shadow-lg",
              "group-data-[hover=true]:border-success",
              //selected
              "group-data-[selected=true]:ml-6",
              // pressed
              "group-data-[pressed=true]:w-7",
              "group-data-[selected]:group-data-[pressed]:ml-4",
            ),
          }}
          color="success"
          isSelected={addProjectMembers}
          onValueChange={setAddProjectMembers}
        >
          <div className="flex flex-col gap-1">
            <p className="text-medium">Add Project Members</p>
            <p className="text-tiny text-default-400">
              Get access to new features before they are released.
            </p>
          </div>
        </Switch>

        <Switch
          classNames={{
            base: cn(
              "inline-flex flex-row-reverse w-full max-w-full bg-content1 hover:bg-content2 items-center",
              "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
              "data-[selected=true]:border-success",
              "border-danger",
            ),
            wrapper: "p-0 h-4 overflow-visible",
            thumb: cn(
              "w-6 h-6 border-2 shadow-lg",
              "group-data-[hover=true]:border-success",
              //selected
              "group-data-[selected=true]:ml-6",
              // pressed
              "group-data-[pressed=true]:w-7",
              "group-data-[selected]:group-data-[pressed]:ml-4",
            ),
          }}
          color="success"
          isSelected={addFlowActions}
          onValueChange={setAddFlowActions}
        >
          <div className="flex flex-col gap-1">
            <p className="text-medium">Add Flow Actions</p>
            <p className="text-tiny text-default-400">
              Get access to new features before they are released.
            </p>
          </div>
        </Switch>

        <Switch
          classNames={{
            base: cn(
              "inline-flex flex-row-reverse w-full max-w-full bg-content1 hover:bg-content2 items-center",
              "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
              "data-[selected=true]:border-success",
              "border-danger",
            ),
            wrapper: "p-0 h-4 overflow-visible",
            thumb: cn(
              "w-6 h-6 border-2 shadow-lg",
              "group-data-[hover=true]:border-success",
              //selected
              "group-data-[selected=true]:ml-6",
              // pressed
              "group-data-[pressed=true]:w-7",
              "group-data-[selected]:group-data-[pressed]:ml-4",
            ),
          }}
          color="success"
          isSelected={startExecutions}
          onValueChange={setStartExecutions}
        >
          <div className="flex flex-col gap-1">
            <p className="text-medium">Start Executions</p>
            <p className="text-tiny text-default-400">
              Get access to new features before they are released.
            </p>
          </div>
        </Switch>

        <Switch
          classNames={{
            base: cn(
              "inline-flex flex-row-reverse w-full max-w-full bg-content1 hover:bg-content2 items-center",
              "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
              "data-[selected=true]:border-success",
              "border-danger",
            ),
            wrapper: "p-0 h-4 overflow-visible",
            thumb: cn(
              "w-6 h-6 border-2 shadow-lg",
              "group-data-[hover=true]:border-success",
              //selected
              "group-data-[selected=true]:ml-6",
              // pressed
              "group-data-[pressed=true]:w-7",
              "group-data-[selected]:group-data-[pressed]:ml-4",
            ),
          }}
          color="success"
          isSelected={injectPayloads}
          onValueChange={setInjectPayloads}
        >
          <div className="flex flex-col gap-1">
            <p className="text-medium">Inject Payloads</p>
            <p className="text-tiny text-default-400">
              Get access to new features before they are released.
            </p>
          </div>
        </Switch>
      </div>
    </main>
  );
}
