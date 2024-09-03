"use client";

import React from "react";
import { Icon } from "@iconify/react";
import {
  Card,
  CardHeader,
  CardBody,
  RadioGroup,
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  Spacer,
} from "@nextui-org/react";
import { UseDisclosureReturn } from "@nextui-org/use-disclosure";
import { AnimatePresence, domAnimation, LazyMotion, m } from "framer-motion";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

import { useTheme } from "next-themes";
import { useIsSSR } from "@react-aria/ssr";

import CreateIntent from "@/lib/fetch/payment/CreateIntent";

import PlanRadio from "./plan-radio";
import PaymentForm from "./paymentForm";

export default function SelectPlanModal({
  plans,
  user,
  disclosure,
}: {
  plans: any;
  user: any;
  disclosure: UseDisclosureReturn;
}) {
  const { isOpen, onOpenChange, onClose } = disclosure;

  const { theme } = useTheme();
  const isSSR = useIsSSR();

  const [isLoading, setIsLoading] = React.useState(false);
  const [[page, direction], setPage] = React.useState([0, 0]);
  const [selectedPlan, setSelectedPlan] = React.useState(user.plan);

  const [clientSecret, setClientSecret] = React.useState("");

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

  async function createIntent() {
    setIsLoading(true);
    const res = await CreateIntent(selectedPlan.price, user.email);

    if (res.client_secret === "") {
      setIsLoading(false);

      return;
    } else {
      setClientSecret(res.client_secret);
      paginate(1);
      setIsLoading(false);
    }
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
                                      className="text-secondary"
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
                            <Card className="bg-transparent border-2 border-secondary">
                              <CardBody>
                                <div className="flex flex-cols items-center justify-between">
                                  <h4 className="text-large font-bold">
                                    Summary
                                  </h4>
                                  <div>
                                    <p className="text-default-500">
                                      {selectedPlan.name} plan
                                    </p>
                                    <h5 className="text-medium font-medium">
                                      Total:{" "}
                                      <span className="text-success">
                                        ${selectedPlan.price.toFixed(2)}
                                      </span>
                                    </h5>
                                  </div>
                                </div>
                              </CardBody>
                            </Card>
                            <Spacer y={2} />
                            <Elements
                              options={{
                                mode: "payment",
                                amount: selectedPlan.price * 100,
                                currency: "eur",
                                appearance: {
                                  theme:
                                    theme === "light" || isSSR
                                      ? "stripe"
                                      : "night",
                                },
                              }}
                              stripe={stripePromise}
                            >
                              {clientSecret !== "" && (
                                <PaymentForm
                                  amount={selectedPlan.price}
                                  clientSecret={clientSecret}
                                />
                              )}
                            </Elements>
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
                  color="secondary"
                  isDisabled={!selectedPlan.id}
                  isLoading={isLoading}
                  variant="solid"
                  onPress={() => createIntent()}
                >
                  Checkout new Plan
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
