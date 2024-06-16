import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Code,
} from "@nextui-org/react";

import { subtitle } from "@/components/primitives";

export function ProjectsList() {
  return (
    <main>
      <h1 className={subtitle()} style={{ color: "violet" }}>
        Projects
      </h1>
      <Divider className="mb-4" />
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-1">
          <Card className="hover:cursor-pointer hover:shadow hover:shadow-primary shadow shadow-primary-200">
            <CardHeader className="justify-between">
              <p className="text-md">JustLab</p>
              <Code color="secondary">123123-123123123-12312313-13123</Code>
            </CardHeader>
            <Divider />
            <CardBody>
              <p>
                Make beautiful websites regardless of your design experience.
              </p>
            </CardBody>
            <Divider />
            <CardFooter>
              <p className="text-small text-default-500">
                Last Modified: {new Date().toDateString()}
              </p>
            </CardFooter>
          </Card>
        </div>
        <div className="col-span-1">
          <Card>
            <CardBody>
              <p>
                Make beautiful websites regardless of your design experience.
              </p>
            </CardBody>
          </Card>
        </div>
        <div className="col-span-1">
          <Card>
            <CardBody>
              <p>
                Make beautiful websites regardless of your design experience.
              </p>
            </CardBody>
          </Card>
        </div>
        <div className="col-span-1">
          <Card>
            <CardBody>
              <p>
                Make beautiful websites regardless of your design experience.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </main>
  );
}
