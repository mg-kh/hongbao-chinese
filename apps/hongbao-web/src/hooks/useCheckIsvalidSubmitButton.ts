import { FieldValues, UseFormReturn } from "react-hook-form";

interface Props<T extends FieldValues> {
  form: UseFormReturn<T>;
  isPending?: boolean;
}
const useCheckIsvalidSubmitButton = <T extends FieldValues>({
  form,
  isPending,
}: Props<T>): { isValid: boolean } => {
  return {
    isValid: form.formState.isValid && form.formState.isDirty && !isPending,
  };
};

export default useCheckIsvalidSubmitButton;
