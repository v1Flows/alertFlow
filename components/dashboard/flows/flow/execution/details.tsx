import { Icon } from "@iconify/react";
import { Card, CardBody, CircularProgress, Tooltip } from "@nextui-org/react";
import ReactTimeago from "react-timeago";
import NumberFlow from "@number-flow/react";

export default function ExecutionDetails({ runners, execution, steps }: any) {
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
      return "No Pattern Match";
    } else if (execution.ghost) {
      return "No Flow Actions found";
    } else if (execution.interaction_required) {
      return "Interaction Required";
    } else if (execution.cancelled) {
      return "Cancelled";
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
    } else if (execution.ghost) {
      return "default-500";
    } else if (execution.interaction_required) {
      return "primary";
    } else if (execution.cancelled) {
      return "danger";
    } else {
      return "success";
    }
  }

  function statusIcon(execution: any) {
    if (execution.running) {
      return (
        <Tooltip content={`${status(execution)}`}>
          <CircularProgress aria-label="Step" color="primary" size="md" />
        </Tooltip>
      );
    } else if (execution.waiting) {
      return (
        <Tooltip content={`${status(execution)}`}>
          <CircularProgress
            aria-label="Step"
            color="warning"
            maxValue={5}
            showValueLabel={true}
            size="md"
            value={5}
            valueLabel={
              <Icon
                className="text-warning"
                icon="solar:clock-circle-broken"
                width={16}
              />
            }
          />
        </Tooltip>
      );
    } else if (execution.paused) {
      return (
        <Tooltip content={`${status(execution)}`}>
          <CircularProgress
            aria-label="Step"
            color="warning"
            showValueLabel={true}
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
    } else if (execution.error) {
      return (
        <Tooltip content={`${status(execution)}`}>
          <CircularProgress
            aria-label="Step"
            color="danger"
            showValueLabel={true}
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
    } else if (execution.no_match) {
      return (
        <Tooltip content={`${status(execution)}`}>
          <CircularProgress
            color="secondary"
            showValueLabel={true}
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
    } else if (execution.ghost) {
      return (
        <Tooltip content={`${status(execution)}`}>
          <CircularProgress
            color="default"
            showValueLabel={true}
            size="md"
            value={100}
            valueLabel={
              <Icon
                className="text-default-500"
                icon="solar:ghost-broken"
                width={20}
              />
            }
          />
        </Tooltip>
      );
    } else if (execution.interaction_required) {
      return (
        <Tooltip content={`${status(execution)}`}>
          <CircularProgress
            color="primary"
            showValueLabel={true}
            size="md"
            value={100}
            valueLabel={
              <Icon
                className="text-primary-500"
                icon="solar:hand-shake-linear"
                width={20}
              />
            }
          />
        </Tooltip>
      );
    } else if (execution.cancelled) {
      return (
        <Tooltip content={`${status(execution)}`}>
          <CircularProgress
            color="danger"
            showValueLabel={true}
            size="md"
            value={100}
            valueLabel={
              <Icon
                className="text-danger-500"
                icon="solar:sad-square-linear"
                width={20}
              />
            }
          />
        </Tooltip>
      );
    } else {
      return (
        <Tooltip content={`${status(execution)}. Steps 5 / 5`}>
          <CircularProgress
            aria-label="Step"
            color="success"
            maxValue={5}
            showValueLabel={true}
            size="md"
            value={5}
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
    }
  }

  function getDuration() {
    var calFinished = new Date().toISOString();

    if (execution.finished_at !== "0001-01-01T00:00:00Z") {
      calFinished = execution.finished_at;
    }

    const ms =
      new Date(calFinished).getTime() -
      new Date(execution.created_at).getTime();
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
      <div className="grid xl:grid-cols-6 lg:grid-cols-3 grid-cols-2 items-stretch items-start gap-4">
        <Card>
          <CardBody>
            <div className="flex gap-4 items-center justify-start">
              <div>{statusIcon(execution)}</div>
              <div>
                <p
                  className={`text-md font-bold text-${statusColor(execution)}`}
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
            <div className="flex gap-4 items-center justify-start">
              <div className="flex items-center rounded-large justify-center bg-default bg-opacity-40 w-12 h-12">
                <Icon icon="solar:rocket-2-broken" width={28} />
              </div>
              <div>
                <p className="text-md font-bold">
                  {runners.find((r: any) => r.id === execution.runner_id)
                    ?.name || "-"}
                </p>
                <p className="text-sm text-default-500">Runner</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex gap-4 items-center justify-start">
              <div className="flex items-center rounded-large justify-center bg-default bg-opacity-40 w-12 h-12">
                <Icon
                  icon="solar:posts-carousel-vertical-line-duotone"
                  width={28}
                />
              </div>
              <div>
                <p className="text-md font-bold">
                  <NumberFlow
                    locales="en-US" // Intl.NumberFormat locales
                    value={steps.length - 1}
                  />
                </p>
                <p className="text-sm text-default-500">Total Steps</p>
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
            <div className="flex gap-4 items-center justify-start">
              <div className="flex items-center rounded-large justify-center bg-default bg-opacity-40 w-12 h-12">
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
            <div className="flex gap-4 items-center justify-start">
              <div className="flex items-center rounded-large justify-center bg-default bg-opacity-40 w-12 h-12">
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
