import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  Chip,
} from "@nextui-org/react";
import { Blocks, FolderKanban, Forklift, Workflow } from "lucide-react";

export default function HomeFeatures() {
  return (
    <main>
      <div className="grid lg:grid-cols-4 items-center justify-between gap-4">
        <Card
          className="max-w-[320px] border-small border-default-100 p-3"
          shadow="sm"
        >
          <CardBody className="px-4 pb-1">
            <div className="flex items-center justify-between gap-2">
              <div className="flex max-w-[80%] flex-col gap-1">
                <p className="text-medium font-medium">Projects</p>
                <p className="text-small text-default-500">
                  By The AlertFlow Team
                </p>
              </div>
              <Avatar className="bg-success" icon={<FolderKanban />} />
            </div>
            <p className="pt-4 text-small text-default-500">
              Projects are your place to be. Invite other Users, create Runners,
              Flows and so much more.
            </p>
          </CardBody>
          <CardFooter className="justify-between gap-2">
            <Button isDisabled size="sm" variant="faded">
              Learn more
            </Button>
            <Chip color="success" variant="dot">
              Projects
            </Chip>
          </CardFooter>
        </Card>
        <Card
          className="max-w-[320px] border-small border-default-100 p-3"
          shadow="sm"
        >
          <CardBody className="px-4 pb-1">
            <div className="flex items-center justify-between gap-2">
              <div className="flex max-w-[80%] flex-col gap-1">
                <p className="text-medium font-medium">Flows</p>
                <p className="text-small text-default-500">
                  By The AlertFlow Team
                </p>
              </div>
              <Avatar className="bg-primary" icon={<Workflow />} />
            </div>
            <p className="pt-4 text-small text-default-500">
              Flows trigger all your automations. Define what you need and we
              take care of the rest.
            </p>
          </CardBody>
          <CardFooter className="justify-between gap-2">
            <Button isDisabled size="sm" variant="faded">
              Learn more
            </Button>
            <Chip color="primary" variant="dot">
              Flows
            </Chip>
          </CardFooter>
        </Card>
        <Card
          className="max-w-[320px] border-small border-default-100 p-3"
          shadow="sm"
        >
          <CardBody className="px-4 pb-1">
            <div className="flex items-center justify-between gap-2">
              <div className="flex max-w-[80%] flex-col gap-1">
                <p className="text-medium font-medium">Self-Hosted Runners</p>
                <p className="text-small text-default-500">
                  By The AlertFlow Team
                </p>
              </div>
              <Avatar className="bg-warning" icon={<Forklift />} />
            </div>
            <p className="pt-4 text-small text-default-500">
              Runners are the executers of your automations. You can host your
              own ones or ours.
            </p>
          </CardBody>
          <CardFooter className="justify-between gap-2">
            <Button isDisabled size="sm" variant="faded">
              Learn more
            </Button>
            <Chip color="warning" variant="dot">
              Runners
            </Chip>
          </CardFooter>
        </Card>
        <Card
          className="max-w-[320px] border-small border-default-100 p-3"
          shadow="sm"
        >
          <CardBody className="px-4 pb-1">
            <div className="flex items-center justify-between gap-2">
              <div className="flex max-w-[80%] flex-col gap-1">
                <p className="text-medium font-medium">Plugins</p>
                <p className="text-small text-default-500">By You & Us</p>
              </div>
              <Avatar className="bg-secondary" icon={<Blocks />} />
            </div>
            <p className="pt-4 text-small text-default-500">
              Plugins can extend the functions of your automations and runners.
              Use existing ones or create your own.
            </p>
          </CardBody>
          <CardFooter className="justify-between gap-2">
            <Button isDisabled size="sm" variant="faded">
              Learn more
            </Button>
            <Chip color="secondary" variant="dot">
              Plugins
            </Chip>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
