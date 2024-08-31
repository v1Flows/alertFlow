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
import React, { useEffect } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import DeleteActionModal from "@/components/functions/flows/deleteAction";
import EditActionModal from "@/components/functions/flows/editAction";
import AddActionModal from "@/components/functions/flows/addAction";
import UpdateFlowActions from "@/lib/fetch/flow/PUT/UpdateActions";
import EditFlowActionsDetails from "@/components/functions/flows/editDetails";

export default function Actions({
  flow,
  runners,
}: {
  flow: any;
  runners: any;
}) {
  const router = useRouter();
  const [actions, setActions] = React.useState([] as any);
  const [targetAction, setTargetAction] = React.useState({} as any);
  const editFlowActionsDetails = useDisclosure();
  const addFlowActionModal = useDisclosure();
  const editActionModal = useDisclosure();
  const deleteActionModal = useDisclosure();

  useEffect(() => {
    setActions(flow.actions);
  }, [flow]);

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

  const SortableItem = ({ action }: { action: any }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: action.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <Card key={action.type} fullWidth>
          <CardBody>
            <div className="flex flex-cols items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex bg-primary/10 text-primary items-center rounded-small justify-center w-10 h-10">
                  <Icon icon={getActionDetails(action.type)?.icon} width={26} />
                </div>
                <div>
                  <div className="flex flex-cols gap-2">
                    <p className="text-md font-bold">
                      {getActionDetails(action.type)?.name}
                    </p>
                    <Chip color="primary" radius="sm" size="sm" variant="dot">
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
                    {getActionDetails(action.type)?.description}
                  </p>
                </div>
              </div>
              <div className="flex flex-cols items-center gap-2">
                <Button
                  isIconOnly
                  color="warning"
                  variant="light"
                  onPress={() => {
                    setTargetAction(action);
                    editActionModal.onOpen();
                  }}
                >
                  <Icon icon="solar:pen-new-square-broken" width={20} />
                </Button>
                <Button
                  isIconOnly
                  color="danger"
                  variant="light"
                  onPress={() => {
                    setTargetAction(action.id);
                    deleteActionModal.onOpen();
                  }}
                >
                  <Icon icon="solar:trash-bin-2-broken" width={20} />
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      console.log(1);
      const items = [...actions];
      const oldIndex = items.findIndex((item: any) => item.id === active.id);
      const newIndex = items.findIndex((item: any) => item.id === over.id);

      const newArray = arrayMove(items, oldIndex, newIndex);

      updateFlowActions(newArray);
      setActions(newArray);

      // setActions((items: any) => {
      //   updateFlowActions(newArray);

      //   return newArray;
      // });
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
              <Button
                isIconOnly
                color="warning"
                variant="light"
                onPress={editFlowActionsDetails.onOpen}
              >
                <Icon icon="solar:pen-new-square-broken" width={18} />
              </Button>
            </div>
            <Divider className="my-4" />
            <div className="grid grid-cols-2 gap-4">
              <p>Execution Order</p>
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
      <div className="flex flex-col gap-2 col-span-2">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={actions}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-2">
              <div className="flex flex-cols items-center gap-2">
                <Icon
                  className="text-default-500"
                  icon="solar:info-circle-linear"
                  width={18}
                />
                <p className="text-sm text-default-500">You can reorder actions by dragging them</p>
              </div>
              {actions.map((action: any) => (
                <SortableItem key={action.id} action={action} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        <Card
          fullWidth
          isHoverable
          isPressable
          className="border border-dashed border-default-200 hover:border-primary bg-opacity-60"
          isDisabled={flow.disabled}
          onPress={addFlowActionModal.onOpen}
        >
          <CardBody>
            <div className="flex flex-cols items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex bg-primary/10 text-primary items-center rounded-small justify-center w-10 h-10">
                  <Icon icon="solar:add-square-broken" width={26} />
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
