"use client"

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Pagination,
  useDisclosure,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import TimeAgo from "react-timeago";
import { useRouter } from "next/navigation";
import React from "react";

import FunctionShowPayloadModal from "@/components/functions/flows/showPayload";
import FunctionDeletePayloadModal from "@/components/functions/flows/deletePayload";

export default function Payloads({ flow, executions, payloads, runners }: any) {
  const router = useRouter();

  const showPayloadModal = useDisclosure();
  const deletePayloadModal = useDisclosure();
  const [targetPayload, setTargetPayload] = React.useState({} as any);

  // pagination
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 6;
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

  return (
    <main>
      <div className="grid lg:grid-cols-2 gap-4">
        {items.map((payload: any) => (
          <Card key={payload.id} fullWidth>
            <CardHeader className="flex items-center justify-between">
              <div>
                <p className="text-md font-bold">{payload.id}</p>
                <p className="text-sm">
                  {
                    runners.find(
                      (runner: any) => runner.id === payload.runner_id,
                    )?.name
                  }
                </p>
              </div>
              <Chip color="default" radius="sm" variant="light">
                <TimeAgo date={new Date(payload.created_at)} />
              </Chip>
            </CardHeader>
            <CardBody className="grid gap-2">
              <div className="flex justify-between items-center gap-4">
                <div className="flex justify-start items-center gap-4 w-full">
                  <Button
                    fullWidth
                    color="primary"
                    size="md"
                    startContent={<Icon icon="solar:eye-broken" />}
                    variant="flat"
                    onPress={() => handleShow(payload)}
                  >
                    Show Payload
                  </Button>
                  <Button
                    fullWidth
                    color="secondary"
                    isDisabled={
                      !executions.find(
                        (execution: any) => execution.payload_id === payload.id,
                      )
                    }
                    size="md"
                    startContent={<Icon icon="solar:eye-broken" />}
                    variant="flat"
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
                <div className="flex justify-end items-center gap-4">
                  <Button
                    fullWidth
                    isIconOnly
                    color="danger"
                    size="md"
                    variant="flat"
                    onPress={() => handleDelete(payload)}
                  >
                    <Icon
                      height="20"
                      icon="solar:trash-bin-minimalistic-broken"
                      width="20"
                    />
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <Pagination
          showControls
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
