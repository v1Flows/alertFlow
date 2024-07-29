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
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import UpdatePlan from "@/lib/fetch/admin/PUT/UpdatePlan";

export default function EditPlanModal({
  plan,
  disclosure,
}: {
  plan: any;
  disclosure: UseDisclosureReturn;
}) {
  const router = useRouter();

  const { isOpen, onOpenChange, onClose } = disclosure;

  const [price, setPrice] = React.useState(0);
  const [projects, setProjects] = React.useState(0);
  const [projectMembers, setProjectMembers] = React.useState(0);
  const [flows, setFlows] = React.useState(0);
  const [selfHostedRunners, setSelfHostedRunners] = React.useState(0);
  const [alertflowRunners, setAlertflowRunners] = React.useState(0);
  const [executionsPerMonth, setExecutionsPerMonth] = React.useState(0);

  // loading
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    if (plan !== null) {
      setPrice(plan.price);
      setProjects(plan.projects);
      setProjectMembers(plan.project_members);
      setFlows(plan.flows);
      setSelfHostedRunners(plan.self_hosted_runners);
      setAlertflowRunners(plan.alertflow_runners);
      setExecutionsPerMonth(plan.executions_per_month);
    }
  }, [plan]);

  async function editPlan() {
    setIsLoading(true);

    const response = await UpdatePlan(
      plan.id,
      price,
      projects,
      projectMembers,
      flows,
      selfHostedRunners,
      alertflowRunners,
      executionsPerMonth,
    );

    if (response.result === "success") {
      router.refresh();
      onOpenChange();
      setIsLoading(false);
      toast.success("Plan updated successfully");
    } else {
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
              <ModalHeader className="flex flex-wrap items-center justify-center gap-2 font-bold text-warning">
                <Icon icon="solar:planet-broken" width={24} /> Edit Plan
              </ModalHeader>
              <ModalBody>
                <Input
                  isRequired
                  endContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">€</span>
                    </div>
                  }
                  label="Price"
                  max={999}
                  placeholder="Enter the price"
                  type="number"
                  value={price.toString()}
                  variant="bordered"
                  onValueChange={(value) => setPrice(Number(value))}
                />
                <Input
                  isRequired
                  label="Projects"
                  max={999}
                  placeholder="Amount of projects"
                  type="number"
                  value={projects.toString()}
                  variant="bordered"
                  onValueChange={(value) => setProjects(Number(value))}
                />
                <Input
                  isRequired
                  label="Project Members"
                  max={999}
                  placeholder="Amount of project members"
                  type="number"
                  value={projectMembers.toString()}
                  variant="bordered"
                  onValueChange={(value) => setProjectMembers(Number(value))}
                />
                <Input
                  isRequired
                  label="Flows"
                  max={999}
                  placeholder="Amount of flows"
                  type="number"
                  value={flows.toString()}
                  variant="bordered"
                  onValueChange={(value) => setFlows(Number(value))}
                />
                <Input
                  isRequired
                  label="Self-Hosted Runners"
                  max={999}
                  placeholder="Amount of self-hosted runners"
                  type="number"
                  value={selfHostedRunners.toString()}
                  variant="bordered"
                  onValueChange={(value) => setSelfHostedRunners(Number(value))}
                />
                <Input
                  isRequired
                  label="AlertFlow Runners"
                  max={16}
                  placeholder="Amount of alertflow runners"
                  type="number"
                  value={alertflowRunners.toString()}
                  variant="bordered"
                  onValueChange={(value) => setAlertflowRunners(Number(value))}
                />
                <Input
                  isRequired
                  label="Executions Per Month"
                  max={999}
                  placeholder="Amount of executions per month"
                  type="number"
                  value={executionsPerMonth.toString()}
                  variant="bordered"
                  onValueChange={(value) =>
                    setExecutionsPerMonth(Number(value))
                  }
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
                  Update Plan
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
