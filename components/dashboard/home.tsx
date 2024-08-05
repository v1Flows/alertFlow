import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Progress,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";

import { IconWrapper } from "@/lib/IconWrapper";

import Executions from "./flows/flow/executions";

export function DashboardHome({
  stats,
  plans,
  user,
  notifications,
  flows,
  runners,
  executions,
}: any) {
  const plan = plans.find((plan: any) => plan.id === user.plan);

  function runnerHeartbeatStatus(runner: any) {
    var timeAgo =
      (new Date(runner.last_heartbeat).getTime() - Date.now()) / 1000;

    if (timeAgo < 0 && timeAgo > -30) {
      return true;
    } else if (timeAgo <= -30) {
      return false;
    }
  }

  return (
    <main>
      <div className="flex items-end justify-between mb-4 mt-2">
        <div>
          <p className="text-3xl font-bold mb-0">
            👋 Welcome Back{" "}
            <span
              className={`text-${user.role === "Admin" ? "danger" : user.role === "VIP" ? "warning" : "primary"}`}
            >
              {user.username}
            </span>
          </p>
        </div>
      </div>
      <Divider className="my-4" />

      {/* Stats */}
      <div className="flex items-end justify-between my-4">
        <div>
          <p className="text-2xl font-bold mb-0">
            Here are your <span className="text-primary">Stats</span>
          </p>
        </div>
      </div>
      <div className="grid lg:grid-cols-4 auto-rows-fr items-start gap-4 mb-4">
        {/* Notifications */}
        {notifications.filter((n: any) => !n.is_read).length > 0 ? (
          <Card
            isHoverable
            isPressable
            className="h-full shadow shadow-warning shadow-sm"
          >
            <CardHeader className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <IconWrapper className="bg-warning/10 text-warning">
                  <Icon icon="solar:bell-bing-broken" width={24} />
                </IconWrapper>
                <p className="text-md font-bold">
                  <span className="text-warning">Missed</span> Notifications
                </p>
              </div>
              <div>
                <p className="flex text-5xl font-bold text-default-400 mb-0">
                  {notifications.filter((n: any) => !n.is_read).length}
                </p>
              </div>
            </CardHeader>
          </Card>
        ) : (
          <Card className="h-full shadow shadow-success shadow-sm">
            <CardHeader className="justify-start gap-2 items-center">
              <IconWrapper className="bg-success/10 text-success">
                <Icon icon="solar:verified-check-broken" width={24} />
              </IconWrapper>
              <p className="text-md font-bold">
                <span className="text-success">No Missed</span> Notifications
              </p>
            </CardHeader>
          </Card>
        )}
        {/* Flows */}
        {flows.filter((f: any) => f.maintenance_required).length > 0 ? (
          <Card
            isHoverable
            isPressable
            className="h-full shadow shadow-warning shadow-sm"
          >
            <CardHeader className="justify-start gap-2 items-center">
              <IconWrapper className="bg-warning/10 text-warning">
                <Icon icon="solar:info-square-broken" width={24} />
              </IconWrapper>
              <p className="text-md font-bold">
                Flows needing <span className="text-warning">attention</span>
              </p>
            </CardHeader>
          </Card>
        ) : (
          <Card className="h-full shadow shadow-success shadow-sm">
            <CardHeader className="justify-start gap-2 items-center">
              <IconWrapper className="bg-success/10 text-success">
                <Icon icon="solar:verified-check-broken" width={24} />
              </IconWrapper>
              <p className="text-md font-bold">
                Flows are all{" "}
                <span className="text-success">working properly</span>
              </p>
            </CardHeader>
          </Card>
        )}
        {/* Executions */}
        {executions.filter((e: any) => e.error).length > 0 ? (
          <Card
            isHoverable
            isPressable
            className="h-full shadow shadow-danger shadow-sm"
          >
            <CardHeader className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <IconWrapper className="bg-danger/10 text-danger">
                  <Icon icon="solar:slash-circle-broken" width={24} />
                </IconWrapper>
                <p className="text-md font-bold">
                  <span className="text-danger">Failed</span> Executions
                </p>
              </div>
              <div>
                <p className="flex text-5xl font-bold text-default-400 mb-0">
                  {executions.filter((e: any) => e.error).length}
                </p>
              </div>
            </CardHeader>
          </Card>
        ) : (
          <Card className="h-full shadow shadow-success shadow-sm">
            <CardHeader className="justify-start gap-2 items-center">
              <IconWrapper className="bg-success/10 text-success">
                <Icon icon="solar:verified-check-broken" width={24} />
              </IconWrapper>
              <p className="text-md font-bold">
                All Executions{" "}
                <span className="text-success">finished without errors</span>
              </p>
            </CardHeader>
          </Card>
        )}

        {/* Runners */}
        {runners.filter((r: any) => !runnerHeartbeatStatus(r)).length > 0 ? (
          <Card
            isHoverable
            isPressable
            className="h-full shadow shadow-danger shadow-sm"
          >
            <CardHeader className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <IconWrapper className="bg-danger/10 text-danger">
                  <Icon icon="solar:heart-pulse-broken" width={24} />
                </IconWrapper>
                <p className="text-md font-bold">
                  <span className="text-danger">Unhealthy</span> Runners
                </p>
              </div>
              <div>
                <p className="flex text-5xl font-bold text-default-400 mb-0">
                  {runners.filter((r: any) => !runnerHeartbeatStatus(r)).length}
                </p>
              </div>
            </CardHeader>
          </Card>
        ) : (
          <Card className="h-full shadow shadow-success shadow-sm">
            <CardHeader className="justify-start gap-2 items-center">
              <IconWrapper className="bg-success/10 text-success">
                <Icon icon="solar:verified-check-broken" width={24} />
              </IconWrapper>
              <p className="text-md font-bold">
                All Runners are <span className="text-success">healthy</span>
              </p>
            </CardHeader>
          </Card>
        )}
      </div>

      {/* Quota */}
      <div className="flex items-end justify-between mb-4 mt-2">
        <div>
          <p className="text-2xl font-bold mb-0">
            Your <span className="text-primary">Quota</span>
          </p>
        </div>
      </div>
      <div className="grid lg:grid-cols-4 items-start gap-4 mb-4">
        <Card>
          <CardHeader className="justify-start gap-2 items-center">
            <IconWrapper className="bg-primary/10 text-primary">
              <Icon icon="solar:box-broken" width={24} />
            </IconWrapper>
            <p className="text-md font-bold">Projects</p>
          </CardHeader>
          <CardBody>
            {plan.projects !== 999 ? (
              <Progress
                showValueLabel
                color="primary"
                maxValue={plan.projects}
                value={stats.projects}
              />
            ) : (
              <p className="text-md font-bold text-secondary">Unlimited</p>
            )}
          </CardBody>
        </Card>
        <Card>
          <CardHeader className="justify-start gap-2 items-center">
            <IconWrapper className="bg-primary/10 text-primary">
              <Icon icon="solar:book-bookmark-broken" width={24} />
            </IconWrapper>
            <p className="text-md font-bold">Flows</p>
          </CardHeader>
          <CardBody>
            {plan.flows !== 999 ? (
              <Progress
                showValueLabel
                color="primary"
                maxValue={plan.flows}
                value={stats.flows}
              />
            ) : (
              <p className="text-md font-bold text-secondary">Unlimited</p>
            )}
          </CardBody>
        </Card>
        <Card>
          <CardHeader className="justify-start gap-2 items-center">
            <IconWrapper className="bg-primary/10 text-primary">
              <Icon icon="solar:rocket-2-broken" width={24} />
            </IconWrapper>
            <p className="text-md font-bold">Self-Hosted Runners</p>
          </CardHeader>
          <CardBody>
            {plan.self_hosted_runners !== 999 ? (
              <Progress
                showValueLabel
                color="primary"
                maxValue={plan.self_hosted_runners}
                value={stats.self_hosted_runners}
              />
            ) : (
              <p className="text-md font-bold text-secondary">Unlimited</p>
            )}
          </CardBody>
        </Card>
        <Card>
          <CardHeader className="justify-start gap-2 items-center">
            <IconWrapper className="bg-primary/10 text-primary">
              <Icon icon="solar:reorder-line-duotone" width={24} />
            </IconWrapper>
            <p className="text-md font-bold">Executions</p>
          </CardHeader>
          <CardBody>
            {plan.executions_per_month !== 999 ? (
              <Progress
                showValueLabel
                color="primary"
                maxValue={plan.executions_per_month}
                value={stats.executions_per_month}
              />
            ) : (
              <p className="text-md font-bold text-secondary">Unlimited</p>
            )}
          </CardBody>
        </Card>
      </div>
      <Card className="relative w-full">
        <Button
          isDisabled
          className="absolute right-4 top-8 z-10"
          radius="full"
          size="sm"
        >
          Change Plan
        </Button>
        <CardBody className="relative bg-gradient-to-br from-content1 to-default-100/50 p-8 before:inset-0 before:h-full before:w-full before:content-['']">
          <h1 className="mb-4 text-default-400">Your Plan</h1>
          <h2 className="inline bg-gradient-to-br from-foreground-800 to-foreground-500 bg-clip-text text-6xl font-semibold tracking-tight text-transparent dark:to-foreground-200">
            {plan.name}
          </h2>
        </CardBody>
        <CardFooter>
          <ul>
            <li className="flex items-center gap-1">
              <Icon className="text-default-600" icon="ci:check" width={24} />
              <p className="text-small text-default-500">
                {plan.projects === 999 ? (
                  <span className="text-secondary">Unlimited</span>
                ) : (
                  plan.projects
                )}{" "}
                Project
              </p>
            </li>
            <li className="flex items-center gap-1">
              <Icon className="text-default-600" icon="ci:check" width={24} />
              <p className="text-small text-default-500">
                {plan.project_members === 999 ? (
                  <span className="text-secondary">Unlimited</span>
                ) : (
                  plan.project_members
                )}{" "}
                Project Members
              </p>
            </li>
            <li className="flex items-center gap-1">
              <Icon className="text-default-600" icon="ci:check" width={24} />
              <p className="text-small text-default-500">
                {plan.flows === 999 ? (
                  <span className="text-secondary">Unlimited</span>
                ) : (
                  plan.flows
                )}{" "}
                Flows
              </p>
            </li>
            <li className="flex items-center gap-1">
              <Icon className="text-default-600" icon="ci:check" width={24} />
              <p className="text-small text-default-500">
                {plan.self_hosted_runners === 999 ? (
                  <span className="text-secondary">Unlimited</span>
                ) : (
                  plan.self_hosted_runners
                )}{" "}
                Self-Hosted Runner
              </p>
            </li>
            <li className="flex items-center gap-1">
              <Icon className="text-default-600" icon="ci:check" width={24} />
              <p className="text-small text-default-500">
                {plan.alertflow_runners === 16 ? (
                  <span className="text-secondary">Unlimited</span>
                ) : (
                  plan.alertflow_runners
                )}{" "}
                AlertFlow Runner
              </p>
            </li>
            <li className="flex items-center gap-1">
              <Icon className="text-default-600" icon="ci:check" width={24} />
              <p className="text-small text-default-500">
                {plan.executions_per_month === 999 ? (
                  <span className="text-secondary">Unlimited</span>
                ) : (
                  plan.executions_per_month
                )}{" "}
                Executions per Month
              </p>
            </li>
          </ul>
        </CardFooter>
      </Card>

      {/* Latest executions */}
      <div className="flex items-end justify-between my-4">
        <div>
          <p className="text-2xl font-bold mb-0">
            Latest <span className="text-primary">Executions</span>
          </p>
        </div>
      </div>
      <Executions displayToFlow executions={executions} />
    </main>
  );
}
