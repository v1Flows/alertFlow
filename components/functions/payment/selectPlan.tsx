"use client";

import type { UseDisclosureReturn } from "@nextui-org/use-disclosure";

import { Icon } from "@iconify/react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  RadioGroup,
} from "@nextui-org/react";
import { AnimatePresence, domAnimation, LazyMotion, m } from "framer-motion";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

import CreateSubscription from "@/lib/fetch/user/POST/CreateSubscription";

import PlanRadio from "./plan-radio";

export default function SelectPlanModal({
  plans,
  user,
  disclosure,
}: {
  plans: any;
  user: any;
  disclosure: UseDisclosureReturn;
}) {
  const router = useRouter();

  const { isOpen, onOpenChange, onClose } = disclosure;

  const [isLoading, setIsLoading] = React.useState(false);
  const [[page], setPage] = React.useState([0, 0]);
  const [selectedPlan, setSelectedPlan] = React.useState(user.plan);

  const titleContent = React.useMemo(() => {
    return page === 0 ? "Select your plan" : "Checkout";
  }, [page]);

  const titleDescContent = React.useMemo(() => {
    return page === 0
      ? "Find a plan that's right for you."
      : "Finalize your plan.";
  }, [page]);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  async function pay(planID: string, planStripeID: string) {
    setIsLoading(true);
    const res = (await CreateSubscription(planID, planStripeID)) as any;

    if (!res.success) {
      toast.error(res.message);
      setIsLoading(false);

      return;
    }

    setIsLoading(false);
    router.refresh();
    toast.success("Subscription created successfully");
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      placement="center"
      onClose={onClose}
      onOpenChange={onOpenChange}
    >
      <ModalContent className="w-full">
        {(onClose) => (
          <>
            <ModalBody>
              <Card fullWidth className="bg-transparent" shadow="none">
                <CardHeader className="flex flex-col items-start px-6 pb-0 pt-5">
                  <h4 className="text-large font-medium">{titleContent}</h4>
                  <p className="text-tiny text-default-400">
                    {titleDescContent}
                  </p>
                </CardHeader>
                <CardBody>
                  <LazyMotion features={domAnimation}>
                    <AnimatePresence initial={false} mode="popLayout">
                      <m.div>
                        {page === 0 && (
                          <RadioGroup
                            aria-label="Plans"
                            classNames={{ wrapper: "gap-3" }}
                            value={selectedPlan.id}
                            onValueChange={(value) => {
                              setSelectedPlan(
                                plans.find((plan: any) => plan.id === value),
                              );
                            }}
                          >
                            {plans
                              .filter((plan: any) => plan.id !== "enterprise")
                              .map((plan: any) => (
                                <PlanRadio
                                  key={plan.id}
                                  description={plan.description}
                                  icon={
                                    <Icon
                                      className="text-primary"
                                      icon="solar:box-minimalistic-linear"
                                      width={18}
                                    />
                                  }
                                  label={plan.name}
                                  monthlyPrice={plan.price.toFixed(2)}
                                  value={plan.id}
                                />
                              ))}
                          </RadioGroup>
                        )}
                        {page === 1 && (
                          <>
                            <Card className="bg-transparent" shadow="none">
                              <CardBody>
                                <div className="grid grid-cols-2 items-center">
                                  <p className="text-large text-default-500">
                                    Plan
                                  </p>
                                  <p>{selectedPlan.name}</p>

                                  <p className="text-large text-default-500">
                                    Price
                                  </p>
                                  <p className="text-success">
                                    {selectedPlan.price.toFixed(2)}€
                                  </p>
                                </div>
                              </CardBody>
                            </Card>
                          </>
                        )}
                      </m.div>
                    </AnimatePresence>
                  </LazyMotion>
                </CardBody>
              </Card>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onPress={onClose}>
                Cancel
              </Button>
              {page === 1 && (
                <Button variant="solid" onPress={() => paginate(-1)}>
                  Go back
                </Button>
              )}
              {page === 0 && (
                <Button
                  color="primary"
                  isDisabled={!selectedPlan.id}
                  variant="solid"
                  onPress={() => paginate(1)}
                >
                  Checkout new Plan
                </Button>
              )}
              {page === 1 && (
                <Button
                  color="primary"
                  isDisabled={!selectedPlan.id}
                  isLoading={isLoading}
                  startContent={
                    <Icon icon="solar:wallet-money-broken" width={20} />
                  }
                  variant="solid"
                  onPress={() => pay(selectedPlan.id, selectedPlan.stripe_id)}
                >
                  Pay
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
