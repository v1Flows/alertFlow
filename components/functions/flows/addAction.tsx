import type { UseDisclosureReturn } from "@nextui-org/use-disclosure";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Progress,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Spacer,
  TableColumn,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  Table,
} from "@nextui-org/react";
import React from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";

import VerticalSteps from "@/components/functions/steps/vertical-steps";
import { cn } from "@/components/functions/cn/cn";
import { PlusIcon } from "@/components/icons";
import CreateFlowAction from "@/lib/fetch/flow/POST/CreateFlowAction";

import SupportCard from "./support-card";

const steps = [
  {
    title: "Basic Details",
    description: "Enter the basic informations of your new action.",
  },
  {
    title: "Select Action",
    description: "Select any of the available actions.",
  },
  {
    title: "Action Parameters",
    description: "Enter the parameters of your action.",
  },
  {
    title: "Match Patterns",
    description: "Select the patterns you want to match.",
  },
  {
    title: "Exclude Patterns",
    description: "Select the patterns you want to exclude.",
  },
  {
    title: "Review",
    description:
      "Final review of the action and make sure everything is correct.",
  },
];

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

  const [currentStep, setCurrentStep] = React.useState(0);
  const [isLoading, setLoading] = React.useState(false);

  // inputs
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [status, setStatus] = React.useState("active");
  const [action, setAction] = React.useState("");
  const [matchPatterns, setMatchPatterns] = React.useState([
    {
      key: "",
      group: "",
      value: "",
      react_on: "",
    },
  ]);
  const [excludePatterns, setExcludePatterns] = React.useState([
    {
      key: "",
      group: "",
      value: "",
      react_on: "",
    },
  ]);

  function countTotalAvailableActions() {
    var actions = 0;

    for (let i = 0; i < runners.length; i++) {
      if (runners[i].available_actions.length > 0) {
        actions++;
      }
    }

    return actions;
  }

  function getUniqueActions() {
    var actions = [] as any;

    for (let i = 0; i < runners.length; i++) {
      for (let j = 0; j < runners[i].available_actions.length; j++) {
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
    setStatus("active");
    setAction("");
    setMatchPatterns([
      {
        key: "",
        group: "",
        value: "",
        react_on: "",
      },
    ]);
    setExcludePatterns([
      {
        key: "",
        group: "",
        value: "",
        react_on: "",
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
      status: status,
      action: action,
      match_patterns: matchPatterns,
      exclude_patterns: excludePatterns,
    };

    const res = await CreateFlowAction(flowID, sendAction);

    if (!res.error) {
      setLoading(false);
      setName("");
      setDescription("");
      setStatus("active");
      setAction("");
      setMatchPatterns([
        {
          key: "",
          group: "",
          value: "",
          react_on: "",
        },
      ]);
      setExcludePatterns([
        {
          key: "",
          group: "",
          value: "",
          react_on: "",
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
        isOpen={isOpen}
        placement="center"
        size="5xl"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader />
              <ModalBody>
                <div className="w-full flex flex-cols gap-4">
                  <div className="w-full col-span-1">
                    <section className="max-w-sm">
                      <h1
                        className="mb-2 text-xl font-medium"
                        id="getting-started"
                      >
                        Getting started
                      </h1>
                      <p className="mb-5 text-small text-default-500">
                        Follow the steps to configure your action. This allows
                        you to process incoming payloads.
                      </p>
                      <Progress
                        classNames={{
                          base: "px-0.5 mb-5",
                          label: "text-small",
                          value: "text-small text-default-400",
                        }}
                        label="Steps"
                        maxValue={steps.length - 1}
                        minValue={0}
                        showValueLabel={true}
                        size="md"
                        value={currentStep}
                        valueLabel={`${currentStep + 1} of ${steps.length}`}
                      />
                      <VerticalSteps
                        hideProgressBars
                        currentStep={currentStep}
                        stepClassName="border border-default-200 dark:border-default-50 aria-[current]:bg-default-100 dark:aria-[current]:bg-default-50"
                        steps={steps}
                        onStepChange={setCurrentStep}
                      />
                      <Spacer y={4} />
                      <SupportCard className="!m-0 border border-default-200 !bg-default-50 px-2 shadow-none dark:border-default-100 dark:!bg-default-50/50" />
                    </section>
                  </div>
                  <div className="w-full col-span-1">
                    {currentStep === 0 && (
                      <div className="flex flex-col gap-4">
                        <Input
                          label="Action Name"
                          labelPlacement="outside"
                          placeholder="My Action Name"
                          radius="sm"
                          size="md"
                          type="email"
                          value={name}
                          onValueChange={setName}
                        />
                        <Input
                          label="Action Description"
                          labelPlacement="outside"
                          placeholder="My Action Description"
                          radius="sm"
                          size="md"
                          type="email"
                          value={description}
                          onValueChange={setDescription}
                        />
                        <RadioGroup
                          description="Selected the status of your action."
                          label="Status"
                          value={status}
                          onValueChange={setStatus}
                        >
                          <div className="flex flex-warp gap-4">
                            <CustomRadio
                              color="success"
                              description="Action can be directly used."
                              value="active"
                            >
                              Active
                            </CustomRadio>
                            <CustomRadio
                              color="danger"
                              description="Action can not be used and has no effect."
                              value="disabled"
                            >
                              Disabled
                            </CustomRadio>
                          </div>
                        </RadioGroup>
                      </div>
                    )}
                    {currentStep === 1 && (
                      <>
                        {countTotalAvailableActions() === 0 ? (
                          <div>
                            <Card className="border border-danger">
                              <CardHeader>
                                <p className="text-danger font-bold">
                                  😕 Seems like there are no Actions available.
                                </p>
                              </CardHeader>
                              <CardBody>
                                <p className="text-default-500">
                                  Please check if you have a dedicated runner
                                  assign to your flow and if that runner exposes
                                  any actions
                                </p>
                              </CardBody>
                            </Card>
                          </div>
                        ) : (
                          <RadioGroup
                            description="Select any of the available actions."
                            label="Actions"
                            value={action}
                            onValueChange={setAction}
                          >
                            {getUniqueActions().map((action: any) => (
                              <CustomRadio
                                key={action.name}
                                description={action.description}
                                value={action.name}
                              >
                                {action.name}
                              </CustomRadio>
                            ))}
                          </RadioGroup>
                        )}
                      </>
                    )}
                    {currentStep === 2 && (
                      <div>
                        <p>Number of Required Parameters:</p>
                      </div>
                    )}
                    {currentStep === 3 && (
                      <div>
                        <div className="flex flex-col gap-4">
                          {matchPatterns.map((pattern: any, index: number) => (
                            <Card key={index}>
                              <CardHeader className="flex justify-between">
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
                              </CardHeader>
                              <CardBody>
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
                                    label="Group"
                                    radius="sm"
                                    size="sm"
                                    value={pattern.group}
                                    onValueChange={(value) => {
                                      setMatchPatterns([
                                        ...matchPatterns.slice(0, index),
                                        {
                                          ...pattern,
                                          group: value,
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
                                  <Select
                                    label="React On"
                                    radius="sm"
                                    selectedKeys={[pattern.react_on]}
                                    size="sm"
                                    onSelectionChange={(value) => {
                                      setMatchPatterns([
                                        ...matchPatterns.slice(0, index),
                                        {
                                          ...pattern,
                                          react_on: value.currentKey,
                                        },
                                        ...matchPatterns.slice(index + 1),
                                      ]);
                                    }}
                                  >
                                    <SelectItem
                                      key="firing"
                                      value={pattern.react_on}
                                    >
                                      Firing
                                    </SelectItem>
                                    <SelectItem
                                      key="resolved"
                                      value={pattern.react_on}
                                    >
                                      Resolved
                                    </SelectItem>
                                  </Select>
                                </div>
                              </CardBody>
                            </Card>
                          ))}
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
                                  group: "",
                                  value: "",
                                  react_on: "",
                                },
                              ]);
                            }}
                          >
                            Add Pattern
                          </Button>
                        </div>
                      </div>
                    )}
                    {currentStep === 4 && (
                      <div>
                        <div className="flex flex-col gap-4">
                          {excludePatterns.map(
                            (pattern: any, index: number) => (
                              <Card key={index}>
                                <CardHeader className="flex justify-between">
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
                                </CardHeader>
                                <CardBody>
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
                                      label="Group"
                                      radius="sm"
                                      size="sm"
                                      value={pattern.group}
                                      onValueChange={(value) => {
                                        setExcludePatterns([
                                          ...excludePatterns.slice(0, index),
                                          {
                                            ...pattern,
                                            group: value,
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
                                    <Select
                                      label="React On"
                                      radius="sm"
                                      selectedKeys={[pattern.react_on]}
                                      size="sm"
                                      onSelectionChange={(value) => {
                                        setExcludePatterns([
                                          ...excludePatterns.slice(0, index),
                                          {
                                            ...pattern,
                                            react_on: value.currentKey,
                                          },
                                          ...excludePatterns.slice(index + 1),
                                        ]);
                                      }}
                                    >
                                      <SelectItem
                                        key="firing"
                                        value={pattern.react_on}
                                      >
                                        Firing
                                      </SelectItem>
                                      <SelectItem
                                        key="resolved"
                                        value={pattern.react_on}
                                      >
                                        Resolved
                                      </SelectItem>
                                    </Select>
                                  </div>
                                </CardBody>
                              </Card>
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
                                  group: "",
                                  value: "",
                                  react_on: "",
                                },
                              ]);
                            }}
                          >
                            Add Pattern
                          </Button>
                        </div>
                      </div>
                    )}
                    {currentStep === 5 && (
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
                              value={status}
                            />
                            <Input
                              isReadOnly
                              label="Action"
                              size="sm"
                              value={action}
                            />
                          </div>
                          <Spacer y={4} />
                          <p className="font-bold mb-0 text-success">
                            Match Patterns
                          </p>
                          {matchPatterns.filter((pattern: any) => pattern.key)
                            .length === 0 ? (
                            <p>Action will be triggered for all events.</p>
                          ) : (
                            <Table
                              aria-label="Match Action Patterns"
                              className="w-full"
                            >
                              <TableHeader>
                                <TableColumn>GROUP</TableColumn>
                                <TableColumn>KEY</TableColumn>
                                <TableColumn>VALUE</TableColumn>
                                <TableColumn>REACT ON</TableColumn>
                              </TableHeader>
                              <TableBody>
                                {matchPatterns.map(
                                  (pattern: any, index: number) => (
                                    <TableRow key={index}>
                                      <TableCell>{pattern.group}</TableCell>
                                      <TableCell>{pattern.key}</TableCell>
                                      <TableCell>{pattern.value}</TableCell>
                                      <TableCell>{pattern.react_on}</TableCell>
                                    </TableRow>
                                  ),
                                )}
                              </TableBody>
                            </Table>
                          )}
                          <Spacer y={4} />
                          <p className="font-bold mb-0 text-danger">
                            Exclude Patterns
                          </p>
                          {matchPatterns.filter((pattern: any) => pattern.key)
                            .length === 0 ? (
                            <p>Action will be triggered for all events.</p>
                          ) : (
                            <Table
                              aria-label="Exclude Action Patterns"
                              className="w-full"
                            >
                              <TableHeader>
                                <TableColumn>GROUP</TableColumn>
                                <TableColumn>KEY</TableColumn>
                                <TableColumn>VALUE</TableColumn>
                                <TableColumn>REACT ON</TableColumn>
                              </TableHeader>
                              <TableBody>
                                {excludePatterns.map(
                                  (pattern: any, index: number) => (
                                    <TableRow key={index}>
                                      <TableCell>{pattern.group}</TableCell>
                                      <TableCell>{pattern.key}</TableCell>
                                      <TableCell>{pattern.value}</TableCell>
                                      <TableCell>{pattern.react_on}</TableCell>
                                    </TableRow>
                                  ),
                                )}
                              </TableBody>
                            </Table>
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
                    onPress={() => setCurrentStep(currentStep - 1)}
                  >
                    Back
                  </Button>
                ) : (
                  <Button isDisabled color="default" variant="flat">
                    Back
                  </Button>
                )}
                {currentStep === steps.length - 1 ? (
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
