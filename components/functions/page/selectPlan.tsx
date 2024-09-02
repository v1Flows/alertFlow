"use client";

import React from "react";
import { Icon } from "@iconify/react";
import {
  Card,
  CardHeader,
  CardBody,
  RadioGroup,
  Badge,
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { UseDisclosureReturn } from "@nextui-org/use-disclosure";

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
  const { isOpen, onOpenChange, onClose } = disclosure;

  const [selectedPlan, setSelectedPlan] = React.useState(user.plan);

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
                  <h4 className="text-large font-medium">Select your plan</h4>
                  <p className="text-tiny text-default-400">
                    Find a plan that&apos;s right for you.
                  </p>
                </CardHeader>
                <CardBody>
                  <RadioGroup
                    aria-label="Plans"
                    classNames={{ wrapper: "gap-3" }}
                    value={selectedPlan}
                    onValueChange={(value) => setSelectedPlan(value)}
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
                          monthlyPrice={plan.price}
                          value={plan.id}
                        />
                      ))}
                  </RadioGroup>
                </CardBody>
              </Card>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onPress={onClose}>
                Cancel
              </Button>
              <Button color="secondary" variant="flat">
                Checkout new Plan
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
