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
  Select,
  SelectItem,
  Spacer,
  Tooltip,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import { cn } from "@/components/functions/cn/cn";
import { PlusIcon } from "@/components/icons";
import UpdateFlowActionsDetails from "@/lib/fetch/flow/PUT/UpdateActionsDetails";

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

export default function EditFlowActionsDetails({
  disclosure,
  flow,
}: {
  disclosure: UseDisclosureReturn;
  flow: any;
}) {
  const router = useRouter();
  const { isOpen, onOpenChange } = disclosure;

  const [isLoading, setLoading] = useState(false);
  const [execParallel, setExecParallel] = useState(true);
  const [patterns, setPatterns] = useState([] as any);

  useEffect(() => {
    setExecParallel(flow.exec_parallel);
    setPatterns(flow.patterns);
  }, [isOpen]);

  function cancel() {
    onOpenChange();
  }

  function updateDetails() {
    setLoading(true);
    UpdateFlowActionsDetails(flow.id, execParallel, patterns)
      .then(() => {
        toast.success("Flow actions details updated successfully.");
        router.refresh();
        onOpenChange();
      })
      .catch(() => {
        toast.error("Failed to update flow actions details.");
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
                <div className="flex flex-col gap-2">
                  <p className="text-lg font-bold">Edit Actions Details</p>
                  <p className="text-sm text-default-500">
                    Actions Details determine how the action will be executed
                    and for which patterns it should check the payload for.
                  </p>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="w-full flex flex-col gap-4">
                  {/* Status */}
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-cols items-center gap-2">
                      <p className="font-bold">Execution Order</p>
                      <Tooltip content="Defined Actions will either be executed one after the other or all in parallel. If in Sequential type one action fails, the others won't be processed anymore.">
                        <Icon
                          className="text-default-500"
                          icon="solar:info-circle-linear"
                          width={18}
                        />
                      </Tooltip>
                    </div>
                    <div>
                      <ButtonGroup radius="sm" variant="flat">
                        <Button
                          className={`${execParallel ? "bg-primary" : ""}`}
                          onPress={() => {
                            setExecParallel(true);
                          }}
                        >
                          <Icon
                            icon="solar:align-horizontal-center-outline"
                            width={22}
                          />
                          Parallel
                        </Button>
                        <Button
                          className={`${!execParallel ? "bg-primary" : ""}`}
                          onPress={() => {
                            setExecParallel(false);
                          }}
                        >
                          <Icon
                            icon="solar:align-vertical-center-linear"
                            width={22}
                          />
                          Sequential
                        </Button>
                      </ButtonGroup>
                    </div>
                  </div>
                  <div>
                    <p className="font-bold">Patterns</p>
                    <Spacer y={2} />
                    <div>
                      <div className="flex flex-col gap-4">
                        {patterns.length > 0 ? (
                          <>
                            {patterns.map((pattern: any, index: number) => (
                              <div key={index}>
                                <div className="flex flex-cols items-center gap-4">
                                  <Input
                                    label="Key"
                                    radius="sm"
                                    size="sm"
                                    value={pattern.key}
                                    onValueChange={(value) => {
                                      setPatterns([
                                        ...patterns.slice(0, index),
                                        {
                                          ...pattern,
                                          key: value,
                                        },
                                        ...patterns.slice(index + 1),
                                      ]);
                                    }}
                                  />
                                  <Select
                                    disallowEmptySelection
                                    className="max-w-xs"
                                    defaultSelectedKeys={[pattern.type]}
                                    label="Type"
                                    radius="sm"
                                    size="sm"
                                    variant="flat"
                                    onSelectionChange={(key: any) => {
                                      setPatterns([
                                        ...patterns.slice(0, index),
                                        {
                                          ...pattern,
                                          type: key.currentKey,
                                        },
                                        ...patterns.slice(index + 1),
                                      ]);
                                    }}
                                  >
                                    <SelectItem key="equals">equals</SelectItem>
                                    <SelectItem key="not_equals">
                                      not equals
                                    </SelectItem>
                                  </Select>
                                  <Input
                                    label="Value"
                                    radius="sm"
                                    size="sm"
                                    value={pattern.value}
                                    onValueChange={(value) => {
                                      setPatterns([
                                        ...patterns.slice(0, index),
                                        {
                                          ...pattern,
                                          value: value,
                                        },
                                        ...patterns.slice(index + 1),
                                      ]);
                                    }}
                                  />
                                  <Button
                                    isIconOnly
                                    color="danger"
                                    size="sm"
                                    variant="light"
                                    onPress={() => {
                                      setPatterns([
                                        ...patterns.slice(0, index),
                                        ...patterns.slice(index + 1),
                                      ]);
                                    }}
                                  >
                                    <Icon
                                      icon="solar:trash-bin-trash-broken"
                                      width={20}
                                    />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </>
                        ) : (
                          <p className="text-default-500">
                            No patterns defined yet.
                          </p>
                        )}
                      </div>
                      <div className="mt-4">
                        <Button
                          fullWidth
                          color="primary"
                          startContent={<PlusIcon />}
                          variant="flat"
                          onPress={() => {
                            setPatterns([
                              ...patterns,
                              {
                                key: "",
                                type: "equals",
                                value: "",
                              },
                            ]);
                          }}
                        >
                          Add Pattern
                        </Button>
                      </div>
                    </div>
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
                  onPress={updateDetails}
                >
                  Update Details
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </main>
  );
}
