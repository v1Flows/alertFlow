import type { UseDisclosureReturn } from "@nextui-org/use-disclosure";

import {
  Button,
  ButtonGroup,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  Spacer,
  Textarea,
  Tooltip,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import { cn } from "@/components/functions/cn/cn";
import UpdateFlowActions from "@/lib/fetch/flow/PUT/UpdateActions";

export const CustomRadio = (props: any) => {
  const { children, ...otherProps } = props;

  return (
    <Radio
      {...otherProps}
      classNames={{
        base: cn(
          "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between",
          "flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-4 p-4 border-2 border-default-200",
          "data-[selected=true]:border-primary",
        ),
      }}
    >
      {children}
    </Radio>
  );
};

export default function EditActionModal({
  disclosure,
  runners,
  flow,
  targetAction,
}: {
  disclosure: UseDisclosureReturn;
  runners: any;
  flow: any;
  targetAction: any;
}) {
  const { isOpen, onOpenChange } = disclosure;

  const [isLoading, setLoading] = useState(false);
  const [action, setAction] = useState({} as any);
  const [params, setParams] = useState([] as any);

  useEffect(() => {
    setAction(targetAction);
    searchActionOnRunners();
  }, [targetAction]);

  function searchActionOnRunners() {
    runners.map((runner: any) => {
      runner.actions.map((availableAction: any) => {
        if (availableAction.type === targetAction.type) {
          setParams(availableAction.params);
        }
      });
    });
  }

  function cancel() {
    onOpenChange();
  }

  function updateAction() {
    setLoading(true);
    flow.actions.map((flowAction: any) => {
      if (flowAction.id === action.id) {
        flowAction.active = action.active;
        flowAction.params = action.params;
        flowAction.custom_name = action.custom_name;
        flowAction.custom_description = action.custom_description;
      }
    });

    UpdateFlowActions(flow.id, flow.actions)
      .then(() => {
        toast.success("Flow action updated successfully.");
        onOpenChange();
      })
      .catch(() => {
        toast.error("Failed to update flow action.");
      });

    setLoading(false);
  }

  return (
    <main>
      <Modal
        isDismissable={false}
        isOpen={isOpen}
        placement="center"
        size="xl"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-wrap items-center">
                <div className="flex flex-col">
                  <p className="text-lg font-bold">Edit Action</p>
                  <p className="text-sm text-default-500">{action.id}</p>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="w-full flex flex-col gap-4">
                  {/* Status */}
                  <div className="flex flex-col">
                    <div className="flex flex-cols items-center gap-2">
                      <p className="text-lg text-default-500 font-bold">
                        Status
                      </p>
                      <Tooltip content="Defined Actions will either be executed one after the other or all in parallel. If in Sequential type one action fails, the others won't be processed anymore.">
                        <Icon
                          className="text-default-500"
                          icon="solar:info-circle-linear"
                          width={18}
                        />
                      </Tooltip>
                    </div>
                    <Spacer y={2} />
                    <div>
                      <ButtonGroup radius="sm" variant="flat">
                        <Button
                          className={`${action.active ? "bg-success" : ""}`}
                          onPress={() => {
                            setAction({ ...action, active: true });
                          }}
                        >
                          <Icon
                            className={`${action.active ? "" : "text-success"}`}
                            icon="solar:check-circle-linear"
                            width={18}
                          />
                          Enabled
                        </Button>
                        <Button
                          className={`${!action.active ? "bg-danger" : ""}`}
                          onPress={() => {
                            setAction({ ...action, active: false });
                          }}
                        >
                          <Icon
                            className={`${!action.active ? "" : "text-danger"}`}
                            icon="solar:close-circle-linear"
                            width={18}
                          />
                          Disabled
                        </Button>
                      </ButtonGroup>
                    </div>
                  </div>
                  <div>
                    <p className="text-lg text-default-500 font-bold">
                      Details
                    </p>
                    <Spacer y={2} />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        description="Custom name for this action (optional)"
                        label="Custom Name"
                        type="text"
                        value={action.custom_name}
                        onValueChange={(e) =>
                          setAction({ ...action, custom_name: e })
                        }
                      />
                      <Input
                        description="Custom description for this action (optional)"
                        label="Custom Description"
                        type="text"
                        value={action.custom_description}
                        onValueChange={(e) =>
                          setAction({ ...action, custom_description: e })
                        }
                      />
                    </div>
                    <p className="text-lg text-default-500 font-bold">
                      Parameters
                    </p>
                    <Spacer y={2} />
                    {params?.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {params.map((param: any) => {
                          return param.type === "text" ||
                            param.type === "number" ? (
                            <Input
                              key={param.key}
                              description={param.description}
                              isRequired={param.required}
                              label={param.key}
                              type={param.type}
                              value={
                                action.params.find(
                                  (x: any) => x.key === param.key,
                                )?.value || ""
                              }
                              onValueChange={(e) => {
                                setAction({
                                  ...action,
                                  params: action.params.map((x: any) => {
                                    if (x.key === param.key) {
                                      return { ...x, value: e };
                                    }

                                    return x;
                                  }),
                                });
                              }}
                            />
                          ) : param.type === "textarea" ? (
                            <Textarea
                              key={param.key}
                              description={param.description}
                              isRequired={param.required}
                              label={param.key}
                              type={param.type}
                              value={
                                action.params.find(
                                  (x: any) => x.key === param.key,
                                )?.value || ""
                              }
                              onValueChange={(e) => {
                                setAction({
                                  ...action,
                                  params: action.params.map((x: any) => {
                                    if (x.key === param.key) {
                                      return { ...x, value: e };
                                    }

                                    return x;
                                  }),
                                });
                              }}
                            />
                          ) : null;
                        })}
                      </div>
                    ) : (
                      <p>No parameters for this action found.</p>
                    )}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="ghost" onPress={cancel}>
                  Cancel
                </Button>
                <Button
                  color="warning"
                  isLoading={isLoading}
                  variant="flat"
                  onPress={updateAction}
                >
                  Update Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </main>
  );
}
