"use client";

import { FormProvider } from "react-hook-form";
import CheckoutSteps from "../CheckoutSteps";
import useContainer from "./useContainer";

interface Props {
  onSubmitted: () => void;
}

const CheckoutStepsContainer: React.FC<Props> = ({ onSubmitted }) => {
  const { form } = useContainer();

  return (
    <FormProvider {...form}>
      <CheckoutSteps onSubmitted={onSubmitted} />
    </FormProvider>
  );
};

export default CheckoutStepsContainer;
