import type { UseDisclosureReturn } from "@nextui-org/use-disclosure";

import {
  Button,
  Card,
  CardBody,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Radio,
  Spacer,
  Textarea,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { Icon } from "@iconify/react";

import { cn } from "@/components/functions/cn/cn";
import AddFlowActions from "@/lib/fetch/flow/POST/AddFlowActions";

import MinimalRowSteps from "../steps/minimal-row-steps";

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

export default function AddActionModal({
  disclosure,
  runners,
  flow,
  user,
}: {
  disclosure: UseDisclosureReturn;
  runners: any;
  flow: any;
  user: any;
}) {
  const router = useRouter();

  const { isOpen, onOpenChange } = disclosure;

  const [steps] = useState(2);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setLoading] = useState(false);

  const [disableNext, setDisableNext] = useState(false);

  const [availableActions, setAvailableActions] = useState([] as any);
  const [availableCategories, setAvailableCategories] = useState([
    "All",
  ] as any);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // pagination
  const [actionPage, setActionPage] = useState(1);
  const rowsPerPage = 6;
  const actionItems = React.useMemo(() => {
    const start = (actionPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    if (selectedCategory !== "All") {
      return availableActions
        .filter((action: any) => action.category === selectedCategory)
        .slice(start, end);
    }

    return availableActions.slice(start, end);
  }, [actionPage, availableActions, selectedCategory, runners]);

  // inputs
  const [status, setStatus] = useState(true);
  const [action, setAction] = useState({
    id: uuidv4(),
    name: "",
    description: "",
    icon: "",
    type: "",
    category: "",
    active: true,
    params: [],
    custom_name: "",
    custom_description: "",
  });
  const [params, setParams] = useState([] as any);

  function actionPages() {
    var length = 0;

    if (selectedCategory !== "All") {
      length =
        availableActions.filter(
          (action: any) => action.category === selectedCategory,
        ).length / rowsPerPage;
    } else {
      length = availableActions.length / rowsPerPage;
    }

    return Math.ceil(length);
  }

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
    for (let i = 0; i < runners.length; i++) {
      for (let j = 0; j < runners[i].available_actions.length; j++) {
        const action = runners[i].available_actions[j];

        if (action.is_hidden && user.role !== "Admin") {
          continue;
        }

        setAvailableActions((prev: any) => {
          const actionSet = new Set(prev.map((a: any) => a.type));

          if (!actionSet.has(action.type)) {
            return [...prev, action];
          }

          return prev;
        });
      }
    }
  }

  function getUniqueActionCategorys() {
    for (let i = 0; i < runners.length; i++) {
      for (let j = 0; j < runners[i].available_actions.length; j++) {
        const action = runners[i].available_actions[j];

        setAvailableCategories((prev: any) => {
          const categorySet = new Set(prev);

          if (!categorySet.has(action.category)) {
            return [...prev, action.category];
          }

          return prev;
        });
      }
    }
  }

  function handleActionSelect(action: any) {
    const selectedAction = availableActions.find((x: any) => x.type === action);

    setAction(selectedAction);

    if (selectedAction.params?.length > 0) {
      const fnParams = [] as any;

      selectedAction.params.map((param: any) => {
        fnParams.push({
          key: param.key,
          value: param.default || "",
        });
      });

      setParams(fnParams);
    }
  }

  function cancel() {
    setStatus(true);
    setAction({
      id: uuidv4(),
      name: "",
      description: "",
      icon: "",
      type: "",
      category: "",
      active: true,
      params: [],
      custom_name: "",
      custom_description: "",
    });
    setCurrentStep(0);
    onOpenChange();
  }

  async function createAction() {
    setLoading(true);

    const sendAction = {
      id: uuidv4(),
      name: action.name,
      description: action.description,
      icon: action.icon,
      type: action.type,
      active: true,
      params: params,
      custom_name: action.custom_name,
      custom_description: action.custom_description,
    };

    const updatedActions = [...flow.actions, sendAction];

    const res = await AddFlowActions(flow.id, flow.project_id, updatedActions);

    if (!res.error) {
      setLoading(false);
      setStatus(true);
      setAction({
        id: uuidv4(),
        name: "",
        description: "",
        icon: "",
        type: "",
        category: "",
        active: true,
        params: [],
        custom_name: "",
        custom_description: "",
      });
      setCurrentStep(0);
      onOpenChange();
      router.refresh();
      toast.success("Action added successfully");
    } else {
      setLoading(false);
      router.refresh();
      toast.error(res.error);
    }

    setLoading(false);
  }

  useEffect(() => {
    if (runners.length > 0) {
      getUniqueActions();
      getUniqueActionCategorys();
    }
  }),
    [runners];

  return (
    <main>
      <Modal
        isDismissable={false}
        isOpen={isOpen}
        placement="center"
        size="5xl"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-wrap items-center">
                <div className="flex flex-col gap-2">
                  <p className="text-lg font-bold">Add Action to Flow</p>
                  <p className="text-sm text-default-500">
                    Actions are the building blocks of your flows. Those are the
                    steps that get executed when a flow is triggered.
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
                            <p className="text-sm text-default-500">
                              Categories
                            </p>
                            <Spacer y={1} />
                            <div className="flex gap-2">
                              {availableCategories.map((category: any) => (
                                <Chip
                                  key={category}
                                  color={
                                    selectedCategory === category
                                      ? "primary"
                                      : "default"
                                  }
                                  radius="sm"
                                  size="lg"
                                  variant={
                                    selectedCategory === category
                                      ? "solid"
                                      : "flat"
                                  }
                                  onClick={() => {
                                    setSelectedCategory(category);
                                    setActionPage(1);
                                  }}
                                >
                                  {category}
                                </Chip>
                              ))}
                            </div>
                            <Spacer y={4} />
                            <div className="grid grid-cols-2 items-stretch gap-4">
                              {actionItems.map((act: any) =>
                                act.is_hidden ? (
                                  <Card
                                    key={act.type}
                                    isHoverable
                                    isPressable
                                    className={`border-2 ${act.type === action.type ? "border-danger" : "border-danger-200"}`}
                                    radius="sm"
                                    onPress={() => handleActionSelect(act.type)}
                                  >
                                    <CardBody>
                                      <div className="flex items-center gap-2">
                                        <div className="flex bg-danger/10 text-danger items-center rounded-small justify-center w-10 h-10">
                                          <Icon icon={act.icon} width={26} />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                          <p className="text-lg font-bold">
                                            {act.name}
                                          </p>
                                          <p className="text-sm text-default-500">
                                            {act.description}
                                          </p>
                                        </div>
                                      </div>
                                      <Spacer y={2} />
                                      <Chip
                                        color="danger"
                                        radius="sm"
                                        size="sm"
                                        variant="flat"
                                      >
                                        Admin Only
                                      </Chip>
                                    </CardBody>
                                  </Card>
                                ) : (
                                  <Card
                                    key={act.type}
                                    isHoverable
                                    isPressable
                                    className={`border-2 border-default-200 ${act.type === action.type ? "border-primary" : ""}`}
                                    radius="sm"
                                    onPress={() => handleActionSelect(act.type)}
                                  >
                                    <CardBody>
                                      <div className="flex items-center gap-2">
                                        <div className="flex bg-primary/10 text-primary items-center rounded-small justify-center w-10 h-10">
                                          <Icon icon={act.icon} width={26} />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                          <p className="text-lg font-bold">
                                            {act.name}
                                          </p>
                                          <p className="text-sm text-default-500">
                                            {act.description}
                                          </p>
                                        </div>
                                      </div>
                                    </CardBody>
                                  </Card>
                                ),
                              )}
                            </div>
                            <Spacer y={4} />
                            <div className="flex items-center justify-center">
                              <Pagination
                                showControls
                                initialPage={1}
                                page={actionPage}
                                total={actionPages()}
                                onChange={(actionPage) =>
                                  setActionPage(actionPage)
                                }
                              />
                            </div>
                          </>
                        )}
                      </div>
                    )}
                    {currentStep === 1 && (
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
                        {(action.params && action.params.length > 0) ||
                        action?.params ? (
                          <div className="grid grid-cols-2 gap-2">
                            {action.params.map((param: any) => {
                              return param.type === "text" ||
                                param.type === "number" ? (
                                <Input
                                  key={param.key}
                                  description={param?.description}
                                  isRequired={param.required}
                                  label={param.key}
                                  type={param.type}
                                  value={
                                    params.find((x: any) => x.key === param.key)
                                      ?.value || ""
                                  }
                                  onValueChange={(e) => {
                                    setParams(
                                      params.map((x: any) => {
                                        if (x.key === param.key) {
                                          return { ...x, value: e };
                                        }

                                        return x;
                                      }),
                                    );
                                  }}
                                />
                              ) : param.type === "textarea" ? (
                                <Textarea
                                  key={param.key}
                                  description={param?.description}
                                  isRequired={param.required}
                                  label={param.key}
                                  type={param.type}
                                  value={
                                    params.find((x: any) => x.key === param.key)
                                      ?.value || ""
                                  }
                                  onValueChange={(e) => {
                                    setParams(
                                      params.map((x: any) => {
                                        if (x.key === param.key) {
                                          return { ...x, value: e };
                                        }

                                        return x;
                                      }),
                                    );
                                  }}
                                />
                              ) : null;
                            })}
                          </div>
                        ) : (
                          <p>No parameters for this action found.</p>
                        )}
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
                    isDisabled={disableNext || action.type == ""}
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
