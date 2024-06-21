"use client";
import React from "react";
import { Toaster, toast } from "sonner";
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
  Button,
  Chip,
  CardFooter,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";

import {
  VerticalDotsIcon,
  DeleteDocumentIcon,
  CopyDocumentIcon,
  EyeIcon,
} from "@/components/icons";
import { subtitle } from "@/components/primitives";

export default function FlowList({ flows, projects }: any) {
  const router = useRouter();

  const copyFlowIDtoClipboard = (key: string) => {
    // eslint-disable-next-line no-undef
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      // eslint-disable-next-line no-undef
      navigator.clipboard.writeText(key);
      toast.success("Copied to clipboard!");
    } else {
      toast.error("Failed to copy flow ID to clipboard");
    }
  };

  return (
    <main>
      <Toaster richColors position="bottom-center" />
      <h1 className={subtitle()} style={{ color: "violet" }}>
        Flows
      </h1>
      <Divider className="mb-4" />
      <div className="grid lg:grid-cols-2 gap-4">
        {flows.map((flow: any) => (
          <div key={flow.id} className="col-span-1">
            <Card
              fullWidth
              className="hover:shadow-md hover:shadow-primary shadow shadow-primary-200"
            >
              <CardHeader className="justify-between">
                <div className="flex flex-col items-start">
                  <p className="text-md">{flow.name}</p>
                  <p className="text-sm text-default-500">{flow.description}</p>
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
                        onClick={() => copyFlowIDtoClipboard(flow.id)}
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
                <div className="flex items-center gap-2 justify-start">
                  <Chip color="primary" radius="sm" size="sm" variant="flat">
                    Project:{" "}
                    {projects.map(
                      (project: any) =>
                        project.id === flow.project_id && project.name,
                    )}
                  </Chip>
                  <Chip
                    color={flow.active ? "success" : "danger"}
                    radius="sm"
                    size="sm"
                    variant="flat"
                  >
                    Status: {flow.active ? "Active" : "Inactive"}
                  </Chip>
                </div>
                <div className="flex items-end justify-between">
                  <p className="text-small text-default-500 mt-2">
                    Updated At:{" "}
                    {new Date(flow.updated_at).toLocaleString("de-DE")}
                  </p>
                  <p className="text-small text-default-500 mt-2">
                    Created At:{" "}
                    {new Date(flow.created_at).toLocaleString("de-DE")}
                  </p>
                </div>
              </CardBody>
              <CardFooter>
                <Button
                  className="w-full"
                  color="primary"
                  radius="sm"
                  variant="flat"
                  onPress={() => router.push(`/dashboard/flows/${flow.id}`)}
                >
                  <EyeIcon />
                  Go to Flow
                </Button>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </main>
  );
}
