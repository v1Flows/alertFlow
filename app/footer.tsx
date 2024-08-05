import { Card, CardBody } from "@nextui-org/react";

export default function Footer() {
  return (
    <div>
      <Card radius="none">
        <CardBody className="text-center">
          <p className="text-sm text-default-500">
            © {new Date().getFullYear()} JustLab. All rights reserved.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
