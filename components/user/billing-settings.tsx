"use client";

import React, { useEffect } from "react";
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

import SetupNewCard from "@/lib/fetch/user/POST/SetupNewCard";
import SetDefaultCard from "@/lib/fetch/user/POST/SetDefaultCard";
import RemoveCard from "@/lib/fetch/user/DELETE/RemoveCard";

import AddPaymentCardModal from "../functions/payment/addCard";
import SelectPlanModal from "../functions/payment/selectPlan";
import CancelSubscriptionModal from "../functions/users/cancelSubscription";

import CellWrapper from "./cell-wrapper";
import SubscriptionOnboarding from "./subscription-onboarding";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export default function BillingSettings({
  user,
  plans,
  paymentMethods,
  subscription,
}: {
  user: any;
  plans: any;
  paymentMethods: any;
  subscription: any;
}) {
  const router = useRouter();
  const addPaymentCardModal = useDisclosure();
  const selectPlanModal = useDisclosure();
  const cancelSubscriptionModal = useDisclosure();

  const [isLoading, setIsLoading] = React.useState(false);
  const [clientSecret, setClientSecret] = React.useState("");
  const [currentSubscription, setCurrentSubscription] = React.useState(
    {} as any,
  );

  useEffect(() => {
    subscription[0] && setCurrentSubscription(subscription[0]);
  });

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
      {user.customer_id === "" ||
      paymentMethods.payment_methods.length === 0 ||
      user.plan === "hobby" ? (
        <>
          <SubscriptionOnboarding
            paymentMethods={paymentMethods}
            plans={plans}
            subscription={subscription}
            user={user}
          />

          <Spacer y={4} />
        </>
      ) : null}

      <div className="grid xl:grid-cols-6 lg:grid-cols-3 grid-cols-2 items-stretch items-start gap-4">
        <Card>
          <CardBody>
            <div className="flex gap-4 items-center justify-start">
              <div className="flex items-center rounded-large justify-center bg-primary bg-opacity-10 w-12 h-12">
                <Icon
                  className="text-primary"
                  icon="solar:cart-large-minimalistic-broken"
                  width={24}
                />
              </div>
              <div>
                <p
                  className={`text-md font-bold text-${user.customer_id ? "success" : "danger"}`}
                >
                  {user.customer_id ? "Yes" : "No"}
                </p>
                <p className="text-sm text-default-500">Customer Account</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex gap-4 items-center justify-start">
              <div className="flex items-center rounded-large justify-center bg-primary bg-opacity-10 w-12 h-12">
                <Icon
                  className="text-primary"
                  icon="solar:planet-broken"
                  width={24}
                />
              </div>
              <div>
                <p className="text-md font-bold capitalize">
                  {currentSubscription.plan
                    ? plans.find(
                        (p: any) => p.stripe_id === currentSubscription.plan.id,
                      )?.name
                    : user.plan}
                </p>
                <p className="text-sm text-default-500">Your Plan</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex gap-4 items-center justify-start">
              <div className="flex items-center rounded-large justify-center bg-primary bg-opacity-10 w-12 h-12">
                <Icon
                  className="text-primary"
                  icon="solar:euro-broken"
                  width={24}
                />
              </div>
              <div>
                <p className="text-md font-bold text-success">
                  {currentSubscription.plan
                    ? (currentSubscription.plan.amount / 100).toFixed(2)
                    : 0}
                  € /{" "}
                  <span className="capitalize">
                    {currentSubscription.plan
                      ? currentSubscription.plan.interval
                      : "month"}
                  </span>
                </p>
                <p className="text-sm text-default-500">Price</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex gap-4 items-center justify-start">
              <div className="flex items-center rounded-large justify-center bg-primary bg-opacity-10 w-12 h-12">
                <Icon
                  className="text-primary"
                  icon="solar:heart-pulse-broken"
                  width={24}
                />
              </div>
              <div>
                <div className="flex flex-cols gap-1">
                  <p
                    className={`text-md font-bold text-${currentSubscription.plan && currentSubscription.plan.active ? "success" : "danger"}`}
                  >
                    {currentSubscription.plan && currentSubscription.plan.active
                      ? "Active"
                      : "Inactive"}
                  </p>
                  {currentSubscription.cancel_at_period_end && (
                    <>
                      <p>&</p>
                      <p className="text-md font-bold text-danger">Canceled</p>
                    </>
                  )}
                </div>
                <p className="text-sm text-default-500">Status</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex gap-4 items-center justify-start">
              <div className="flex items-center rounded-large justify-center bg-primary bg-opacity-10 w-12 h-12">
                <Icon
                  className="text-primary"
                  icon="solar:diploma-broken"
                  width={24}
                />
              </div>
              <div>
                <p className="text-md font-bold">
                  {currentSubscription.start_date
                    ? new Date(
                        currentSubscription.start_date * 1000,
                      ).toLocaleDateString()
                    : "No Date"}
                </p>
                <p className="text-sm text-default-500">Subscription Start</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex gap-4 items-center justify-start">
              <div className="flex items-center rounded-large justify-center bg-primary bg-opacity-10 w-12 h-12">
                <Icon
                  className="text-primary"
                  icon="solar:calendar-date-broken"
                  width={24}
                />
              </div>
              <div>
                <p className="text-md font-bold">
                  {currentSubscription.current_period_start
                    ? new Date(
                        subscription[0].current_period_start * 1000,
                      ).toLocaleDateString()
                    : "No Date"}{" "}
                  -&gt;{" "}
                  {currentSubscription.current_period_end
                    ? new Date(
                        subscription[0].current_period_end * 1000,
                      ).toLocaleDateString()
                    : "No Date"}
                </p>
                <p className="text-sm text-default-500">Current Period</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Spacer y={4} />

      {user.customer_id && (
        <>
          {paymentMethods.payment_methods.length !== 0 && (
            <>
              <Card className="w-full p-2">
                <CardHeader className="flex flex-col items-start px-4 pb-0 pt-4">
                  <p className="text-large">Subscription</p>
                  <p className="text-small text-default-500">
                    Manage your subscription settings.
                  </p>
                </CardHeader>
                <CardBody className="space-y-2">
                  {currentSubscription.plan ? (
                    <>
                      <CellWrapper>
                        <div>
                          <p>Plan</p>
                          <p className="text-small text-default-500">
                            Change your subscription plan.
                          </p>
                        </div>
                        <Button radius="full" variant="bordered">
                          New Plan
                        </Button>
                      </CellWrapper>
                      <CellWrapper>
                        <div>
                          <p>Payment Method</p>
                          <p className="text-small text-default-500">
                            Change the payment method for your subscription.
                          </p>
                        </div>
                        <div className="flex w-full flex-wrap items-center justify-end gap-6 sm:w-auto sm:flex-nowrap">
                          <div className="flex flex-col items-end">
                            <p>
                              <span className="text-default-500">
                                Ends with:
                              </span>{" "}
                              {currentSubscription.plan &&
                                paymentMethods.payment_methods.find(
                                  (pm: any) =>
                                    pm.id ===
                                    currentSubscription.default_payment_method
                                      .id,
                                ).card.last4}
                            </p>
                            <p className="text-small text-success capitalize">
                              {currentSubscription.plan &&
                                paymentMethods.payment_methods.find(
                                  (pm: any) =>
                                    pm.id ===
                                    currentSubscription.default_payment_method
                                      .id,
                                ).card.brand}
                            </p>
                          </div>
                          <Button
                            isDisabled={
                              !currentSubscription.plan ||
                              currentSubscription.cancel_at_period_end
                            }
                            radius="full"
                            variant="bordered"
                          >
                            Change
                          </Button>
                        </div>
                      </CellWrapper>
                      <CellWrapper>
                        <div>
                          <p>Cancel</p>
                          <p className="text-small text-default-500">
                            Cancel your subscription. After canceling, you can
                            still use the service until the end of the current
                            billing period. You can reactivate your subscription
                            at any time. Your will receive the Hobby plan after
                            the end of the current plan period.
                          </p>
                        </div>
                        <Button
                          color="danger"
                          isDisabled={
                            !currentSubscription.plan ||
                            currentSubscription.cancel_at_period_end
                          }
                          radius="full"
                          variant="ghost"
                          onPress={cancelSubscriptionModal.onOpen}
                        >
                          Cancel Subscription
                        </Button>
                      </CellWrapper>
                    </>
                  ) : (
                    <CellWrapper>
                      <div>
                        <p>Subscripte to an Plan</p>
                        <p className="text-small text-default-500">
                          Choose a plan to subscribe.
                        </p>
                      </div>
                      <Button
                        radius="full"
                        variant="bordered"
                        onPress={selectPlanModal.onOpen}
                      >
                        Choose an Plan
                      </Button>
                    </CellWrapper>
                  )}
                </CardBody>
              </Card>

              <Spacer y={4} />
            </>
          )}

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
                          <Icon
                            icon="solar:trash-bin-trash-outline"
                            width={18}
                          />
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
        </>
      )}

      <Elements stripe={stripePromise}>
        <AddPaymentCardModal
          clientSecret={clientSecret}
          disclosure={addPaymentCardModal}
        />
      </Elements>
      <SelectPlanModal disclosure={selectPlanModal} plans={plans} user={user} />
      <CancelSubscriptionModal disclosure={cancelSubscriptionModal} />
    </>
  );
}
