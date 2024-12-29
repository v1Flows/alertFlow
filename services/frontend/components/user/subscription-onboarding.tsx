"use client";

import { Icon } from "@iconify/react";
import {
  Card,
  CardBody,
  CardHeader,
  CircularProgress,
  Listbox,
  ListboxItem,
  Progress,
  useDisclosure,
} from "@nextui-org/react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

import SetupNewCard from "@/lib/fetch/user/POST/SetupNewCard";
import CreateCustomer from "@/lib/fetch/user/POST/CreateCustomer";

import AddPaymentCardModal from "../functions/payment/addCard";
import SelectPlanModal from "../functions/payment/selectPlan";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export default function SubscriptionOnboarding({
  user,
  plans,
  subscription,
  paymentMethods,
}: any) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const addPaymentCardModal = useDisclosure();
  const selectPlanModal = useDisclosure();

  const [clientSecret, setClientSecret] = React.useState("");
  const [items, setItems] = React.useState([
    {
      key: "create-customer-account",
      icon: "solar:user-plus-linear",
      title: "Create an customer account",
      description:
        "Create an customer account in order to start subscriping to our plans.",
      isCompleted: false,
      dependencies: [],
    },
    {
      key: "add-payment-method",
      icon: "solar:wallet-money-broken",
      title: "Add an payment method",
      description: "Link an credit card to your account.",
      isCompleted: false,
      dependencies: ["create-customer-account"],
    },
    {
      key: "set-default-card",
      icon: "solar:card-search-broken",
      title: "Set default card",
      description: "Set your default card to be used for your subscription.",
      isCompleted: false,
      dependencies: ["add-payment-method"],
    },
    {
      key: "choose-plan",
      icon: "solar:planet-broken",
      title: "Choose a plan",
      description:
        "Choose a plan that fits your needs and start your subscription.",
      isCompleted: false,
      dependencies: ["set-default-card"],
    },
  ]);

  useEffect(() => {
    if (user.customer_id !== "") {
      // set isCompleted to true
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.key === "create-customer-account"
            ? { ...item, isCompleted: true }
            : item,
        ),
      );
    }

    if (
      paymentMethods.payment_methods &&
      paymentMethods.payment_methods.length > 0
    ) {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.key === "add-payment-method"
            ? { ...item, isCompleted: true }
            : item,
        ),
      );
    }

    if (user && user.default_card) {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.key === "set-default-card"
            ? { ...item, isCompleted: true }
            : item,
        ),
      );
    }

    if (subscription[0]) {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.key === "choose-plan" ? { ...item, isCompleted: true } : item,
        ),
      );
    }
  }, [user, subscription, paymentMethods.payment_methods]);

  async function handleCreateCustomer() {
    setIsLoading(true);
    const res = (await CreateCustomer()) as any;

    if (!res.success) {
      toast.error(res.error);
      setIsLoading(false);

      return;
    }
    router.refresh();
    setIsLoading(false);
    toast.success("Successfully created customer account");
  }

  async function handleNewPaymentCard() {
    setIsLoading(true);
    const res = await SetupNewCard();

    if (!res.success || res.data.client_secret === "") {
      toast.error("Failed to create payment intent");
      setIsLoading(false);

      return;
    }
    setClientSecret(res.data.client_secret);
    setIsLoading(false);

    addPaymentCardModal.onOpenChange();
  }

  function handleSetDefaultCard() {
    toast.info("Set the default card in the below Payment Methods section");
  }

  return (
    <>
      <Card className="py-1 md:py-4">
        <CardHeader className="flex items-center gap-3 px-4 pb-0 pt-3 md:px-10 md:pt-5">
          <div className="flex size-14 flex-none items-center justify-center rounded-full bg-gradient-to-br from-secondary-300 to-primary-500">
            <Icon
              className="text-white"
              icon="solar:skateboarding-line-duotone"
              width={30}
            />
          </div>
          <Progress
            showValueLabel
            classNames={{
              label: "font-medium",
              indicator: "bg-gradient-to-r from-primary-400 to-secondary-500",
              value: "text-foreground/60",
            }}
            label="Subscription onboarding"
            value={
              (items.filter((item) => item.isCompleted).length / items.length) *
              100
            }
          />
        </CardHeader>
        <CardBody className="px-1 pt-3 sm:px-2 md:px-6">
          <Listbox
            hideSelectedIcon
            aria-label="Onboarding checklist"
            items={items}
            variant="flat"
          >
            {(item) => (
              <ListboxItem
                key={item.key}
                classNames={{
                  base: "w-full px-2 md:px-4 min-h-[70px] gap-3",
                  title: "text-medium font-medium",
                  description: "text-small",
                }}
                description={item.description}
                endContent={
                  <div className="flex flex-none items-center gap-2">
                    {isLoading && (
                      <CircularProgress aria-label="Loading..." size="sm" />
                    )}
                    {item.isCompleted ? (
                      <Icon
                        className="text-secondary"
                        icon="solar:check-circle-bold"
                        width={30}
                      />
                    ) : (
                      <Icon
                        className="text-default-400"
                        icon="solar:round-alt-arrow-right-bold"
                        width={30}
                      />
                    )}
                  </div>
                }
                startContent={
                  <div className="item-center flex rounded-medium border border-divider p-2">
                    <Icon
                      className="text-secondary"
                      icon={item.icon}
                      width={24}
                    />
                  </div>
                }
                title={item.title}
                onPress={() => {
                  if (
                    !item.isCompleted &&
                    item.key === "create-customer-account"
                  ) {
                    handleCreateCustomer();
                  }
                  if (!item.isCompleted && item.key === "add-payment-method") {
                    handleNewPaymentCard();
                  }
                  if (!item.isCompleted && item.key === "set-default-card") {
                    handleSetDefaultCard();
                  }
                  if (!item.isCompleted && item.key === "choose-plan") {
                    selectPlanModal.onOpenChange();
                  }
                }}
              />
            )}
          </Listbox>
        </CardBody>
      </Card>
      <Elements stripe={stripePromise}>
        <AddPaymentCardModal
          clientSecret={clientSecret}
          disclosure={addPaymentCardModal}
        />
      </Elements>
      <SelectPlanModal disclosure={selectPlanModal} plans={plans} user={user} />
    </>
  );
}
