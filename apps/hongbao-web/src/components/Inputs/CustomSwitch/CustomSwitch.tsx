import { Switch, SwitchProps } from "@mantine/core";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface Props<T extends FieldValues> extends SwitchProps {
  control: Control<T>;
  name: Path<T>;
}

const CustomSwitch = <T extends FieldValues>({
  control,
  name,
  ...props
}: Props<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => {
        return (
          <Switch
            {...props}
            checked={value}
            onChange={(e) => {
              const value = e.currentTarget.checked;
              onChange(value);
            }}
          />
        );
      }}
    />
  );
};

export default CustomSwitch;
