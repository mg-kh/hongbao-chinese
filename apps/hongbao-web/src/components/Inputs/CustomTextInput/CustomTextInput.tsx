import { TextInput, TextInputProps } from "@mantine/core";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface Props<T extends FieldValues> extends TextInputProps {
  control: Control<T>;
  name: Path<T>;
}

const CustomTextInput = <T extends FieldValues>({
  control,
  name,
  ...props
}: Props<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        return (
          <TextInput
            {...field}
            value={field.value ?? ""}
            error={fieldState.error?.message}
            placeholder={`Please Enter ${props.label || ""} here...`}
            {...props}
          />
        );
      }}
    />
  );
};

export default CustomTextInput;
