import { Icon } from "@iconify/react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Spacer,
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

export default function Actions({
  actions,
  flow,
  runners,
}: {
  actions: any;
  flow: any;
  runners: any;
}) {
  const [targetAction, setTargetAction] = React.useState(null);
  const editActionModal = useDisclosure();
  const deleteActionModal = useDisclosure();

  return (
    <div className="grid grid-cols-2 gap-4">
      {actions.map((action: any, index: number) => (
        <Card key={index}>
          <CardHeader className="flex justify-between gap-4">
            <div className="flex flex-cols items-center gap-4">
              <div className="flex flex-col items-start">
                <p className="text-lg font-bold">{action.name}</p>
                <p className="text-sm text-default-500">{action.description}</p>
              </div>
              <Chip
                color={action.status ? "success" : "danger"}
                radius="sm"
                size="sm"
                variant="flat"
              >
                <p className="font-bold">
                  Status: {action.status ? "Active" : "Disabled"}
                </p>
              </Chip>
            </div>
            <div>
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly variant="light">
                    <Icon icon="solar:menu-dots-broken" width={24} />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions" variant="flat">
                  <DropdownItem
                    key="edit"
                    showDivider
                    color="warning"
                    startContent={
                      <Icon icon="solar:pen-new-square-broken" width={18} />
                    }
                    onPress={() => {
                      setTargetAction(action);
                      editActionModal.onOpen();
                    }}
                  >
                    Edit
                  </DropdownItem>
                  <DropdownItem
                    key="delete"
                    className="text-danger"
                    color="danger"
                    startContent={
                      <Icon icon="solar:trash-bin-2-broken" width={18} />
                    }
                    onPress={() => {
                      setTargetAction(action.id);
                      deleteActionModal.onOpen();
                    }}
                  >
                    Delete
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </CardHeader>
          <CardBody>
            <div className="flex flex-wrap items-center justify-between gap-8">
              {/* Action Execution Order */}
              <div className="flex items-center gap-2">
                <div className="flex bg-primary/10 text-primary items-center rounded-small justify-center w-10 h-10">
                  <Icon
                    icon={
                      action.exec_parallel
                        ? "solar:align-horizontal-center-outline"
                        : "solar:align-vertical-center-linear"
                    }
                    width={26}
                  />
                </div>
                <div>
                  <p className="text-md font-bold">
                    {action.exec_parallel ? "Parallel" : "Sequential"}
                  </p>
                  <p className="text-sm text-default-500">Execution Order</p>
                </div>
              </div>

              {/* Action Actions Amount */}
              <div className="flex items-center gap-2">
                <div className="flex bg-primary/10 text-primary items-center rounded-small justify-center w-10 h-10">
                  <Icon icon="solar:bolt-bold-duotone" width={26} />
                </div>
                <div>
                  <p className="text-md font-bold">{action.actions.length}</p>
                  <p className="text-sm text-default-500">Actions</p>
                </div>
              </div>

              {/* Action Pattern Match Amount */}
              <div className="flex items-center gap-2">
                <div className="flex bg-primary/10 text-primary items-center rounded-small justify-center w-10 h-10">
                  <Icon icon="solar:clipboard-check-broken" width={26} />
                </div>
                <div>
                  <p className="text-md font-bold">
                    {
                      action.match_patterns.filter(
                        (pattern: any) => pattern.key,
                      ).length
                    }
                  </p>
                  <p className="text-sm text-default-500">Match Patterns</p>
                </div>
              </div>

              {/* Action Pattern Exclude Amount */}
              <div className="flex items-center gap-2">
                <div className="flex bg-primary/10 text-primary items-center rounded-small justify-center w-10 h-10">
                  <Icon icon="solar:clipboard-remove-broken" width={26} />
                </div>
                <div>
                  <p className="text-md font-bold">
                    {
                      action.exclude_patterns.filter(
                        (pattern: any) => pattern.key,
                      ).length
                    }
                  </p>
                  <p className="text-sm text-default-500">Exclude Patterns</p>
                </div>
              </div>
            </div>
            <Divider className="my-4" />
            {/* Action Actions */}
            <p className="text-lg font-bold text-default-500 mb-2">Actions</p>
            <div className="flex flex-col gap-2">
              {action.actions.map((action: any, index: number) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex bg-primary/10 text-primary items-center rounded-small justify-center w-10 h-10">
                    <Icon
                      icon="solar:map-arrow-right-bold-duotone"
                      width={26}
                    />
                  </div>
                  <div>
                    <p className="text-md font-bold">{action}</p>
                    <p className="text-sm text-default-500">Action</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Match Patterns */}
            <Spacer y={4} />
            <p className="text-lg font-bold text-success-500 mb-2">
              Match Patterns
            </p>
            {action.match_patterns.filter((pattern: any) => pattern.key)
              .length === 0 ? (
              <p>Actions will be triggered for all events.</p>
            ) : (
              <Table
                removeWrapper
                aria-label="Match Action Patterns"
                className="w-full"
              >
                <TableHeader>
                  <TableColumn>Key</TableColumn>
                  <TableColumn>Value</TableColumn>
                </TableHeader>
                <TableBody>
                  {action.match_patterns.map((pattern: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{pattern.key}</TableCell>
                      <TableCell>{pattern.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {/* Action Exclude Patterns */}
            <Spacer y={2} />
            <p className="text-lg font-bold text-danger-500 mb-2">
              Exclude Patterns
            </p>
            {action.exclude_patterns.filter((pattern: any) => pattern.key)
              .length === 0 ? (
              <p>Actions will be triggered for all events.</p>
            ) : (
              <Table
                removeWrapper
                aria-label="Exclude Action Patterns"
                className="w-full"
              >
                <TableHeader>
                  <TableColumn>Key</TableColumn>
                  <TableColumn>Value</TableColumn>
                </TableHeader>
                <TableBody>
                  {action.exclude_patterns.map(
                    (pattern: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{pattern.key}</TableCell>
                        <TableCell>{pattern.value}</TableCell>
                      </TableRow>
                    ),
                  )}
                </TableBody>
              </Table>
            )}
          </CardBody>
        </Card>
      ))}
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
