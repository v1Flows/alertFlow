"use client";

import type { UseDisclosureReturn } from "@nextui-org/use-disclosure";

import React, { useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import UpdatePlan from "@/lib/fetch/admin/PUT/UpdatePlan";
import ErrorCard from "@/components/error/ErrorCard";

export default function EditPlanModal({
  plan,
  disclosure,
}: {
  plan: any;
  disclosure: UseDisclosureReturn;
}) {
  const router = useRouter();

  const { isOpen, onOpenChange, onClose } = disclosure;

  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [price, setPrice] = React.useState(0);
  const [projects, setProjects] = React.useState(0);
  const [projectMembers, setProjectMembers] = React.useState(0);
  const [flows, setFlows] = React.useState(0);
  const [selfHostedRunners, setSelfHostedRunners] = React.useState(0);
  const [alertflowRunners, setAlertflowRunners] = React.useState(0);
  const [executionsPerMonth, setExecutionsPerMonth] = React.useState(0);
  const [stripeID, setStripeID] = React.useState("");
  const [error, setError] = React.useState(false);
  const [errorText, setErrorText] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  // loading
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    if (plan !== null) {
      setName(plan.name);
      setDescription(plan.description);
      setPrice(plan.price);
      setProjects(plan.projects);
      setProjectMembers(plan.project_members);
      setFlows(plan.flows);
      setSelfHostedRunners(plan.self_hosted_runners);
      setAlertflowRunners(plan.alertflow_runners);
      setExecutionsPerMonth(plan.executions_per_month);
      setStripeID(plan.stripe_id);
    }
  }, [plan]);

  async function editPlan() {
    setIsLoading(true);

    const response = (await UpdatePlan(
      plan.id,
      name,
      description,
      price,
      projects,
      projectMembers,
      flows,
      selfHostedRunners,
      alertflowRunners,
      executionsPerMonth,
      stripeID,
    )) as any;

    if (!response) {
      setError(true);
      setErrorText("Network error");
      setErrorMessage("Failed to update plan");
      setIsLoading(false);
      toast.error("Failed to update plan");

      return;
    }

    if (response.success) {
      setError(false);
      setErrorText("");
      setErrorMessage("");
      router.refresh();
      onOpenChange();
      setIsLoading(false);
      toast.success("Plan updated successfully");
    } else {
      setError(true);
      setErrorText(response.error);
      setErrorMessage(response.message);
      setIsLoading(false);
      toast.error("Failed to update user");
    }
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        placement="center"
        onClose={onClose}
        onOpenChange={onOpenChange}
      >
        <ModalContent className="w-full">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-wrap items-center">
                <div className="flex flex-col gap-2">
                  <p className="text-lg font-bold">Edit Plan</p>
                  <p className="text-sm text-default-500">
                    Edit the plan details below and click apply changes to save.
                  </p>
                </div>
              </ModalHeader>
              <ModalBody>
                {error && (
                  <ErrorCard error={errorText} message={errorMessage} />
                )}
                <Input
                  isRequired
                  label="Name"
                  labelPlacement="outside"
                  placeholder="Enter the name"
                  type="text"
                  value={name}
                  variant="flat"
                  onValueChange={(value) => setName(value)}
                />
                <Input
                  isRequired
                  label="Description"
                  labelPlacement="outside"
                  placeholder="Enter the description"
                  type="text"
                  value={description}
                  variant="flat"
                  onValueChange={(value) => setDescription(value)}
                />
                <Input
                  isRequired
                  endContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">€</span>
                    </div>
                  }
                  label="Price"
                  labelPlacement="outside"
                  max={999}
                  placeholder="Enter the price"
                  type="number"
                  value={price.toString()}
                  variant="flat"
                  onValueChange={(value) => setPrice(Number(value))}
                />
                <Input
                  isRequired
                  label="Projects"
                  labelPlacement="outside"
                  max={999}
                  placeholder="Amount of projects"
                  type="number"
                  value={projects.toString()}
                  variant="flat"
                  onValueChange={(value) => setProjects(Number(value))}
                />
                <Input
                  isRequired
                  label="Project Members"
                  labelPlacement="outside"
                  max={999}
                  placeholder="Amount of project members"
                  type="number"
                  value={projectMembers.toString()}
                  variant="flat"
                  onValueChange={(value) => setProjectMembers(Number(value))}
                />
                <Input
                  isRequired
                  label="Flows"
                  labelPlacement="outside"
                  max={999}
                  placeholder="Amount of flows"
                  type="number"
                  value={flows.toString()}
                  variant="flat"
                  onValueChange={(value) => setFlows(Number(value))}
                />
                <Input
                  isRequired
                  label="Self-Hosted Runners"
                  labelPlacement="outside"
                  max={999}
                  placeholder="Amount of self-hosted runners"
                  type="number"
                  value={selfHostedRunners.toString()}
                  variant="flat"
                  onValueChange={(value) => setSelfHostedRunners(Number(value))}
                />
                <Input
                  isRequired
                  label="AlertFlow Runners"
                  labelPlacement="outside"
                  max={16}
                  placeholder="Amount of alertflow runners"
                  type="number"
                  value={alertflowRunners.toString()}
                  variant="flat"
                  onValueChange={(value) => setAlertflowRunners(Number(value))}
                />
                <Input
                  isRequired
                  label="Executions Per Month"
                  labelPlacement="outside"
                  max={999}
                  placeholder="Amount of executions per month"
                  type="number"
                  value={executionsPerMonth.toString()}
                  variant="flat"
                  onValueChange={(value) =>
                    setExecutionsPerMonth(Number(value))
                  }
                />
                <Input
                  isRequired
                  label="Stripe ID"
                  labelPlacement="outside"
                  placeholder="Enter the stripe ID"
                  type="text"
                  value={stripeID}
                  variant="flat"
                  onValueChange={(value) => setStripeID(value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="warning"
                  isLoading={isLoading}
                  variant="flat"
                  onPress={editPlan}
                >
                  Apply Changes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
