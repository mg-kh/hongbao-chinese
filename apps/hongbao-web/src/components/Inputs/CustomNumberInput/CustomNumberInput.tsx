import { NumberInput, NumberInputProps } from "@mantine/core";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface Props<T extends FieldValues> extends NumberInputProps {
  control: Control<T>;
  name: Path<T>;
}

const CustomNumberInput = <T extends FieldValues>({
  control,
  name,
  ...props
}: Props<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <NumberInput
            {...field}
            placeholder={`Please Enter ${props.label} here...`}
            {...props}
          />
        );
      }}
    />
  );
};

export default CustomNumberInput;
