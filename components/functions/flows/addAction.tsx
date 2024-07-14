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
} from "@nextui-org/react";
import React from "react";

import VerticalSteps from "@/components/functions/steps/vertical-steps";
import { cn } from "@/components/functions/cn/cn";
import { PlusIcon } from "@/components/icons";

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

type matchPatterns = {
  key: string;
  group: string;
  value: string;
  react_on: string;
};

export default function AddFlowActionModal({
  disclosure,
  runners,
}: {
  disclosure: UseDisclosureReturn;
  runners: any;
}) {
  const { isOpen, onOpen, onOpenChange, onClose } = disclosure;

  const [currentStep, setCurrentStep] = React.useState(0);
  const [isLoading, setLoading] = React.useState(false);

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

  return (
    <main>
      <Modal
        isOpen={isOpen}
        placement="top-center"
        size="5xl"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
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
                        />
                        <Input
                          label="Action Description"
                          labelPlacement="outside"
                          placeholder="My Action Description"
                          radius="sm"
                          size="md"
                          type="email"
                        />
                        <RadioGroup
                          description="Selected the status of your action."
                          label="Status"
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
                      <RadioGroup
                        description="Select any of the available actions."
                        label="Actions"
                      >
                        {runners.map((runner: any) => {
                          return (
                            runner.available_actions.length > 0 &&
                            runner.available_actions.map((action: any) => (
                              <CustomRadio
                                key={action.name}
                                description={action.description}
                                value={action.name}
                              >
                                {action.name} | Runner: {runner.name}
                              </CustomRadio>
                            ))
                          );
                        })}
                      </RadioGroup>
                    )}
                    {currentStep === 2 && (
                      <div>
                        <div className="flex flex-col gap-4">
                          {matchPatterns.map((pattern: any, index: number) => (
                            <Card key={index}>
                              <CardHeader>
                                <p>Pattern {index + 1}</p>
                              </CardHeader>
                              <CardBody>
                                <div className="grid grid-cols-2 gap-4">
                                  <Input
                                    label="Key"
                                    radius="sm"
                                    size="sm"
                                    value={pattern.key}
                                  />
                                  <Input
                                    label="Group"
                                    radius="sm"
                                    size="sm"
                                    value={pattern.group}
                                  />
                                  <Input
                                    label="Value"
                                    radius="sm"
                                    size="sm"
                                    value={pattern.value}
                                  />
                                  <Select
                                    label="React On"
                                    radius="sm"
                                    size="sm"
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
                    {currentStep === 3 && (
                      <div>
                        <div className="flex flex-col gap-4">
                          {excludePatterns.map(
                            (pattern: any, index: number) => (
                              <Card key={index}>
                                <CardHeader>
                                  <p>Pattern {index + 1}</p>
                                </CardHeader>
                                <CardBody>
                                  <div className="grid grid-cols-2 gap-4">
                                    <Input
                                      label="Key"
                                      radius="sm"
                                      size="sm"
                                      value={pattern.key}
                                    />
                                    <Input
                                      label="Group"
                                      radius="sm"
                                      size="sm"
                                      value={pattern.group}
                                    />
                                    <Input
                                      label="Value"
                                      radius="sm"
                                      size="sm"
                                      value={pattern.value}
                                    />
                                    <Select
                                      label="React On"
                                      radius="sm"
                                      size="sm"
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
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  variant="ghost"
                  onPress={() => {
                    onClose();
                    setCurrentStep(0);
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
                    onPress={() => setCurrentStep(currentStep + 1)}
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
