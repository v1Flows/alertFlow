import {
  Button,
  Card,
  CardBody,
  Spacer,
  Switch,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";

import { PlusIcon } from "@/components/icons";
import CreateRunnerModal from "@/components/functions/runner/create";
import UpdateSettings from "@/lib/fetch/admin/PUT/UpdateSettings";

export default function AdminAlertFlowRunnerDetails({
  settings,
}: {
  settings: any;
}) {
  const router = useRouter();

  const addRunnerModal = useDisclosure();

  const [allowAlertFlowRunnerAutoJoin, setAllowAlertFlowRunnerAutoJoin] =
    useState(settings.allow_alertflow_runner_auto_join);
  const [allowAlertFlowRunnerJoin, setAllowAlertFlowRunnerJoin] = useState(
    settings.allow_alertflow_runner_join,
  );
  const [alertflowRunnerAutoJoinToken, setAlertflowRunnerAutoJoinToken] =
    useState(settings.alertflow_runner_auto_join_token);

  useEffect(() => {
    setAllowAlertFlowRunnerAutoJoin(settings.allow_alertflow_runner_auto_join);
    setAllowAlertFlowRunnerJoin(settings.allow_alertflow_runner_join);
    setAlertflowRunnerAutoJoinToken(settings.alertflow_runner_auto_join_token);
  }, [settings]);

  useEffect(() => {
    if (
      allowAlertFlowRunnerAutoJoin ===
        settings.allow_alertflow_runner_auto_join &&
      allowAlertFlowRunnerJoin === settings.allow_alertflow_runner_join
    ) {
      return;
    }
    updateSettings();
  }, [allowAlertFlowRunnerAutoJoin, allowAlertFlowRunnerJoin]);

  async function updateSettings() {
    const response = (await UpdateSettings(
      settings.maintenance,
      settings.signup,
      settings.create_projects,
      settings.create_flows,
      settings.create_runners,
      settings.create_api_keys,
      settings.add_project_members,
      settings.add_flow_actions,
      settings.start_executions,
      settings.receive_alerts,
      allowAlertFlowRunnerAutoJoin,
      allowAlertFlowRunnerJoin,
      alertflowRunnerAutoJoinToken,
    )) as any;

    if (response.success) {
      toast.success("Settings updated successfully");
      router.refresh();
    } else {
      router.refresh();
      toast.error("Failed to update settings");
    }
  }

  function copyJoinToken() {
    navigator.clipboard.writeText(alertflowRunnerAutoJoinToken);
    toast.success("Join token copied to clipboard");
  }

  return (
    <>
      <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
        <Card fullWidth>
          <CardBody className="flex items-center justify-between text-center">
            <div className="flex flex-col">
              <div className="flex flex-cols items-center justify-center gap-2">
                <p className="text-md font-bold">Auto Join</p>
                <Tooltip content="You have to configure the projects runner join secret in your runner configuration">
                  <Icon icon="solar:info-circle-linear" />
                </Tooltip>
              </div>
              <p className="text-sm text-default-500">
                Runners on scalable infrastructure can automatically join
              </p>
            </div>
            <Spacer y={2} />
            <Switch
              color="success"
              isSelected={allowAlertFlowRunnerAutoJoin}
              size="sm"
              onValueChange={setAllowAlertFlowRunnerAutoJoin}
            />
          </CardBody>
        </Card>

        <Card fullWidth>
          <CardBody className="flex items-center justify-between text-center">
            <div className="flex flex-col">
              <p className="text-md font-bold">Runner Join</p>
              <p className="text-sm text-default-500">
                Prevent new runners from joining
              </p>
            </div>
            <Spacer y={2} />
            <Switch
              color="success"
              isSelected={allowAlertFlowRunnerJoin}
              size="sm"
              onValueChange={setAllowAlertFlowRunnerJoin}
            />
          </CardBody>
        </Card>

        <Card fullWidth>
          <CardBody className="flex items-center justify-between text-center">
            <div className="flex flex-col">
              <p className="text-md font-bold">Auto Join Token</p>
              <p className="text-sm text-default-500">
                Use this token in your runner configuration to allow auto join
              </p>
            </div>
            <Spacer y={2} />
            <Button
              color="primary"
              size="sm"
              variant="flat"
              onPress={copyJoinToken}
            >
              <Icon icon="solar:copy-linear" />
              Copy Token
            </Button>
          </CardBody>
        </Card>

        <Card fullWidth>
          <CardBody className="flex items-center justify-between text-center">
            <div className="flex flex-col">
              <p className="text-md font-bold">Add Persistent Runner</p>
              <p className="text-sm text-default-500">
                Add a new self-hosted runner which is persistent to this project
              </p>
            </div>
            <Spacer y={2} />
            <Button
              isIconOnly
              color="primary"
              size="sm"
              variant="flat"
              onPress={addRunnerModal.onOpen}
            >
              <PlusIcon />
            </Button>
          </CardBody>
        </Card>
      </div>
      <CreateRunnerModal
        alertflow_runner
        disclosure={addRunnerModal}
        project={{
          id: "admin",
        }}
      />
    </>
  );
}
