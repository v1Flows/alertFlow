import { Icon } from "@iconify/react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Progress,
  useDisclosure,
} from "@nextui-org/react";

import SelectPlanModal from "../functions/payment/selectPlan";

export default function Quota({
  user,
  plans,
  stats,
}: {
  user: any;
  plans: any;
  stats: any;
}) {
  const selectPlanModal = useDisclosure();

  const plan = plans.find((plan: any) => plan.id === user.plan);

  return (
    <>
      <div className="grid lg:grid-cols-3 grid-cols-1 items-stretch gap-4">
        <div className="col-span-1 grid grid-cols-2 items-start gap-4">
          <Card className="h-full">
            <CardBody className="flex gap-1 items-center justify-center">
              <div className="flex items-center rounded-large justify-center bg-primary bg-opacity-10 w-12 h-12">
                <Icon
                  className="text-primary"
                  icon="solar:box-broken"
                  width={28}
                />
              </div>
              <p className="text-default-600">Projects</p>
              {plan.projects !== 999 && user.role !== "VIP" ? (
                <>
                  <p className="text-lg font-bold">
                    {stats.projects} / {plan.projects}
                  </p>
                  <Progress
                    color={
                      stats.projects >= plan.projects ? "danger" : "primary"
                    }
                    maxValue={plan.projects}
                    value={stats.projects}
                  />
                </>
              ) : (
                <p
                  className={`text-lg font-bold text-${user.role === "VIP" ? "warning" : "secondary"}`}
                >
                  Unlimited
                </p>
              )}
            </CardBody>
          </Card>
          <Card className="h-full">
            <CardBody className="flex gap-1 items-center justify-center">
              <div className="flex items-center rounded-large justify-center bg-primary bg-opacity-10 w-12 h-12">
                <Icon
                  className="text-primary"
                  icon="solar:book-bookmark-broken"
                  width={28}
                />
              </div>
              <p className="text-default-600">Flows</p>
              {plan.flows !== 999 && user.role !== "VIP" ? (
                <>
                  <p className="text-lg font-bold">
                    {stats.flows} / {plan.flows}
                  </p>
                  <Progress
                    color={stats.flows >= plan.flows ? "danger" : "primary"}
                    maxValue={plan.flows}
                    value={stats.flows}
                  />
                </>
              ) : (
                <p
                  className={`text-lg font-bold text-${user.role === "VIP" ? "warning" : "secondary"}`}
                >
                  Unlimited
                </p>
              )}
            </CardBody>
          </Card>
          <Card className="h-full">
            <CardBody className="flex gap-1 items-center justify-center">
              <div className="flex items-center rounded-large justify-center bg-primary bg-opacity-10 w-12 h-12">
                <Icon
                  className="text-primary"
                  icon="solar:rocket-2-broken"
                  width={28}
                />
              </div>
              <p className="text-default-600">Self-Hosted Runners</p>
              {plan.self_hosted_runners !== 999 && user.role !== "VIP" ? (
                <>
                  <p className="text-lg font-bold">
                    {stats.runners ? stats.runners : 0} /{" "}
                    {plan.self_hosted_runners}
                  </p>
                  <Progress
                    color={
                      stats.runners >= plan.self_hosted_runners
                        ? "danger"
                        : "primary"
                    }
                    maxValue={plan.self_hosted_runners}
                    value={stats.runners}
                  />
                </>
              ) : (
                <p
                  className={`text-lg font-bold text-${user.role === "VIP" ? "warning" : "secondary"}`}
                >
                  Unlimited
                </p>
              )}
            </CardBody>
          </Card>
          <Card className="h-full">
            <CardBody className="flex gap-1 items-center justify-center">
              <div className="flex items-center rounded-large justify-center bg-primary bg-opacity-10 w-12 h-12">
                <Icon
                  className="text-primary"
                  icon="solar:reorder-line-duotone"
                  width={28}
                />
              </div>
              <p className="text-default-600">Executions</p>
              {plan.executions_per_month !== 999 && user.role !== "VIP" ? (
                <>
                  <p className="text-lg font-bold">
                    {stats.total_executions ? stats.total_executions : 0} /{" "}
                    {plan.executions_per_month}
                  </p>
                  <Progress
                    color={
                      stats.total_executions >= plan.executions_per_month
                        ? "danger"
                        : "primary"
                    }
                    maxValue={plan.executions_per_month}
                    value={stats.total_executions}
                  />
                </>
              ) : (
                <p
                  className={`text-lg font-bold text-${user.role === "VIP" ? "warning" : "secondary"}`}
                >
                  Unlimited
                </p>
              )}
            </CardBody>
          </Card>
        </div>
        <div className="col-span-2">
          <Card className="relative w-full">
            <Button
              className="absolute right-4 top-8 z-10"
              radius="full"
              size="sm"
              onPress={selectPlanModal.onOpen}
            >
              Change Plan
            </Button>
            <CardBody className="relative bg-gradient-to-br from-content1 to-default-100/50 p-8 before:inset-0 before:h-full before:w-full before:content-['']">
              <h1 className="mb-4 text-default-400">Your Plan</h1>
              {user.role === "Admin" && (
                <h2 className="inline bg-clip-text text-6xl font-semibold tracking-tight text-danger">
                  Admin
                </h2>
              )}
              {user.role === "VIP" && (
                <h2 className="flex gap-1 items-center inline bg-clip-text text-6xl font-semibold tracking-tight text-warning">
                  <Icon icon="solar:crown-broken" /> VIP
                </h2>
              )}
              {user.role === "User" && (
                <h2 className="inline bg-gradient-to-br from-foreground-800 to-foreground-500 bg-clip-text text-6xl font-semibold tracking-tight text-transparent dark:to-foreground-200">
                  {plan.name}
                </h2>
              )}
            </CardBody>
            <CardFooter>
              <ul>
                <li className="flex items-center gap-1">
                  <Icon
                    className="text-default-600"
                    icon="ci:check"
                    width={24}
                  />
                  <p className="text-small text-default-500">
                    {plan.projects === 999 || user.role === "VIP" ? (
                      <span
                        className={`text-${user.role === "VIP" ? "warning" : "secondary"}`}
                      >
                        Unlimited
                      </span>
                    ) : (
                      plan.projects
                    )}{" "}
                    Project
                  </p>
                </li>
                <li className="flex items-center gap-1">
                  <Icon
                    className="text-default-600"
                    icon="ci:check"
                    width={24}
                  />
                  <p className="text-small text-default-500">
                    {plan.project_members === 999 || user.role === "VIP" ? (
                      <span
                        className={`text-${user.role === "VIP" ? "warning" : "secondary"}`}
                      >
                        Unlimited
                      </span>
                    ) : (
                      plan.project_members
                    )}{" "}
                    Project Members
                  </p>
                </li>
                <li className="flex items-center gap-1">
                  <Icon
                    className="text-default-600"
                    icon="ci:check"
                    width={24}
                  />
                  <p className="text-small text-default-500">
                    {plan.flows === 999 || user.role === "VIP" ? (
                      <span
                        className={`text-${user.role === "VIP" ? "warning" : "secondary"}`}
                      >
                        Unlimited
                      </span>
                    ) : (
                      plan.flows
                    )}{" "}
                    Flows
                  </p>
                </li>
                <li className="flex items-center gap-1">
                  <Icon
                    className="text-default-600"
                    icon="ci:check"
                    width={24}
                  />
                  <p className="text-small text-default-500">
                    {plan.self_hosted_runners === 999 || user.role === "VIP" ? (
                      <span
                        className={`text-${user.role === "VIP" ? "warning" : "secondary"}`}
                      >
                        Unlimited
                      </span>
                    ) : (
                      plan.self_hosted_runners
                    )}{" "}
                    Self-Hosted Runner
                  </p>
                </li>
                <li className="flex items-center gap-1">
                  <Icon
                    className="text-default-600"
                    icon="ci:check"
                    width={24}
                  />
                  <p className="text-small text-default-500">
                    {plan.alertflow_runners === 16 || user.role === "VIP" ? (
                      <span
                        className={`text-${user.role === "VIP" ? "warning" : "secondary"}`}
                      >
                        Unlimited
                      </span>
                    ) : (
                      plan.alertflow_runners
                    )}{" "}
                    AlertFlow Runner
                  </p>
                </li>
                <li className="flex items-center gap-1">
                  <Icon
                    className="text-default-600"
                    icon="ci:check"
                    width={24}
                  />
                  <p className="text-small text-default-500">
                    {plan.executions_per_month === 999 ||
                    user.role === "VIP" ? (
                      <span
                        className={`text-${user.role === "VIP" ? "warning" : "secondary"}`}
                      >
                        Unlimited
                      </span>
                    ) : (
                      plan.executions_per_month
                    )}{" "}
                    Executions per Month
                  </p>
                </li>
              </ul>
            </CardFooter>
          </Card>
        </div>
      </div>

      <SelectPlanModal disclosure={selectPlanModal} plans={plans} user={user} />
    </>
  );
}
