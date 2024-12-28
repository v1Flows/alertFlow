"use client";

import type { UseDisclosureReturn } from "@nextui-org/use-disclosure";

import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

import CancelSubscription from "@/lib/fetch/user/PUT/cancelSubscription";
import ErrorCard from "@/components/error/ErrorCard";

export default function CancelSubscriptionModal({
  disclosure,
}: {
  disclosure: UseDisclosureReturn;
}) {
  const router = useRouter();
  const { isOpen, onOpenChange } = disclosure;

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [errorText, setErrorText] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  async function cancelSubscription() {
    setIsLoading(true);
    const response = (await CancelSubscription()) as any;

    if (!response) {
      setIsLoading(false);
      setError(true);
      setErrorText("Failed to cancel subscription");
      setErrorMessage("Failed to cancel subscription");
      toast.error("Failed to cancel subscription");

      return;
    }

    if (response.success) {
      setIsLoading(false);
      setError(false);
      setErrorText("");
      setErrorMessage("");
      router.refresh();
      onOpenChange();
      toast.success("Your subscription has been cancelled");
    } else {
      setIsLoading(false);
      setError(true);
      setErrorText(response.error);
      setErrorMessage(response.message);
      toast.error("Failed to cancel subscription");
    }
  }

  return (
    <>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        placement="center"
        size="lg"
        onOpenChange={onOpenChange}
      >
        <ModalContent className="w-full">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-wrap items-center">
                <div className="flex flex-col gap-2">
                  <p className="text-lg font-bold">Are you sure?</p>
                  <p className="text-sm text-default-500">
                    You are about to cancel your subscription and will be
                    downgraded to the free Hobby plan after your current period
                    ended.
                  </p>
                </div>
              </ModalHeader>
              <ModalBody>
                {error && (
                  <ErrorCard error={errorText} message={errorMessage} />
                )}
                Your current subscription will be cancelled and you will remain
                till the end of your current billing period. After that, you
                will be downgraded to the free Hobby plan.
                <Divider />
                <div>
                  <p className="text-lg font-bold text-warning">Caution!</p>
                  <p className="font-bold">
                    Projects and Flows exceeding the free plan limits will be
                    disabled. You can always upgrade your plan to re-enable
                    them.
                  </p>
                </div>
              </ModalBody>
              <ModalFooter className="grid grid-cols-2">
                <Button color="default" variant="ghost" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  isLoading={isLoading}
                  variant="solid"
                  onPress={cancelSubscription}
                >
                  Cancel Subscription
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
