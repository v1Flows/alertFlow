import { Icon } from "@iconify/react";
import { Card, CardBody, CircularProgress, Tooltip } from "@heroui/react";
import NumberFlow from "@number-flow/react";
import ReactTimeago from "react-timeago";

export default function ExecutionDetails({ runners, execution, steps }: any) {
  function status(execution: any) {
    if (execution.status === "pending") {
      return "Pending";
    } else if (execution.status === "running") {
      return "Running";
    } else if (execution.status === "paused") {
      return "Paused";
    } else if (execution.status === "canceled") {
      return "Canceled";
    } else if (execution.status === "noPatternMatch") {
      return "No Pattern Match";
    } else if (execution.status === "interactionRequired") {
      return "Interaction Required";
    } else if (execution.status === "error") {
      return "Error";
    } else if (execution.status === "finished") {
      return "Finished";
    } else {
      return "Unknown";
    }
  }

  function statusColor(execution: any) {
    if (execution.status === "pending") {
      return "default-500";
    } else if (execution.status === "running") {
      return "primary";
    } else if (execution.status === "paused") {
      return "warning";
    } else if (execution.status === "canceled") {
      return "danger";
    } else if (execution.status === "noPatternMatch") {
      return "default";
    } else if (execution.status === "interactionRequired") {
      return "primary";
    } else if (execution.status === "error") {
      return "danger";
    } else if (execution.status === "finished") {
      return "success";
    } else {
      return "default";
    }
  }

  function statusIcon(execution: any) {
    if (execution.status === "pending") {
      return (
        <Tooltip content={`${status(execution)}`}>
          <CircularProgress
            showValueLabel
            aria-label="Step"
            color="default"
            size="md"
            value={100}
            valueLabel={
              <Icon
                className="text-default-500"
                icon="solar:sleeping-square-linear"
                width={20}
              />
            }
          />
        </Tooltip>
      );
    } else if (execution.status === "running") {
      return (
        <Tooltip content={`${status(execution)}`}>
          <CircularProgress aria-label="Step" color="primary" size="md" />
        </Tooltip>
      );
    } else if (execution.status === "paused") {
      return (
        <Tooltip content={`${status(execution)}`}>
          <CircularProgress
            showValueLabel
            aria-label="Step"
            color="warning"
            size="md"
            value={100}
            valueLabel={
              <Icon
                className="text-warning"
                icon="solar:pause-broken"
                width={16}
              />
            }
          />
        </Tooltip>
      );
    } else if (execution.status === "canceled") {
      return (
        <Tooltip content={`${status(execution)}`}>
          <CircularProgress
            showValueLabel
            aria-label="Step"
            color="danger"
            size="md"
            value={100}
            valueLabel={
              <Icon
                className="text-danger"
                icon="solar:forbidden-linear"
                width={20}
              />
            }
          />
        </Tooltip>
      );
    } else if (execution.status === "noPatternMatch") {
      return (
        <Tooltip content={`${status(execution)}`}>
          <CircularProgress
            showValueLabel
            color="secondary"
            size="md"
            value={100}
            valueLabel={
              <Icon
                className="text-secondary"
                icon="solar:bill-cross-broken"
                width={20}
              />
            }
          />
        </Tooltip>
      );
    } else if (execution.status === "interactionRequired") {
      return (
        <Tooltip content={`${status(execution)}`}>
          <CircularProgress
            showValueLabel
            aria-label="Step"
            color="primary"
            size="md"
            value={100}
            valueLabel={
              <Icon
                className="text-primary"
                icon="solar:hand-shake-linear"
                width={22}
              />
            }
          />
        </Tooltip>
      );
    } else if (execution.status === "error") {
      return (
        <Tooltip content={`${status(execution)}`}>
          <CircularProgress
            showValueLabel
            aria-label="Step"
            color="danger"
            size="md"
            value={100}
            valueLabel={
              <Icon
                className="text-danger"
                icon="solar:danger-triangle-broken"
                width={20}
              />
            }
          />
        </Tooltip>
      );
    } else if (execution.status === "finished") {
      return (
        <Tooltip content={`${status(execution)}`}>
          <CircularProgress
            showValueLabel
            aria-label="Step"
            color="success"
            size="md"
            value={100}
            valueLabel={
              <Icon
                className="text-success"
                icon="solar:check-read-broken"
                width={22}
              />
            }
          />
        </Tooltip>
      );
    } else {
      return (
        <Tooltip content={`${status(execution)}`}>
          <CircularProgress
            showValueLabel
            aria-label="Step"
            color="success"
            size="md"
            value={100}
            valueLabel={
              <Icon
                className="text-success"
                icon="solar:question-square-linear"
                width={22}
              />
            }
          />
        </Tooltip>
      );
    }
  }

  function getDuration() {
    let calFinished = new Date().toISOString();

    if (execution.finished_at !== "0001-01-01T00:00:00Z") {
      calFinished = execution.finished_at;
    }

    const ms =
      new Date(calFinished).getTime() -
      new Date(execution.executed_at).getTime();
    const sec = Math.floor(ms / 1000);
    const min = Math.floor(sec / 60);
    const hr = Math.floor(min / 60);
    const day = Math.floor(hr / 24);

    if (day > 0) {
      return `${day}d ${hr % 24}h ${min % 60}m ${sec % 60}s`;
    } else if (hr > 0) {
      return `${hr}h ${min % 60}m ${sec % 60}s`;
    } else if (min > 0) {
      return `${min}m ${sec % 60}s`;
    } else {
      return `${sec}s`;
    }
  }

  return (
    <>
      <div className="grid grid-cols-2 items-start items-stretch gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <Card>
          <CardBody>
            <div className="flex items-center justify-start gap-4">
              <div>{statusIcon(execution)}</div>
              <div>
                <p
                  className={`text-md text- font-bold text-${statusColor(execution)}`}
                >
                  {status(execution)}
                </p>
                <p className="text-sm text-default-500">Status</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center justify-start gap-4">
              <div className="flex size-12 items-center justify-center rounded-large bg-default bg-opacity-40">
                <Icon icon="solar:rocket-2-broken" width={28} />
              </div>
              <div>
                <p className="text-md font-bold">
                  {runners.find((r: any) => r.id === execution.runner_id)?.name
                    .length > 20 ? (
                    <Tooltip
                      content={
                        runners.find((r: any) => r.id === execution.runner_id)
                          ?.name
                      }
                    >
                      {runners
                        .find((r: any) => r.id === execution.runner_id)
                        ?.name.slice(0, 20) + "..."}
                    </Tooltip>
                  ) : (
                    runners.find((r: any) => r.id === execution.runner_id)
                      ?.name || "N/A"
                  )}
                </p>
                <p className="text-sm text-default-500">Runner</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center justify-start gap-4">
              <div className="flex size-12 items-center justify-center rounded-large bg-default bg-opacity-40">
                <Icon
                  icon="solar:posts-carousel-vertical-line-duotone"
                  width={28}
                />
              </div>
              <div>
                <p className="text-md font-bold">
                  <NumberFlow
                    locales="en-US" // Intl.NumberFormat locales
                    value={steps.length}
                  />
                </p>
                <p className="text-sm text-default-500">Total Steps</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center justify-start gap-4">
              <div className="flex size-12 items-center justify-center rounded-large bg-default bg-opacity-40">
                <Icon icon="solar:delivery-line-duotone" width={28} />
              </div>
              <div>
                <p className="text-md font-bold">
                  <ReactTimeago date={execution.executed_at} />
                </p>
                <p className="text-sm text-default-500">Executed At</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center justify-start gap-4">
              <div className="flex size-12 items-center justify-center rounded-large bg-default bg-opacity-40">
                <Icon icon="solar:delivery-outline" width={28} />
              </div>
              <div>
                <p className="text-md font-bold">
                  {execution.finished_at != "0001-01-01T00:00:00Z" ? (
                    <ReactTimeago date={execution.finished_at} />
                  ) : (
                    "N/A"
                  )}
                </p>
                <p className="text-sm text-default-500">Finished At</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center justify-start gap-4">
              <div className="flex size-12 items-center justify-center rounded-large bg-default bg-opacity-40">
                <Icon icon="solar:clock-circle-broken" width={28} />
              </div>
              <div>
                <p className="text-md font-bold">{getDuration()}</p>
                <p className="text-sm text-default-500">Duration</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
