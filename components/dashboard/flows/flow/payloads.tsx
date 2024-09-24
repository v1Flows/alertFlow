"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Pagination,
  Spacer,
  useDisclosure,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import TimeAgo from "react-timeago";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

import FunctionShowPayloadModal from "@/components/functions/flows/showPayload";
import FunctionDeletePayloadModal from "@/components/functions/flows/deletePayload";
import {
  CopyDocumentIcon,
  DeleteDocumentIcon,
  VerticalDotsIcon,
} from "@/components/icons";

export default function Payloads({ flow, executions, payloads, runners }: any) {
  const router = useRouter();

  const showPayloadModal = useDisclosure();
  const deletePayloadModal = useDisclosure();
  const [targetPayload, setTargetPayload] = React.useState({} as any);

  // pagination
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 9;
  const pages = Math.ceil(payloads.length / rowsPerPage);
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return payloads.slice(start, end);
  }, [page, payloads]);

  const handleShow = (payload: any) => {
    setTargetPayload(payload);
    showPayloadModal.onOpen();
  };

  const handleDelete = (payload: any) => {
    setTargetPayload(payload);
    deletePayloadModal.onOpen();
  };

  function endpointColor(endpoint: string) {
    switch (endpoint) {
      case "alertmanager":
        return "warning";
      default:
        return "default";
    }
  }

  function endpointIcon(endpoint: string): string {
    switch (endpoint) {
      case "alertmanager":
        return "vscode-icons:file-type-prometheus";
      default:
        return "solar:forbidden-circle-broken";
    }
  }

  const copyPayloadIDtoClipboard = (id: string) => {
    // eslint-disable-next-line no-undef
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      // eslint-disable-next-line no-undef
      navigator.clipboard.writeText(id);
      toast.success("Payload ID copied to clipboard!");
    } else {
      toast.error("Failed to copy Payload ID to clipboard");
    }
  };

  return (
    <main>
      {items.length === 0 && (
        <p className="text-center text-default-500">No payloads found</p>
      )}
      <div className="grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 gap-4">
        {items.map((payload: any) => (
          <Card key={payload.id} fullWidth>
            <CardHeader className="justify-between items-center">
              <p className="text-sm text-default-500">{payload.id}</p>
              <div className="relative flex justify-end items-center gap-2">
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
                        onClick={() => copyPayloadIDtoClipboard(payload.id)}
                      >
                        Copy ID
                      </DropdownItem>
                    </DropdownSection>
                    <DropdownSection title="Danger zone">
                      <DropdownItem
                        className="text-danger"
                        color="danger"
                        startContent={<DeleteDocumentIcon />}
                        onClick={() => handleDelete(payload)}
                      >
                        Delete
                      </DropdownItem>
                    </DropdownSection>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </CardHeader>
            <CardBody>
              <div className="grid lg:grid-cols-3 gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex bg-${endpointColor(payload.endpoint)}/10 text-${endpointColor(payload.endpoint)} items-center rounded-small justify-center w-10 h-10`}
                  >
                    <Icon icon={endpointIcon(payload.endpoint)} width={20} />
                  </div>
                  <div>
                    <p
                      className={`text-md text-${endpointColor(payload.endpoint)} capitalize font-bold`}
                    >
                      {payload.endpoint || "No endpoint"}
                    </p>
                    <p className="text-sm text-default-500">Endpoint</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex bg-primary/10 text-primary items-center rounded-small justify-center w-10 h-10">
                    <Icon icon="solar:rocket-2-broken" width={20} />
                  </div>
                  <div>
                    <p className="text-md font-bold">
                      {
                        runners.find(
                          (runner: any) => runner.id === payload.runner_id,
                        )?.name
                      }
                    </p>
                    <p className="text-sm text-default-500">Runner</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex bg-primary/10 text-primary items-center rounded-small justify-center w-10 h-10">
                    <Icon icon="solar:calendar-broken" width={20} />
                  </div>
                  <div>
                    <p className="text-md font-bold">
                      <TimeAgo date={new Date(payload.created_at)} />
                    </p>
                    <p className="text-sm text-default-500">Created</p>
                  </div>
                </div>
              </div>

              <Spacer y={4} />

              <div className="grid grid-cols-2 gap-4">
                <Button
                  fullWidth
                  color="primary"
                  size="md"
                  startContent={<Icon icon="solar:eye-broken" width={20} />}
                  onPress={() => handleShow(payload)}
                >
                  Show Payload
                </Button>
                <Button
                  fullWidth
                  color="default"
                  isDisabled={
                    !executions.find(
                      (execution: any) => execution.payload_id === payload.id,
                    )
                  }
                  size="md"
                  startContent={
                    <Icon icon="solar:reorder-line-duotone" width={20} />
                  }
                  variant="solid"
                  onPress={() => {
                    router.push(
                      `/dashboard/flows/${flow.id}/execution/${executions.find(
                        (execution: any) =>
                          execution.payload_id === payload.id,
                      ).id
                      }`,
                    );
                  }}
                >
                  View Execution
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <Pagination
          showControls
          isDisabled={items.length === 0}
          page={page}
          total={pages}
          onChange={(page) => setPage(page)}
        />
      </div>
      <FunctionShowPayloadModal
        disclosure={showPayloadModal}
        payload={targetPayload}
      />
      <FunctionDeletePayloadModal
        disclosure={deletePayloadModal}
        flow={flow}
        payload={targetPayload}
      />
    </main>
  );
}
