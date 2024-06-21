"use client";
import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Code,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
  Button,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";

import {
  VerticalDotsIcon,
  DeleteDocumentIcon,
  CopyDocumentIcon,
} from "@/components/icons";
import { subtitle } from "@/components/primitives";

export function ProjectsList({ projects }: any) {
  const router = useRouter();

  const copyProjectIDtoClipboard = (key: string) => {
    // eslint-disable-next-line no-undef
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      // eslint-disable-next-line no-undef
      navigator.clipboard.writeText(key);
      toast.success("Copied to clipboard!");
    } else {
      toast.error("Failed to copy project ID to clipboard");
    }
  };

  return (
    <main>
      <Toaster richColors position="bottom-center" />
      <h1 className={subtitle()} style={{ color: "violet" }}>
        Projects
      </h1>
      <Divider className="mb-4" />
      <div className="grid lg:grid-cols-2 gap-4">
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
                <Dropdown backdrop="opaque">
                  <DropdownTrigger>
                    <Button isIconOnly size="sm" variant="light">
                      <VerticalDotsIcon
                        className="text-default-300"
                        height={undefined}
                        width={undefined}
                      />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu>
                    <DropdownSection title="Actions">
                      <DropdownItem
                        startContent={<CopyDocumentIcon />}
                        onClick={() => copyProjectIDtoClipboard(project.id)}
                      >
                        Copy ID
                      </DropdownItem>
                    </DropdownSection>
                    <DropdownSection title="Danger zone">
                      <DropdownItem
                        className="text-danger"
                        color="danger"
                        startContent={<DeleteDocumentIcon />}
                      >
                        Delete
                      </DropdownItem>
                    </DropdownSection>
                  </DropdownMenu>
                </Dropdown>
              </CardHeader>
              <Divider />
              <CardBody>
                <p>{project.description}</p>
                <p className="text-small text-default-500 mt-2">
                  Created At: {new Date(project.created_at).toDateString()}
                </p>
              </CardBody>
            </Card>
          </div>
        ))}
      </div>
    </main>
  );
}
