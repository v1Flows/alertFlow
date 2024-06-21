"use client";
import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  Button,
  CardFooter,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";

import { IconWrapper } from "@/lib/IconWrapper";
import { EyeIcon, InfoIcon } from "@/components/icons";
import { subtitle } from "@/components/primitives";
import {
  CopyDocumentIcon,
  DeleteDocumentIcon,
  VerticalDotsIcon,
} from "@/components/icons";

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
      {projects.error && (
        <Card className="shadow shadow-danger">
          <CardHeader className="justify-start gap-2 items-center">
            <IconWrapper className="bg-danger/10 text-danger">
              <InfoIcon className="text-lg" />
            </IconWrapper>
            <p className="text-md font-bold text-danger">Error</p>
          </CardHeader>
          <CardBody>
            <p>{projects.error}. Please try again later.</p>
          </CardBody>
        </Card>
      )}
      {!projects.error && (
        <div className="grid lg:grid-cols-2 gap-4">
          {projects.map((project: any) => (
            <div key={project.id} className="col-span-1">
              <Card
                fullWidth
                className="hover:shadow-md hover:shadow-primary shadow shadow-primary-200"
              >
                <CardHeader className="justify-between">
                  <div className="flex flex-col items-start">
                    <p className="text-md">{project.name}</p>
                    <p className="text-sm text-default-500">
                      {project.description}
                    </p>
                  </div>
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
                  <p className="text-small text-default-500 mt-2">
                    Created At:{" "}
                    {new Date(project.created_at).toLocaleString("de-DE")}
                  </p>
                </CardBody>
                <CardFooter>
                  <Button
                    className="w-full"
                    color="primary"
                    radius="sm"
                    variant="flat"
                    onPress={() =>
                      router.push(`/dashboard/projects/${project.id}`)
                    }
                  >
                    <EyeIcon />
                    Go to Project
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
