import { Icon } from "@iconify/react";
import { Card, CardBody, CircularProgress, Spinner } from "@nextui-org/react";
import ReactTimeago from "react-timeago";

export default function ExecutionDetails({ execution, steps }: any) {
  function status(execution: any) {
    if (execution.running) {
      return "Running";
    } else if (execution.waiting) {
      return "Waiting";
    } else if (execution.paused) {
      return "Paused";
    } else if (execution.error) {
      return "Error";
    } else if (execution.no_match) {
      return "No Match";
    } else {
      return "Finished";
    }
  }

  function statusColor(execution: any) {
    if (execution.running) {
      return "primary";
    } else if (execution.waiting) {
      return "warning";
    } else if (execution.paused) {
      return "warning";
    } else if (execution.error) {
      return "danger";
    } else if (execution.no_match) {
      return "secondary";
    } else {
      return "success";
    }
  }

  function statusIcon(execution: any) {
    if (execution.running) {
      return <Spinner color="primary" size="sm" />;
    } else if (execution.waiting) {
      return <Icon icon="solar:pause-broken" />;
    } else if (execution.paused) {
      return <CircularProgress color="warning" size="sm" value={100} />;
    } else if (execution.error) {
      return <CircularProgress color="danger" size="sm" value={100} />;
    } else if (execution.no_match) {
      return <CircularProgress color="secondary" size="sm" value={100} />;
    } else {
      return (
        <div className="border border-2 border-success flex items-center justify-center rounded-full w-8 h-8">
          <Icon
            className="text-success"
            icon="solar:check-read-broken"
            width={24}
          />
        </div>
      );
    }
  }

  return (
    <>
      <div className="grid grid-cols-4 items-start gap-4">
        <Card>
          <CardBody>
            <div className="flex gap-4 items-center justify-start">
              <div className="flex items-center rounded-large justify-center bg-default bg-opacity-40 w-10 h-10">
                {statusIcon(execution)}
              </div>
              <div>
                <p className="text-default-600">Status</p>
                <p
                  className={`text-lg font-bold text-${statusColor(execution)}`}
                >
                  {status(execution)}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex gap-4 items-center justify-start">
              <div className="flex items-center rounded-large justify-center bg-default bg-opacity-40 w-10 h-10">
                <Icon icon="solar:bill-list-broken" width={24} />
              </div>
              <div>
                <p className="text-default-600">Total Steps</p>
                <p className="text-lg font-bold">{steps.length + 2}</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex gap-4 items-center justify-start">
              <div className="flex items-center rounded-large justify-center bg-default bg-opacity-40 w-12 h-12">
                <Icon icon="solar:delivery-line-duotone" width={28} />
              </div>
              <div>
                <p className="text-default-600">Executed At</p>
                <p className="text-lg font-bold">
                  <ReactTimeago date={execution.executed_at} />
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex gap-4 items-center justify-start">
              <div className="flex items-center rounded-large justify-center bg-default bg-opacity-40 w-12 h-12">
                <Icon icon="solar:delivery-outline" width={28} />
              </div>
              <div>
                <p className="text-default-600">Finished At</p>
                <p className="text-lg font-bold">
                  {execution.finished_at != "0001-01-01T00:00:00Z" ? (
                    <ReactTimeago date={execution.finished_at} />
                  ) : (
                    "N/A"
                  )}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
