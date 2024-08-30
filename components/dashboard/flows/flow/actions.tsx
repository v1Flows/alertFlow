import { Icon } from "@iconify/react";
import {
  Button,
  Card,
  CardBody,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import React from "react";

import DeleteActionModal from "@/components/functions/flows/deleteAction";
import EditActionModal from "@/components/functions/flows/editAction";
import AddActionModal from "@/components/functions/flows/addAction";

export default function Actions({
  flow,
  runners,
}: {
  flow: any;
  runners: any;
}) {
  const [targetAction, setTargetAction] = React.useState(null);
  const addFlowActionModal = useDisclosure();
  const editActionModal = useDisclosure();
  const deleteActionModal = useDisclosure();

  function getActionDetails(type: string) {
    var action = {} as any;

    const runner = runners.find((runner: any) =>
      runner.available_actions.some((action: any) => action.type === type),
    );

    if (runner) {
      action = runner.available_actions.find(
        (action: any) => action.type === type,
      );
    }

    return action || null;
  }

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="col-span-1">
        <Card>
          <CardBody>
            <div className="flex flex-cols items-start justify-between">
              <div className="flex flex-col">
                <p className="text-md font-bold">Details</p>
                <p className="text-sm text-default-500">
                  Details which apply to all defined Actions
                </p>
              </div>
              <Button isIconOnly color="warning" variant="light">
                <Icon icon="solar:pen-new-square-broken" width={18} />
              </Button>
            </div>
            <Divider className="my-4" />
            <div className="grid grid-cols-2 gap-4">
              <p>Execute Actions Parallel</p>
              <Chip
                color={flow.exec_parallel ? "secondary" : "primary"}
                radius="sm"
                size="sm"
                variant="flat"
              >
                <p className="font-bold">
                  {flow.exec_parallel ? "Parallel" : "Sequential"}
                </p>
              </Chip>
              <p>Patterns</p>
              <Table
                removeWrapper
                aria-label="Match Action Patterns"
                className="w-full"
              >
                <TableHeader>
                  <TableColumn align="center">Key</TableColumn>
                  <TableColumn align="center">Type</TableColumn>
                  <TableColumn align="center">Value</TableColumn>
                </TableHeader>
                <TableBody emptyContent={"No patterns defined."}>
                  {flow.patterns.map((pattern: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{pattern.key}</TableCell>
                      <TableCell>{pattern.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardBody>
        </Card>
      </div>
      <div className="flex flex-col gap-2 col-span-2">
        {flow.actions.map((action: any, index: number) => (
          <Card key={action.type} fullWidth>
            <CardBody>
              <div className="flex flex-cols items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex bg-primary/10 text-primary items-center rounded-small justify-center w-10 h-10">
                    <Icon
                      icon={getActionDetails(action.type)?.icon}
                      width={26}
                    />
                  </div>
                  <div>
                    <div className="flex flex-cols gap-2">
                      <p className="text-md font-bold">
                        {getActionDetails(action.type)?.name}
                      </p>
                      <Chip color="primary" radius="sm" size="sm" variant="dot">
                        {action.id}
                      </Chip>
                    </div>
                    <p className="text-sm text-default-500">
                      {getActionDetails(action.type)?.description}
                    </p>
                  </div>
                </div>
                <div>
                  <Icon
                    className="hover:cursor-grab"
                    icon="nimbus:drag-dots"
                    width={24}
                  />
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
        <Card
          fullWidth
          isHoverable
          isPressable
          className="border border-primary/50 border-3 border-dashed bg-opacity-50"
          isDisabled={flow.disabled}
          onPress={addFlowActionModal.onOpen}
        >
          <CardBody className="flex flex-col items-center justify-center gap-2">
            <div className="flex items-center rounded-large justify-center bg-primary bg-opacity-25 w-12 h-12">
              <Icon
                className="text-primary"
                icon="solar:add-square-broken"
                width={38}
              />
            </div>
            <p className="text-lg font-bold text-default-500">Add Action</p>
          </CardBody>
        </Card>
      </div>
      <AddActionModal
        disclosure={addFlowActionModal}
        flow={flow}
        runners={runners}
      />
      <EditActionModal
        action={targetAction}
        disclosure={editActionModal}
        flowID={flow.id}
        runners={runners}
      />
      <DeleteActionModal
        actionID={targetAction}
        disclosure={deleteActionModal}
        flowID={flow.id}
      />
    </div>
  );
}
