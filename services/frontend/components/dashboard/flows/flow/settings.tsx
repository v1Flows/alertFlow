import {
  Button,
  Card,
  CardBody,
  Code,
  Input,
  NumberInput,
  Spacer,
  Switch,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Icon } from "@iconify/react";

import UpdateFlow from "@/lib/fetch/flow/PUT/UpdateFlow";
import ErrorCard from "@/components/error/ErrorCard";

export default function FlowSettings({ flow }: { flow: any }) {
  const router = useRouter();

  const [groupAlerts, setGroupAlerts] = useState(flow.group_alerts);
  const [groupAlertsIdentifier, setGroupAlertsIdentifier] = useState(
    flow.group_alerts_identifier,
  );
  const [encryptAlerts, setEncryptAlerts] = useState(flow.encrypt_alerts);
  const [encryptExecutions, setEncryptExecutions] = useState(
    flow.encrypt_executions,
  );
  const [encryptActionParams, setEncryptActionParams] = useState(
    flow.encrypt_action_params,
  );
  const [alertThreshold, setAlertThreshold] = useState(flow.alert_threshold);

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setEncryptAlerts(flow.encrypt_alerts);
    setEncryptExecutions(flow.encrypt_executions);
    setEncryptActionParams(flow.encrypt_action_params);
    setGroupAlerts(flow.group_alerts);
    setGroupAlertsIdentifier(flow.group_alerts_identifier);
    setAlertThreshold(flow.alert_threshold);
  }, [flow]);

  async function updateFlow() {
    const response = (await UpdateFlow(
      flow.id,
      flow.name,
      flow.description,
      flow.project_id,
      flow.runner_id,
      encryptAlerts,
      encryptExecutions,
      encryptActionParams,
      groupAlerts,
      groupAlertsIdentifier,
      alertThreshold,
    )) as any;

    if (!response) {
      setError(true);
      setErrorMessage("An error occurred while updating the flow");

      return;
    }

    if (response.success) {
      router.refresh();
      toast.success("Flow updated successfully");
    } else {
      setError(true);
      setErrorMessage(response.message);
      toast.error("Failed to update flow");
    }
  }

  return (
    <>
      {error && <ErrorCard error={error} message={errorMessage} />}
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-lg font-bold mb-2">Alerts</p>
          <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 w-full gap-4">
            <Card>
              <CardBody>
                <div className="flex flex-wrap items-center justify-between gap-8">
                  <div>
                    <p className="text-md font-bold">Threshold</p>
                    <p className="text-sm text-default-500 max-w-lg">
                      If an alert is resolved and reoccurs, after which
                      threshold should an new execution be accepted? (in
                      minutes)
                    </p>
                  </div>
                  <NumberInput
                    className="max-w-xs"
                    endContent="minutes"
                    size="sm"
                    value={alertThreshold}
                    variant="flat"
                    onValueChange={setAlertThreshold}
                  />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="flex flex-cols items-center justify-between gap-8">
                  <div>
                    <p className="text-md font-bold">Group Alerts</p>
                    <p className="text-sm text-default-500 max-w-lg">
                      Group Alerts by an identifier. This will set the parentID
                      of the alert to the first alert of the group. The
                      identifier can be set by another setting
                    </p>
                  </div>
                  <Switch
                    isSelected={groupAlerts}
                    size="sm"
                    onValueChange={(value) => {
                      setGroupAlerts(value);
                    }}
                  />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="flex flex-wrap items-center justify-between gap-8">
                  <div>
                    <p className="text-md font-bold">Group Alert Identifier</p>
                    <p className="text-sm text-default-500 max-w-lg">
                      The identifier used to group alerts. To access payload
                      data use{" "}
                      <Code color="primary" radius="sm" size="sm">
                        payload.
                      </Code>{" "}
                      as prefix
                    </p>
                  </div>
                  <Input
                    className="max-w-md"
                    placeholder="Group Alert Identifier"
                    value={groupAlertsIdentifier}
                    onValueChange={setGroupAlertsIdentifier}
                  />
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

        <div>
          <p className="text-lg font-bold mb-2">Encryption</p>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
            <Card>
              <CardBody>
                <div className="flex flex-cols items-center justify-between gap-8">
                  <div>
                    <p className="text-md font-bold">Action Parameters</p>
                    <p className="text-sm text-default-500">
                      The parameters of actions will be encrypted stored on the
                      db.
                    </p>
                  </div>
                  <Switch
                    isSelected={encryptActionParams}
                    size="sm"
                    onValueChange={(value) => {
                      setEncryptActionParams(value);
                    }}
                  />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="flex flex-cols items-center justify-between gap-8">
                  <div>
                    <p className="text-md font-bold">Alert Payloads</p>
                    <p className="text-sm text-default-500">
                      The payload of incoming alerts will be encrypted stored on
                      the db when they reached the backend
                    </p>
                  </div>
                  <Switch
                    isSelected={encryptAlerts}
                    size="sm"
                    onValueChange={(value) => {
                      setEncryptAlerts(value);
                    }}
                  />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="flex flex-cols items-center justify-between gap-8">
                  <div>
                    <p className="text-md font-bold">Executions</p>
                    <p className="text-sm text-default-500">
                      All execution action messages will be stored encrypted on
                      the db
                    </p>
                  </div>
                  <Switch
                    isSelected={encryptExecutions}
                    size="sm"
                    onValueChange={(value) => {
                      setEncryptExecutions(value);
                    }}
                  />
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
      <Spacer y={4} />
      <Button
        fullWidth
        color="primary"
        startContent={<Icon icon="hugeicons:floppy-disk" width={20} />}
        onPress={updateFlow}
      >
        Save
      </Button>
    </>
  );
}
