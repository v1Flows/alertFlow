import { closestCenter, DndContext } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Icon } from "@iconify/react";
import {
  Accordion,
  AccordionItem,
  Button,
  Card,
  CardBody,
  Chip,
  Divider,
  Spacer,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import React, { useEffect } from "react";
import { toast } from "sonner";

import UpdateFlowActions from "@/lib/fetch/flow/PUT/UpdateActions";
import EditFlowActionsDetails from "@/components/functions/flows/editDetails";
import EditActionModal from "@/components/functions/flows/editAction";
import DeleteActionModal from "@/components/functions/flows/deleteAction";
import AddActionModal from "@/components/functions/flows/addAction";

export default function Actions({
  flow,
  runners,
  user,
  canEdit,
}: {
  flow: any;
  runners: any;
  user: any;
  canEdit: boolean;
}) {
  const [actions, setActions] = React.useState([] as any);
  const [targetAction, setTargetAction] = React.useState({} as any);
  const editFlowActionsDetails = useDisclosure();
  const addFlowActionModal = useDisclosure();
  const editActionModal = useDisclosure();
  const deleteActionModal = useDisclosure();

  const [expandedParams, setExpandedParams] = React.useState([] as any);
  const [isDragEnabled, setIsDragEnabled] = React.useState(false);

  useEffect(() => {
    setActions(flow.actions);
  }, [flow]);

  const SortableItem = ({ action }: { action: any }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: action.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div ref={setNodeRef} style={style} {...attributes}>
        <Card key={action.type} fullWidth>
          <CardBody>
            <div className="flex items-center justify-between gap-4">
              <div className="w-full">
                <div className="flex-cols flex items-center justify-between gap-2">
                  <Tooltip
                    content={
                      <div>
                        <p className="text-md font-bold">{action.name}</p>
                        <p className="text-sm text-default-500">
                          {action.description}
                        </p>
                      </div>
                    }
                    placement="top"
                    size="lg"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex size-10 items-center justify-center rounded-small bg-primary/10 text-primary">
                        <Icon icon={action.icon} width={26} />
                      </div>
                      <div>
                        <div className="flex-cols flex gap-2">
                          <p className="text-md font-bold">
                            {action.custom_name
                              ? action.custom_name
                              : action.name}
                          </p>
                          <Chip
                            className="max-lg:hidden"
                            color="default"
                            radius="sm"
                            size="sm"
                            variant="flat"
                          >
                            {action.id}
                          </Chip>
                          <Chip
                            color={action.active ? "success" : "danger"}
                            radius="sm"
                            size="sm"
                            variant="flat"
                          >
                            {action.active ? "Active" : "Inactive"}
                          </Chip>
                        </div>
                        <p className="text-sm text-default-500">
                          {action.custom_description
                            ? action.custom_description
                            : action.description}
                        </p>
                      </div>
                    </div>
                  </Tooltip>
                  <div className="flex-cols flex items-center gap-2">
                    <Button
                      isIconOnly
                      color="warning"
                      isDisabled={!canEdit}
                      variant="light"
                      onPress={() => {
                        setTargetAction(action);
                        editActionModal.onOpen();
                      }}
                    >
                      <Icon icon="solar:pen-new-square-outline" width={20} />
                    </Button>
                    <Button
                      isIconOnly
                      color="danger"
                      isDisabled={!canEdit}
                      variant="light"
                      onPress={() => {
                        setTargetAction(action.id);
                        deleteActionModal.onOpen();
                      }}
                    >
                      <Icon icon="solar:trash-bin-trash-outline" width={20} />
                    </Button>
                  </div>
                </div>
                <Spacer y={2} />
                <Chip
                  className="lg:hidden"
                  color="default"
                  radius="sm"
                  size="sm"
                  variant="flat"
                >
                  {action.id}
                </Chip>
                {action.params.length > 0 && (
                  <>
                    <Accordion
                      isCompact
                      selectedKeys={expandedParams}
                      selectionMode="multiple"
                      variant="light"
                      onSelectionChange={setExpandedParams}
                    >
                      <AccordionItem
                        key={action.id}
                        aria-label="Parameters"
                        subtitle="View action parameters (click to expand)"
                        title="Parameters"
                      >
                        <Table
                          removeWrapper
                          aria-label="Parameters"
                          className="w-full"
                        >
                          <TableHeader>
                            <TableColumn align="center">Key</TableColumn>
                            <TableColumn align="center">Value</TableColumn>
                          </TableHeader>
                          <TableBody emptyContent="No patterns defined.">
                            {action.params.map((param: any, index: number) => (
                              <TableRow key={index}>
                                <TableCell>{param.key}</TableCell>
                                <TableCell>{param.value}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </AccordionItem>
                    </Accordion>
                  </>
                )}
              </div>
              {isDragEnabled && (
                <div
                  {...listeners}
                  style={{ cursor: "grab", touchAction: "none" }}
                >
                  <Icon icon="mi:drag" width={20} />
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    );
  };

  const handleDragEnd = (event: any) => {
    if (!isDragEnabled) {
      return;
    }

    const { active, over } = event;

    if (active.id !== over.id) {
      const items = [...actions];
      const oldIndex = items.findIndex((item: any) => item.id === active.id);
      const newIndex = items.findIndex((item: any) => item.id === over.id);

      const newArray = arrayMove(items, oldIndex, newIndex);

      updateFlowActions(newArray);
      setActions(newArray);
    }
  };

  function updateFlowActions(items: any) {
    UpdateFlowActions(flow.id, items)
      .then(() => {
        toast.success("Flow actions order updated successfully.");
      })
      .catch(() => {
        toast.error("Failed to update flow actions order.");
      });
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="col-span-1">
        <Card fullWidth>
          <CardBody>
            <div className="flex-cols flex items-start justify-between">
              <div className="flex flex-col">
                <p className="text-md font-bold">Details</p>
                <p className="text-sm text-default-500">
                  Details which apply to all defined Actions
                </p>
              </div>
              <Button
                isIconOnly
                color="warning"
                isDisabled={!canEdit}
                variant="light"
                onPress={editFlowActionsDetails.onOpen}
              >
                <Icon icon="solar:pen-new-square-outline" width={18} />
              </Button>
            </div>
            <Divider className="my-4" />
            <div className="grid gap-4 xl:grid-cols-2">
              <p className="font-medium">Reorder Actions</p>
              <Switch
                isDisabled={!canEdit}
                isSelected={isDragEnabled}
                size="sm"
                onValueChange={setIsDragEnabled}
              />
              <p className="font-medium">Action Parameters</p>
              <Chip
                color={flow.encrypt_action_params ? "success" : "warning"}
                radius="sm"
                size="sm"
                variant="flat"
              >
                <p className="font-bold">
                  {flow.encrypt_action_params ? "Enrypted" : "Unencrypted"}
                </p>
              </Chip>
              <p className="font-medium">Execution Order</p>
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
              <p className="font-medium">Patterns</p>
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
                <TableBody emptyContent="No patterns defined.">
                  {flow.patterns.map((pattern: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{pattern.key}</TableCell>
                      <TableCell>{pattern.type}</TableCell>
                      <TableCell>{pattern.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardBody>
        </Card>
      </div>
      <div className="col-span-2 flex flex-col gap-2">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={actions}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-2">
              {actions.map((action: any) => (
                <SortableItem key={action.id} action={action} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        <Card
          fullWidth
          className="border border-dashed border-default-200 bg-opacity-60 hover:border-primary"
          isDisabled={!canEdit}
          isPressable={canEdit}
          onPress={addFlowActionModal.onOpen}
        >
          <CardBody>
            <div className="flex-cols flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex size-10 items-center justify-center rounded-small bg-primary/10 text-primary">
                  <Icon icon="solar:add-square-outline" width={26} />
                </div>
                <div>
                  <p className="text-md font-bold">Add Action</p>
                  <p className="text-sm text-default-500">
                    Add a new action to the flow
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      <EditFlowActionsDetails disclosure={editFlowActionsDetails} flow={flow} />
      <AddActionModal
        disclosure={addFlowActionModal}
        flow={flow}
        runners={runners}
        user={user}
      />
      <EditActionModal
        disclosure={editActionModal}
        flow={flow}
        runners={runners}
        targetAction={targetAction}
      />
      <DeleteActionModal
        actionID={targetAction}
        disclosure={deleteActionModal}
        flowID={flow.id}
      />
    </div>
  );
}
