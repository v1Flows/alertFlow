import { Card, CardBody, Spacer, Switch } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import UpdateFlow from "@/lib/fetch/flow/PUT/UpdateFlow";
import ErrorCard from "@/components/error/ErrorCard";

export default function FlowEncryption({ flow }: { flow: any }) {
  const router = useRouter();

  const [encryptPayloads, setEncryptPayloads] = useState(flow.encrypt_payloads);
  const [encryptExecutions, setEncryptExecutions] = useState(
    flow.encrypt_executions,
  );

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setEncryptPayloads(flow.encrypt_payloads);
    setEncryptExecutions(flow.encrypt_executions);
  }, [flow]);

  useEffect(() => {
    if (
      encryptPayloads === flow.encrypt_payloads &&
      encryptExecutions === flow.encrypt_executions
    ) {
      return;
    }
    updateFlow();
  }, [encryptPayloads, encryptExecutions]);

  async function updateFlow() {
    const response = (await UpdateFlow(
      flow.id,
      flow.name,
      flow.description,
      flow.project_id,
      flow.runner_id,
      encryptPayloads,
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
      <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-4">
        <Card fullWidth>
          <CardBody className="flex items-center justify-between text-center">
            <div className="flex flex-col">
              <p className="text-md font-bold">Encrypt Alert Payloads</p>
              <p className="text-sm text-default-500">
                The payload of incoming alerts will be encrypted stored on the
                db when they reached the backend
              </p>
            </div>
            <Spacer y={2} />
            <Switch
              isSelected={encryptPayloads}
              size="sm"
              onValueChange={(value) => {
                setEncryptPayloads(value);
              }}
            />
          </CardBody>
        </Card>

        <Card fullWidth>
          <CardBody className="flex items-center justify-between text-center">
            <div className="flex flex-col">
              <p className="text-md font-bold">Encrypt Executions</p>
              <p className="text-sm text-default-500">
                All execution action messages will be stored encrypted on the db
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
    </>
  );
}
