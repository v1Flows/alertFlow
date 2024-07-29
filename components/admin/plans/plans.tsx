import { Icon } from "@iconify/react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
} from "@nextui-org/react";

export default function AdminPlans({ plans }: any) {
  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";

  return (
    <main>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <p className="text-2xl font-bold mb-0 text-danger">Admin</p>
          <p className="text-2xl mb-0">|</p>
          <p className="text-2xl mb-0">Plans</p>
        </div>
      </div>
      <Divider className="my-4" />
      <div className="grid lg:grid-cols-4 gap-4">
        {plans.map((plan: any) => (
          <Card key={plan.id}>
            <CardHeader className="justify-between">
              <div className="flex flex-col">
                <p className="mb-0 text-primary text-lg font-bold">
                  {plan.name}
                </p>
                <p className="text-sm text-default-500">{plan.description}</p>
              </div>
              {plan.is_default && (
                <Chip color="primary" radius="sm" size="md" variant="dot">
                  Default
                </Chip>
              )}
              {plan.oauth && (
                <Chip color="warning" radius="sm" size="md" variant="dot">
                  OAuth
                </Chip>
              )}
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 gap-2 justify-between items-center">
                <p className="text-sm text-default-600">Price</p>
                <p className="text-lg font-bold">
                  {plan.price === 0
                    ? "Free"
                    : plan.price === 999
                      ? "On Demand"
                      : plan.price + "€" + " / " + plan.period}
                </p>
                {/* */}
                <p className="text-sm text-default-600">Projects</p>
                <p className="text-lg font-bold">
                  {plan.projects === 999 ? "Unlimited" : plan.projects}
                </p>
                {/* */}
                <p className="text-sm text-default-600">Project Members</p>
                <p className="text-lg font-bold">
                  {plan.project_members === 999
                    ? "Unlimited"
                    : plan.project_members}
                </p>
                {/* */}
                <p className="text-sm text-default-600">Flows</p>
                <p className="text-lg font-bold">
                  {plan.flows === 999 ? "Unlimited" : plan.flows}
                </p>
                {/* */}
                <p className="text-sm text-default-600">Self-Hosted Runners</p>
                <p className="text-lg font-bold">
                  {plan.self_hosted_runners === 999
                    ? "Unlimited"
                    : plan.self_hosted_runners}
                </p>
                {/* */}
                <p className="text-sm text-default-600">AlertFlow Runners</p>
                <p className="text-lg font-bold">
                  {plan.alertflow_runners >= 16
                    ? "Unlimited"
                    : plan.alertflow_runners}
                </p>
                {/* */}
                <p className="text-sm text-default-600">Executions per Month</p>
                <p className="text-lg font-bold">
                  {plan.executions_per_month === 999
                    ? "Unlimited"
                    : plan.executions_per_month}
                </p>
              </div>
            </CardBody>
            <CardFooter>
              <Button fullWidth color="warning" size="sm" variant="flat">
                <Icon
                  height={20}
                  icon="solar:pen-new-square-broken"
                  width={20}
                />{" "}
                Edit
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
