"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  useDisclosure,
  Spacer,
  Chip,
  ButtonGroup,
} from "@nextui-org/react";
import { toast } from "sonner";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

import SetupNewCard from "@/lib/fetch/payment/SetupNewCard";
import SetDefaultCard from "@/lib/fetch/payment/SetDefaultCard";
import RemoveCard from "@/lib/fetch/payment/RemoveCard";

import AddPaymentCardModal from "../functions/payment/addCard";

import CellWrapper from "./cell-wrapper";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export default function BillingSettings({
  user,
  paymentMethods,
}: {
  user: any;
  paymentMethods: any;
}) {
  const router = useRouter();
  const addPaymentCardModal = useDisclosure();

  const [isLoading, setIsLoading] = React.useState(false);
  const [clientSecret, setClientSecret] = React.useState("");

  async function handleNewPaymentCard() {
    setIsLoading(true);
    const res = await SetupNewCard();

    if (res.client_secret === "" || res.error) {
      toast.error("Failed to create payment intent");
      setIsLoading(false);

      return;
    }
    setClientSecret(res.client_secret);
    setIsLoading(false);

    addPaymentCardModal.onOpenChange();
  }

  const cardBrandBackground = (brand: string) => {
    switch (brand) {
      case "visa":
        return "bg-blue-500";
      case "mastercard":
        return "bg-red-500";
      case "amex":
        return "bg-blue-500";
      case "discover":
        return "bg-orange-500";
      case "diners":
        return "bg-green-500";
      case "jcb":
        return "bg-blue-500";
      case "unionpay":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  async function handleSetDefaultPaymentMethod(cardID: string) {
    const res = await SetDefaultCard(cardID);

    if (res.error) {
      toast.error(res.error);

      return;
    }
    router.refresh();
    toast.success("Successfully set default card");
  }

  async function handleDeletePaymentMethod(cardID: string) {
    const res = await RemoveCard(cardID);

    if (res.error) {
      toast.error(res.message);

      return;
    }
    router.refresh();
    toast.success("Successfully deleted");
  }

  return (
    <>
      <Card className="w-full p-2">
        <CardHeader className="flex flex-col items-start px-4 pb-0 pt-4">
          <p className="text-large">Billing Settings</p>
          <p className="text-small text-default-500">
            Manage your subscription/billing settings.
          </p>
        </CardHeader>
        <CardBody className="space-y-2">
          {/* Customer ID */}
          <CellWrapper>
            <div>
              <p>Customer ID</p>
              <p className="text-small text-default-500">
                Your unique customer ID if you have an subscription.
              </p>
            </div>
            <div className="flex w-full flex-wrap items-center justify-end gap-6 sm:w-auto sm:flex-nowrap">
              <div className="flex flex-col items-end">
                <p>{user.customer_id}</p>
              </div>
            </div>
          </CellWrapper>
        </CardBody>
      </Card>

      <Spacer y={4} />

      <Card className="w-full p-2">
        <CardHeader className="flex flex-cols items-center justify-between px-4 pb-0 pt-4">
          <div>
            <p className="text-large">Payment Methods</p>
            <p className="text-small text-default-500">
              Manage your credit cards.
            </p>
          </div>
          <Button
            isLoading={isLoading}
            radius="sm"
            variant="bordered"
            onPress={() => {
              handleNewPaymentCard();
            }}
          >
            Add new Card
          </Button>
        </CardHeader>
        <CardBody className="space-y-2">
          {paymentMethods.payment_methods.map((method: any) => (
            <CellWrapper key={method.id}>
              <div className="flex items-center gap-2">
                <div
                  className={`flex items-center rounded-large justify-center ${cardBrandBackground(method.card.brand)} w-10 h-10`}
                >
                  <Icon icon="solar:card-2-broken" width={24} />
                </div>
                <div>
                  <div className="flex flex-cols items-center gap-2">
                    <p className="capitalize">{method.card.brand}</p>
                    {user.default_card === method.id && (
                      <Chip
                        color="success"
                        size="sm"
                        startContent={
                          <Icon icon="solar:check-read-broken" width={20} />
                        }
                        variant="flat"
                      >
                        <span className="font-medium">Default</span>
                      </Chip>
                    )}
                  </div>
                  <p className="text-small text-default-500">
                    Ends with: {method.card.last4}
                  </p>
                </div>
              </div>
              <div className="flex flex-cols items-center gap-4">
                <div className="flex w-full flex-wrap items-center justify-end gap-6 sm:w-auto sm:flex-nowrap">
                  <div className="flex flex-col items-end">
                    <p>
                      {method.card.exp_month}/{method.card.exp_year}
                    </p>
                  </div>
                </div>
                <ButtonGroup size="sm">
                  <Button
                    isDisabled={user.default_card === method.id}
                    startContent={
                      <Icon icon="solar:check-read-broken" width={18} />
                    }
                    variant="flat"
                    onPress={() => {
                      handleSetDefaultPaymentMethod(method.id);
                    }}
                  >
                    Set Default
                  </Button>
                  <Button
                    color="danger"
                    startContent={
                      <Icon icon="solar:trash-bin-2-broken" width={18} />
                    }
                    variant="flat"
                    onPress={() => {
                      handleDeletePaymentMethod(method.id);
                    }}
                  >
                    Delete
                  </Button>
                </ButtonGroup>
              </div>
            </CellWrapper>
          ))}
        </CardBody>
      </Card>
      <Elements stripe={stripePromise}>
        <AddPaymentCardModal
          clientSecret={clientSecret}
          disclosure={addPaymentCardModal}
        />
      </Elements>
    </>
  );
}
