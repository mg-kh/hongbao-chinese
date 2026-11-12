import { Textarea, TextareaProps } from "@mantine/core";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface Props<T extends FieldValues> extends TextareaProps {
  control: Control<T>;
  name: Path<T>;
}

const CustomTextArea = <T extends FieldValues>({
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
          <Textarea
            {...field}
            placeholder={`Please Enter ${props.label || ""} here...`}
            rows={5}
            {...props}
          />
        );
      }}
    />
  );
};

export default CustomTextArea;
