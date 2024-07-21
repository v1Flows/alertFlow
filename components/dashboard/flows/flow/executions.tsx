import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import TimeAgo from "react-timeago";

import { IconWrapper } from "@/lib/IconWrapper";

export default function Executions({ executions }: any) {
  function statusColor(execution: any) {
    if (execution.running) {
      return "primary";
    } else if (execution.waiting) {
      return "secondary";
    } else if (execution.paused) {
      return "warning";
    }
  }

  function statusIcon(execution: any) {
    if (execution.running) {
      return "solar:playback-speed-linear";
    } else if (execution.waiting) {
      return "solar:stop-circle-broken";
    } else if (execution.paused) {
      return "solar:pause-circle";
    }
  }

  return (
    <main className="grid grid-cols-2 gap-4">
      {executions.map((execution: any) => (
        <Card key={execution.id} fullWidth>
          <CardHeader className="justify-between">
            <div className="flex justify-start items-center gap-2">
              <IconWrapper className="bg-primary/10 text-primary">
                <Icon
                  className={`text-${statusColor(execution)}`}
                  icon={`${statusIcon(execution)}`}
                  width={24}
                />
              </IconWrapper>
              <p className="text-md font-bold">{execution.id}</p>
            </div>
            <Chip color="primary" radius="sm" variant="light">
              <TimeAgo date={new Date(execution.created_at)} />
            </Chip>
          </CardHeader>
          <CardBody className="grid gap-2">
            <div className="grid grid-cols-2">
              <p className="text-sm text-default-500">Status</p>
              <p className={`text-sm font-bold text-${statusColor(execution)}`}>
                {execution.running
                  ? "Running"
                  : execution.waiting
                    ? "Waiting"
                    : execution.paused
                      ? "Paused"
                      : "Finished"}
              </p>
            </div>
            <Divider />
            <div className="grid grid-cols-2">
              <p className="text-sm text-default-500">Payload</p>
              <p className="text-sm">{execution.payload_id}</p>
            </div>
            <Divider />
            <div className="grid grid-cols-2">
              <p className="text-sm text-default-500">Runner</p>
              <p className="text-sm">{execution.runner_id}</p>
            </div>
            <Divider />
            <div className="grid grid-cols-2">
              <p className="text-sm text-default-500">Created At</p>
              <p className="text-sm">
                {new Date(execution.created_at).toLocaleString()}
              </p>
            </div>
            <Divider />
            <div className="grid grid-cols-2">
              <p className="text-sm text-default-500">Executed At</p>
              <p className="text-sm">
                {new Date(execution.executed_at).toLocaleString()}
              </p>
            </div>
            <Divider />
            <div className="grid grid-cols-2">
              <p className="text-sm text-default-500">Finished At</p>
              <p className="text-sm">
                {new Date(execution.finished_at).toLocaleString()}
              </p>
            </div>
          </CardBody>
          <CardFooter>
            <Button
              fullWidth
              color="primary"
              size="md"
              startContent={<Icon icon="solar:eye-broken" />}
              variant="flat"
            >
              <span className="font-bold">Go to Execution</span>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </main>
  );
}
