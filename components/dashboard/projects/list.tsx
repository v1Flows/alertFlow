"use client";
import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Code,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";

import { subtitle } from "@/components/primitives";

export function ProjectsList({ projects }: any) {
  const router = useRouter();

  return (
    <main>
      <h1 className={subtitle()} style={{ color: "violet" }}>
        Projects
      </h1>
      <Divider className="mb-4" />
      <div className="grid grid-cols-2 gap-4">
        {projects.map((project: any) => (
          <div key={project.id} className="col-span-1">
            <Card
              fullWidth
              isHoverable
              isPressable
              className="hover:shadow hover:shadow-primary shadow shadow-primary-200"
              onPress={() => router.push(`/dashboard/projects/${project.id}`)}
            >
              <CardHeader className="justify-between">
                <p className="text-md">{project.name}</p>
                <Code color="secondary">{project.id}</Code>
              </CardHeader>
              <Divider />
              <CardBody>
                <p>{project.description}</p>
              </CardBody>
              <CardFooter>
                <p className="text-small text-default-500">
                  Created At: {new Date(project.created_at).toDateString()}
                </p>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </main>
  );
}
