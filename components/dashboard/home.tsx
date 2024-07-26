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

export function DashboardHome({ stats }: any) {
  return (
    <main>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <p className="text-2xl font-bold mb-0">Dashboard Home</p>
        </div>
      </div>
      <Divider className="my-4" />
      <div className="grid lg:grid-cols-2 items-start gap-4">
        <div>
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
                Hobby
              </h2>
            </CardBody>
            <CardFooter>
              <ul>
                <li className="flex items-center gap-1">
                  <Icon
                    className="text-default-600"
                    icon="ci:check"
                    width={24}
                  />
                  <p className="text-small text-default-500">1 Project</p>
                </li>
                <li className="flex items-center gap-1">
                  <Icon
                    className="text-default-600"
                    icon="ci:check"
                    width={24}
                  />
                  <p className="text-small text-default-500">2 Flows</p>
                </li>
                <li className="flex items-center gap-1">
                  <Icon
                    className="text-default-600"
                    icon="ci:check"
                    width={24}
                  />
                  <p className="text-small text-default-500">1 Runner</p>
                </li>
              </ul>
            </CardFooter>
          </Card>
        </div>
        <div className="grid lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="flex items-center gap-3 px-4 pb-0 pt-3 md:px-10 md:pt-5 md:pb-4 pb-2">
              <div className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-gradient-to-br from-success-300 to-primary-500">
                <Icon
                  className="text-white"
                  icon="solar:box-broken"
                  width={30}
                />
              </div>
              <Progress
                showValueLabel
                classNames={{
                  label: "font-medium",
                  indicator: "bg-gradient-to-r from-primary-400 to-success-500",
                  value: "text-foreground/60",
                }}
                label="Projects"
                maxValue={1}
                value={stats.projects}
                valueLabel={stats.projects + " / 1"}
              />
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="flex items-center gap-3 px-4 pb-0 pt-3 md:px-10 md:pt-5 md:pb-4 pb-2">
              <div className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-gradient-to-br from-primary-300 to-secondary-500">
                <Icon
                  className="text-white"
                  icon="solar:book-bookmark-broken"
                  width={30}
                />
              </div>
              <Progress
                showValueLabel
                classNames={{
                  label: "font-medium",
                  indicator:
                    "bg-gradient-to-r from-secondary-400 to-primary-500",
                  value: "text-foreground/60",
                }}
                label="Flows"
                maxValue={2}
                value={stats.flows}
                valueLabel={stats.flows + " / 2"}
              />
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="flex items-center gap-3 px-4 pb-0 pt-3 md:px-10 md:pt-5 md:pb-4 pb-2">
              <div className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-warning">
                <Icon
                  className="text-white"
                  icon="solar:rocket-2-broken"
                  width={30}
                />
              </div>
              <Progress
                showValueLabel
                classNames={{
                  label: "font-medium",
                  value: "text-foreground/60",
                }}
                color="warning"
                label="Runners"
                maxValue={1}
                value={stats.runners}
                valueLabel={stats.runners + " / 1"}
              />
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="flex items-center gap-3 px-4 pb-0 pt-3 md:px-10 md:pt-5 md:pb-4 pb-2">
              <div className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-primary">
                <Icon
                  className="text-white"
                  icon="solar:reorder-line-duotone"
                  width={30}
                />
              </div>
              <Progress
                showValueLabel
                classNames={{
                  label: "font-medium",
                  value: "text-foreground/60",
                }}
                color="primary"
                label="Executions"
                maxValue={35}
                value={12}
              />
            </CardHeader>
          </Card>
        </div>
      </div>
    </main>
  );
}
