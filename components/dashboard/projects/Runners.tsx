import { Card, CardHeader, CardBody, Divider, Chip } from "@nextui-org/react";

export default function Runners({ runners }: any) {
  console.log(runners);

  return (
    <main>
      <p className="text-lg font-bold">Selfhosted Runners</p>
      <Divider className="mb-4" />
      <div className="grid grid-cols-2 gap-4">
        {runners.map(
          (runner: any) =>
            runner.alertflow_runner === false && (
              <Card key={runner.id}>
                <CardHeader className="justify-between items-center">
                  <div>
                    <p className="text-md">{runner.name}</p>
                    <p className="text-sm text-default-500">{runner.id}</p>
                  </div>
                  <Chip
                    color={runner.registered ? "success" : "danger"}
                    size="sm"
                    variant="dot"
                  >
                    {runner.registered ? "Registered" : "Unregistered"}
                  </Chip>
                </CardHeader>
                <Divider />
                <CardBody>
                  <div className="grid grid-cols-2 grid-rows-3 items-center justify-center">
                    <p className="text-sm font-bold">Version:</p>
                    <p>{runner.runner_version}</p>
                    <p className="text-sm font-bold">Active:</p>
                    <p>{runner.active ? "Yes" : "No"}</p>
                    <p className="text-sm font-bold">Last Heartbeat:</p>
                    <p>
                      {new Date(runner.last_heartbeat.Time).toLocaleString()}
                    </p>
                  </div>
                </CardBody>
              </Card>
            ),
        )}
      </div>
      <p className="text-lg font-bold mt-4">AlertFlow Runners</p>
      <Divider className="mb-4" />
      <div className="grid grid-cols-2 gap-4">
        {runners.map(
          (runner: any) =>
            runner.alertflow_runner === true && (
              <Card key={runner.id}>
                <CardHeader>
                  <div>
                    <p className="text-md">{runner.name}</p>
                    <p className="text-sm text-default-500">{runner.id}</p>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody>
                  <div className="grid grid-cols-2 grid-rows-3 items-center justify-center">
                    <p className="text-sm font-bold">Version:</p>
                    <p>{runner.runner_version}</p>
                    <p className="text-sm font-bold">Active:</p>
                    <p>{runner.active ? "Yes" : "No"}</p>
                    <p className="text-sm font-bold">Last Heartbeat:</p>
                    <p>
                      {new Date(runner.last_heartbeat.Time).toLocaleString()}
                    </p>
                  </div>
                </CardBody>
              </Card>
            ),
        )}
      </div>
    </main>
  );
}
