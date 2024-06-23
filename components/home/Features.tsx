import { Card, CardBody, CardHeader } from "@nextui-org/react";

import { IconWrapper } from "@/lib/IconWrapper";
import {
  ChevronDown,
  Lock,
  Activity,
  Flash,
  Server,
  TagUser,
  Scale,
} from "@/components/icons";

export default function HomeFeatures() {
  const icons = {
    chevron: <ChevronDown fill="currentColor" size={16} />,
    scale: <Scale className="text-warning" fill="currentColor" size={30} />,
    lock: <Lock className="text-success" fill="currentColor" size={30} />,
    activity: (
      <Activity className="text-secondary" fill="currentColor" size={30} />
    ),
    flash: <Flash className="text-primary" fill="currentColor" size={30} />,
    server: <Server className="text-success" fill="currentColor" size={30} />,
    user: <TagUser className="text-danger" fill="currentColor" size={30} />,
  };

  return (
    <main>
      <div className="grid lg:grid-cols-4 items-center justify-between gap-4">
        <Card fullWidth>
          <CardHeader className="justify-start gap-2 items-center">
            <IconWrapper className="bg-success/10">
              <Server className="text-success" fill="currentColor" size={25} />
            </IconWrapper>
            <p className="text-md font-bold">Projects</p>
          </CardHeader>
          <CardBody className="py-0 mb-3">
            <p className="text-sm text-default-500">
              Assign your Flows to Projects and grant other people within your
              team access to them.
            </p>
          </CardBody>
        </Card>
        <Card fullWidth>
          <CardHeader className="justify-start gap-2 items-center">
            <IconWrapper className="bg-blue-600/10">
              <Flash className="text-primary" fill="currentColor" size={25} />
            </IconWrapper>
            <p className="text-md font-bold">Flows</p>
          </CardHeader>
          <CardBody className="py-0 mb-3">
            <p className="text-sm text-default-500">
              Create Flows to automate your alarms and define workflows.
              Workflows can be Webhooks, Send Mail, etc.
            </p>
          </CardBody>
        </Card>
        <Card fullWidth>
          <CardHeader className="justify-start gap-2 items-center">
            <IconWrapper className="bg-warning/10">
              <Scale className="text-warning" fill="currentColor" size={25} />
            </IconWrapper>
            <p className="text-md font-bold">Self-Hosted Runners</p>
          </CardHeader>
          <CardBody className="py-0 mb-3">
            <p className="text-sm text-default-500">
              If you are working in an isolated network or have security
              concerns, you can host your own runners to perform your flows.
            </p>
          </CardBody>
        </Card>
        <Card fullWidth>
          <CardHeader className="justify-start gap-2 items-center">
            <IconWrapper className="bg-secondary/10">
              <Activity
                className="text-secondary"
                fill="currentColor"
                size={25}
              />
            </IconWrapper>
            <p className="text-md font-bold">Plugins</p>
          </CardHeader>
          <CardBody className="py-0 mb-3">
            <p className="text-sm text-default-500">
              Add your own plugins to extend the AlertFlow Runner with new
              actions and integrations.
            </p>
          </CardBody>
        </Card>
      </div>
    </main>
  );
}
