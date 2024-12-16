"use client";
import type { UseDisclosureReturn } from "@nextui-org/use-disclosure";
import type { StripeCardElement } from "@stripe/stripe-js";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function AddPaymentCardModal({
  clientSecret,
  disclosure,
}: {
  clientSecret: string;
  disclosure: UseDisclosureReturn;
}) {
  const router = useRouter();
  const { isOpen, onOpenChange, onClose } = disclosure;

  const [isLoading, setIsLoading] = useState(false);

  const { theme } = useTheme();
  const stripe = useStripe();
  const elements = useElements();

  async function handleAddCard() {
    setIsLoading(true);
    // Handle adding card
    const cardElement = elements?.getElement(CardElement) as StripeCardElement;

    const confirm = await stripe?.confirmCardSetup(clientSecret, {
      payment_method: {
        card: cardElement!,
      },
    });

    if (confirm?.error) {
      toast.error(confirm.error.message);
      setIsLoading(false);

      return;
    }

    router.refresh();
    toast.success("Card added successfully");
    setIsLoading(false);
    onClose();
    cardElement?.clear();
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
                  <p className="text-lg font-bold">Add new Credit Card</p>
                  <p className="text-sm text-default-500">
                    Edit the plan details below and click apply changes to save.
                  </p>
                </div>
              </ModalHeader>
              <ModalBody className="mb-4">
                <CardElement
                  options={{
                    style: {
                      base: {
                        color: theme === "dark" ? "#ffffff" : "#000000",
                        fontSize: "16px",
                        fontFamily: "Helvetica, Arial, sans-serif",
                        "::placeholder": {
                          color: theme === "dark" ? "#ffffff" : "#000000",
                        },
                      },
                      invalid: {
                        color: "#ff0000",
                      },
                    },
                  }}
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="secondary"
                  isLoading={isLoading}
                  variant="flat"
                  onPress={handleAddCard}
                >
                  Add Card
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
