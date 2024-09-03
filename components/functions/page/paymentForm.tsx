"use client";

import { Button, Spacer } from "@nextui-org/react";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useState } from "react";

export default function PaymentForm({
  amount,
  clientSecret,
}: {
  amount: number;
  clientSecret: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [loading, setLoading] = useState(false);

  // eslint-disable-next-line no-undef
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);

      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `http://localhost:3000/payment-success?amount=${amount}`,
      },
    });

    if (error) {
      // This point is only reached if there's an immediate error when
      // confirming the payment. Show the error to your customer (for example, payment details incomplete)
      setErrorMessage(error.message);
    } else {
      // The payment UI automatically closes with a success animation.
      // Your customer is redirected to your `return_url`.
    }

    setLoading(false);
  };

  return (
    <form onSubmit={onSubmit}>
      <PaymentElement />
      <Spacer y={2} />
      {errorMessage && <div>{errorMessage}</div>}
      <Spacer y={2} />
      <Button
        fullWidth
        color="secondary"
        isLoading={loading}
        type="submit"
        variant="solid"
      >
        Pay
      </Button>
    </form>
  );
}
