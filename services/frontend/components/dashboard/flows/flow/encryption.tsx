import { Card, CardBody, Spacer, Switch } from "@nextui-org/react";

export default function FlowEncryption({ flow }: { flow: any }) {
  return (
    <>
      <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-4">
        <Card fullWidth>
          <CardBody className="flex items-center justify-between text-center">
            <div className="flex flex-col">
              <p className="text-md font-bold">Encrypted Payloads</p>
              <p className="text-sm text-default-500">
                Incoming payloads will be encrypted when they reach the backend
              </p>
            </div>
            <Spacer y={2} />
            <Switch size="sm" />
          </CardBody>
        </Card>

        <Card fullWidth>
          <CardBody className="flex items-center justify-between text-center">
            <div className="flex flex-col">
              <p className="text-md font-bold">Encypted Executions</p>
              <p className="text-sm text-default-500">
                All execution data will be stored encrypted
              </p>
            </div>
            <Spacer y={2} />
            <Switch size="sm" />
          </CardBody>
        </Card>
      </div>
    </>
  );
}
