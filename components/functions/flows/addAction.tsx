import type { UseDisclosureReturn } from "@nextui-org/use-disclosure";

import {
  Button,
  Card,
  CardBody,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  Spacer,
  TableColumn,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  Table,
  Tooltip,
  ButtonGroup,
  CheckboxGroup,
  Divider,
} from "@nextui-org/react";
import React from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";

import { cn } from "@/components/functions/cn/cn";
import { PlusIcon } from "@/components/icons";
import CreateFlowAction from "@/lib/fetch/flow/POST/CreateFlowAction";
import { CustomCheckbox } from "@/components/ui/CustomCheckbox";

import MinimalRowSteps from "../steps/minimal-row-steps";

export const CustomRadio = (props: any) => {
  const { children, ...otherProps } = props;

  return (
    <Radio
      {...otherProps}
      classNames={{
        base: cn(
          "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between",
          "flex-row-reverse max-w-[500px] cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent",
          "data-[selected=true]:border-primary",
        ),
      }}
    >
      {children}
    </Radio>
  );
};

export default function AddFlowActionModal({
  disclosure,
  runners,
  flowID,
}: {
  disclosure: UseDisclosureReturn;
  runners: any;
  flowID: string;
}) {
  const router = useRouter();

  const { isOpen, onOpenChange } = disclosure;

  const [steps] = React.useState(6);
  const [currentStep, setCurrentStep] = React.useState(0);
  const [isLoading, setLoading] = React.useState(false);

  const [disableNext, setDisableNext] = React.useState(false);

  // logic input
  const [enableMatchPatterns, setEnableMatchPatterns] = React.useState(false);
  const [enableExcludePatterns, setEnableExcludePatterns] =
    React.useState(false);

  // inputs
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [execParallel, setExecParallel] = React.useState(true);
  const [status, setStatus] = React.useState(true);
  const [actions, setActions] = React.useState([] as any);
  const [matchPatterns, setMatchPatterns] = React.useState([
    {
      key: "",
      value: "",
    },
  ]);
  const [excludePatterns, setExcludePatterns] = React.useState([
    {
      key: "",
      value: "",
    },
  ]);

  function countTotalAvailableActions() {
    var actions = 0;

    for (let i = 0; i < runners.length; i++) {
      var timeAgo =
        (new Date(runners[i].last_heartbeat).getTime() - Date.now()) / 1000;

      if (runners[i].disabled || !runners[i].registered || timeAgo <= -30) {
        continue;
      }

      if (runners[i].available_actions.length > 0) {
        actions++;
      }
    }

    if (actions === 0) {
      setDisableNext(true);
    } else {
      setDisableNext(false);
    }

    return actions;
  }

  function getUniqueActions() {
    var actions = [] as any;

    for (let i = 0; i < runners.length; i++) {
      for (let j = 0; j < runners[i].available_actions.length; j++) {
        var timeAgo =
          (new Date(runners[i].last_heartbeat).getTime() - Date.now()) / 1000;

        if (runners[i].disabled || !runners[i].registered || timeAgo <= -30) {
          continue;
        }

        if (!actions.includes(runners[i].available_actions[j])) {
          actions.push(runners[i].available_actions[j]);
        }
      }
    }

    return actions;
  }

  function cancel() {
    setName("");
    setDescription("");
    setStatus(true);
    setActions([] as any);
    setMatchPatterns([
      {
        key: "",
        value: "",
      },
    ]);
    setExcludePatterns([
      {
        key: "",
        value: "",
      },
    ]);
    setCurrentStep(0);
    onOpenChange();
  }

  async function createAction() {
    setLoading(true);

    const sendAction = {
      name: name,
      description: description,
      flow_id: flowID,
      status: status,
      actions: actions,
      exec_parallel: execParallel,
      match_patterns: matchPatterns,
      exclude_patterns: excludePatterns,
    };

    const res = await CreateFlowAction(flowID, sendAction);

    if (!res.error) {
      setLoading(false);
      setName("");
      setDescription("");
      setStatus(true);
      setActions([] as any);
      setMatchPatterns([
        {
          key: "",
          value: "",
        },
      ]);
      setExcludePatterns([
        {
          key: "",
          value: "",
        },
      ]);
      setCurrentStep(0);
      onOpenChange();
      router.refresh();
      toast.success("Action created successfully");
    } else {
      setLoading(false);
      router.refresh();
      toast.error(res.error);
    }

    setLoading(false);
  }

  return (
    <main>
      <Modal
        isDismissable={false}
        isOpen={isOpen}
        placement="center"
        size="3xl"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-wrap items-center">
                <div className="flex flex-col gap-2">
                  <p className="text-lg font-bold">Create new Action</p>
                  <p className="text-sm text-default-500">
                    Actions are the building blocks of your flows. They are the
                    steps that are executed when a flow is triggered.
                  </p>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="flex items-center justify-center">
                  <MinimalRowSteps
                    className="w-fit overflow-hidden"
                    currentStep={currentStep}
                    label={`Step ${currentStep + 1} of ${steps}`}
                    stepsCount={steps}
                    onStepChange={setCurrentStep}
                  />
                </div>
                <div className="w-full flex flex-cols gap-4">
                  <div className="w-full col-span-1">
                    {currentStep === 0 && (
                      <div className="flex flex-col gap-4">
                        <Input
                          label="Name"
                          labelPlacement="outside"
                          placeholder="My Action Name"
                          radius="sm"
                          size="md"
                          type="email"
                          value={name}
                          onValueChange={setName}
                        />
                        <Input
                          label="Description"
                          labelPlacement="outside"
                          placeholder="My Action Description"
                          radius="sm"
                          size="md"
                          type="email"
                          value={description}
                          onValueChange={setDescription}
                        />
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-cols items-center gap-2">
                              <p className="text-sm">Execution Order</p>
                              <Tooltip content="Defined Actions will either be executed one after the other or all in parallel. If in Sequential order one action fails, the others won't be processed anymore.">
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

                          <div className="flex flex-col gap-2">
                            <div className="flex flex-cols items-center gap-2">
                              <p className="text-sm">Status</p>
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
                                  className={`${status ? "bg-success" : ""}`}
                                  onPress={() => {
                                    setStatus(true);
                                  }}
                                >
                                  <Icon
                                    className={`${status ? "" : "text-success"}`}
                                    icon="solar:check-circle-linear"
                                    width={18}
                                  />
                                  Enabled
                                </Button>
                                <Button
                                  className={`${!status ? "bg-danger" : ""}`}
                                  onPress={() => {
                                    setStatus(false);
                                  }}
                                >
                                  <Icon
                                    className={`${!status ? "" : "text-danger"}`}
                                    icon="solar:close-circle-linear"
                                    width={18}
                                  />
                                  Disabled
                                </Button>
                              </ButtonGroup>
                            </div>
                          </div>
                        </div>

                        {/* Patterns */}
                        <div className="flex flex-col gap-2">
                          <p className="text-lg font-bold text-default-500">
                            Patterns
                          </p>
                          <div className="flex flex-wrap gap-4 justify-between items-center">
                            <div className="flex flex-col gap-2">
                              <div className="flex flex-cols items-center gap-2">
                                <p className="text-sm">Match</p>
                                <Tooltip content="With Match Patterns you can controll which key-value pair has to be pressent in the incoming payload in order to execute your flow.">
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
                                    className={`${enableMatchPatterns ? "bg-primary" : ""}`}
                                    onPress={() => {
                                      setEnableMatchPatterns(true);
                                    }}
                                  >
                                    <Icon
                                      className="text-success"
                                      icon="solar:check-circle-linear"
                                      width={18}
                                    />
                                    Enabled
                                  </Button>
                                  <Button
                                    className={`${!enableMatchPatterns ? "bg-primary" : ""}`}
                                    onPress={() => {
                                      setEnableMatchPatterns(false);
                                    }}
                                  >
                                    <Icon
                                      className="text-danger"
                                      icon="solar:close-circle-linear"
                                      width={18}
                                    />
                                    Disabled
                                  </Button>
                                </ButtonGroup>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <div className="flex flex-cols items-center gap-2">
                                <p className="text-sm">Exclude</p>
                                <Tooltip content="With Exclude Patterns you can controll which key-value pair has to be pressent in the incoming payload in order to NOT execute your flow.">
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
                                    className={`${enableExcludePatterns ? "bg-primary" : ""}`}
                                    onPress={() => {
                                      setEnableExcludePatterns(true);
                                    }}
                                  >
                                    <Icon
                                      className="text-success"
                                      icon="solar:check-circle-linear"
                                      width={18}
                                    />
                                    Enabled
                                  </Button>
                                  <Button
                                    className={`${!enableExcludePatterns ? "bg-primary" : ""}`}
                                    onPress={() => {
                                      setEnableExcludePatterns(false);
                                    }}
                                  >
                                    <Icon
                                      className="text-danger"
                                      icon="solar:close-circle-linear"
                                      width={18}
                                    />
                                    Disabled
                                  </Button>
                                </ButtonGroup>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {currentStep === 1 && (
                      <div>
                        {countTotalAvailableActions() === 0 ? (
                          <div>
                            <Card className="border border-danger">
                              <CardBody>
                                <p className="text-danger font-bold">
                                  😕 Seems like there are no Actions available.
                                </p>
                                <p className="text-default-500">
                                  Please check if you have a dedicated runner
                                  assign to your flow and if that runner exposes
                                  any actions
                                </p>
                              </CardBody>
                            </Card>
                          </div>
                        ) : (
                          <>
                            <p className="text-lg text-default-500 font-bold">
                              Available Actions
                            </p>
                            <Spacer y={2} />
                            <CheckboxGroup
                              orientation="horizontal"
                              value={actions}
                              onChange={setActions}
                            >
                              {getUniqueActions().map((action: any) => (
                                <CustomCheckbox
                                  key={action.name}
                                  action={action}
                                />
                              ))}
                            </CheckboxGroup>
                          </>
                        )}
                      </div>
                    )}
                    {currentStep === 2 && (
                      <div>
                        <p className="text-lg text-default-500 font-bold">
                          Required Parameters
                        </p>
                      </div>
                    )}
                    {currentStep === 3 && (
                      <div>
                        <p className="text-lg text-default-500 font-bold">
                          Match Patterns
                        </p>
                        <Spacer y={2} />
                        {enableMatchPatterns ? (
                          <div>
                            <div className="flex flex-col gap-4">
                              {matchPatterns.map(
                                (pattern: any, index: number) => (
                                  <div key={index}>
                                    <div className="flex flex-cols items-center justify-between">
                                      <p>Pattern {index + 1}</p>
                                      <Button
                                        isIconOnly
                                        color="danger"
                                        variant="light"
                                        onPress={() => {
                                          setMatchPatterns([
                                            ...matchPatterns.slice(0, index),
                                            ...matchPatterns.slice(index + 1),
                                          ]);
                                        }}
                                      >
                                        <Icon
                                          icon="solar:trash-bin-trash-broken"
                                          width={20}
                                        />
                                      </Button>
                                    </div>
                                    <Divider />
                                    <Spacer y={2} />
                                    <div className="grid grid-cols-2 gap-4">
                                      <Input
                                        label="Key"
                                        radius="sm"
                                        size="sm"
                                        value={pattern.key}
                                        onValueChange={(value) => {
                                          setMatchPatterns([
                                            ...matchPatterns.slice(0, index),
                                            {
                                              ...pattern,
                                              key: value,
                                            },
                                            ...matchPatterns.slice(index + 1),
                                          ]);
                                        }}
                                      />
                                      <Input
                                        label="Value"
                                        radius="sm"
                                        size="sm"
                                        value={pattern.value}
                                        onValueChange={(value) => {
                                          setMatchPatterns([
                                            ...matchPatterns.slice(0, index),
                                            {
                                              ...pattern,
                                              value: value,
                                            },
                                            ...matchPatterns.slice(index + 1),
                                          ]);
                                        }}
                                      />
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                            <div className="mt-4">
                              <Button
                                fullWidth
                                color="primary"
                                startContent={<PlusIcon />}
                                variant="flat"
                                onPress={() => {
                                  setMatchPatterns([
                                    ...matchPatterns,
                                    {
                                      key: "",
                                      value: "",
                                    },
                                  ]);
                                }}
                              >
                                Add Pattern
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-danger">
                            Match Patterns are disabled
                          </p>
                        )}
                      </div>
                    )}
                    {currentStep === 4 && (
                      <div>
                        <p className="text-lg text-default-500 font-bold">
                          Exclude Patterns
                        </p>
                        <Spacer y={2} />
                        {enableExcludePatterns ? (
                          <div>
                            <div className="flex flex-col gap-4">
                              {excludePatterns.map(
                                (pattern: any, index: number) => (
                                  <div key={index}>
                                    <div className="flex flex-cols items-center justify-between">
                                      <p>Pattern {index + 1}</p>
                                      <Button
                                        isIconOnly
                                        color="danger"
                                        variant="light"
                                        onPress={() => {
                                          setExcludePatterns([
                                            ...excludePatterns.slice(0, index),
                                            ...excludePatterns.slice(index + 1),
                                          ]);
                                        }}
                                      >
                                        <Icon
                                          icon="solar:trash-bin-trash-broken"
                                          width={20}
                                        />
                                      </Button>
                                    </div>
                                    <Divider />
                                    <Spacer y={2} />
                                    <div className="grid grid-cols-2 gap-4">
                                      <Input
                                        label="Key"
                                        radius="sm"
                                        size="sm"
                                        value={pattern.key}
                                        onValueChange={(value) => {
                                          setExcludePatterns([
                                            ...excludePatterns.slice(0, index),
                                            {
                                              ...pattern,
                                              key: value,
                                            },
                                            ...excludePatterns.slice(index + 1),
                                          ]);
                                        }}
                                      />
                                      <Input
                                        label="Value"
                                        radius="sm"
                                        size="sm"
                                        value={pattern.value}
                                        onValueChange={(value) => {
                                          setExcludePatterns([
                                            ...excludePatterns.slice(0, index),
                                            {
                                              ...pattern,
                                              value: value,
                                            },
                                            ...excludePatterns.slice(index + 1),
                                          ]);
                                        }}
                                      />
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                            <div className="mt-4">
                              <Button
                                fullWidth
                                color="primary"
                                startContent={<PlusIcon />}
                                variant="flat"
                                onPress={() => {
                                  setExcludePatterns([
                                    ...excludePatterns,
                                    {
                                      key: "",
                                      value: "",
                                    },
                                  ]);
                                }}
                              >
                                Add Pattern
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-danger">
                            Exclude Patterns are disabled
                          </p>
                        )}
                      </div>
                    )}
                    {currentStep + 1 === steps && (
                      <div>
                        <p>Review the details below.</p>
                        <div className="mt-4">
                          <div className="grid lg:grid-cols-2 gap-4">
                            <Input
                              isReadOnly
                              label="Name"
                              size="sm"
                              value={name}
                            />
                            <Input
                              isReadOnly
                              label="Description"
                              size="sm"
                              value={description}
                            />
                            <Input
                              isReadOnly
                              label="Status"
                              size="sm"
                              value={status ? "Enabled" : "Disabled"}
                            />
                            <Input
                              isReadOnly
                              label="Action"
                              size="sm"
                              value={actions}
                            />
                          </div>
                          {enableMatchPatterns && (
                            <>
                              <Spacer y={4} />
                              <p className="font-bold mb-0 text-success">
                                Match Patterns
                              </p>
                              {matchPatterns.filter(
                                (pattern: any) => pattern.key,
                              ).length === 0 ? (
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
                                    {matchPatterns.map(
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
                            </>
                          )}
                          {enableExcludePatterns && (
                            <>
                              <Spacer y={4} />
                              <p className="font-bold mb-0 text-danger">
                                Exclude Patterns
                              </p>
                              {matchPatterns.filter(
                                (pattern: any) => pattern.key,
                              ).length === 0 ? (
                                <p>Action will be triggered for all events.</p>
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
                                    {excludePatterns.map(
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
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  variant="ghost"
                  onPress={() => {
                    cancel();
                  }}
                >
                  Cancel
                </Button>
                {currentStep > 0 ? (
                  <Button
                    color="default"
                    variant="flat"
                    onPress={() => {
                      setCurrentStep(currentStep - 1);
                      setDisableNext(false);
                    }}
                  >
                    Back
                  </Button>
                ) : (
                  <Button isDisabled color="default" variant="flat">
                    Back
                  </Button>
                )}
                {currentStep + 1 === steps ? (
                  <Button
                    color="primary"
                    isLoading={isLoading}
                    onPress={() => createAction()}
                  >
                    Create Action
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    isDisabled={disableNext}
                    isLoading={isLoading}
                    onPress={() => setCurrentStep(currentStep + 1)}
                  >
                    Next Step
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </main>
  );
}
