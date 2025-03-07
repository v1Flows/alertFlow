import { Card, CardBody, Code, Input, Spacer, Switch } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setEncryptAlerts(flow.encrypt_alerts);
    setEncryptExecutions(flow.encrypt_executions);
    setGroupAlerts(flow.group_alerts);
    setGroupAlertsIdentifier(flow.group_alert_identifier);
  }, [flow]);

  useEffect(() => {
    if (
      encryptAlerts === flow.encrypt_alerts &&
      encryptExecutions === flow.encrypt_executions &&
      groupAlerts === flow.group_alerts &&
      groupAlertsIdentifier === flow.group_alerts_identifier
    ) {
      return;
    }
    updateFlow();
  }, [encryptAlerts, encryptExecutions, groupAlerts, groupAlertsIdentifier]);

  async function updateFlow() {
    const response = (await UpdateFlow(
      flow.id,
      flow.name,
      flow.description,
      flow.project_id,
      flow.runner_id,
      encryptAlerts,
      encryptExecutions,
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
          <p className="text-lg font-bold">Alerts</p>
          <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-4">
            <Card fullWidth>
              <CardBody className="flex items-center justify-between text-center">
                <div className="flex flex-col">
                  <p className="text-md font-bold">Group Alerts</p>
                  <p className="text-sm text-default-500">
                    Group Alerts by an identifier. This will set the parentID of
                    the alert to the first alert of the group. The identifier
                    can be set by another setting
                  </p>
                </div>
                <Spacer y={2} />
                <Switch
                  isSelected={groupAlerts}
                  size="sm"
                  onValueChange={(value) => {
                    setGroupAlerts(value);
                  }}
                />
              </CardBody>
            </Card>

            <Card fullWidth>
              <CardBody className="flex items-center justify-between text-center">
                <div className="flex flex-col">
                  <p className="text-md font-bold">Group Alert Identifier</p>
                  <p className="text-sm text-default-500">
                    The identifier used to group alerts. To access payload data
                    use{" "}
                    <Code color="primary" radius="sm" size="sm">
                      payload.
                    </Code>{" "}
                    as prefix
                  </p>
                </div>
                <Spacer y={2} />
                <Input
                  placeholder="Group Alert Identifier"
                  value={groupAlertsIdentifier}
                  onValueChange={setGroupAlertsIdentifier}
                />
              </CardBody>
            </Card>
          </div>
        </div>

        <div>
          <p className="text-lg font-bold">Encryption</p>
          <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-4">
            <Card fullWidth>
              <CardBody className="flex items-center justify-between text-center">
                <div className="flex flex-col">
                  <p className="text-md font-bold">Encrypt Alert Payloads</p>
                  <p className="text-sm text-default-500">
                    The payload of incoming alerts will be encrypted stored on
                    the db when they reached the backend
                  </p>
                </div>
                <Spacer y={2} />
                <Switch
                  isSelected={encryptAlerts}
                  size="sm"
                  onValueChange={(value) => {
                    setEncryptAlerts(value);
                  }}
                />
              </CardBody>
            </Card>

            <Card fullWidth>
              <CardBody className="flex items-center justify-between text-center">
                <div className="flex flex-col">
                  <p className="text-md font-bold">Encrypt Executions</p>
                  <p className="text-sm text-default-500">
                    All execution action messages will be stored encrypted on
                    the db
                  </p>
                </div>
                <Spacer y={2} />
                <Switch
                  isSelected={encryptExecutions}
                  size="sm"
                  onValueChange={(value) => {
                    setEncryptExecutions(value);
                  }}
                />
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
