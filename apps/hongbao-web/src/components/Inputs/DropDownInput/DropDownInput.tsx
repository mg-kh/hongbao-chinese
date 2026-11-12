import { Loader, Select, SelectProps } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

type Option = { label: string; value: string };

interface Props<T extends FieldValues> extends SelectProps {
  control: Control<T>;
  name: Path<T>;
  data: Option[];
  isLoading?: boolean;
}

const DropDownInput = <T extends FieldValues>({
  control,
  name,
  data,
  isLoading = false,
  ...props
}: Props<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => {
        return (
          <Select
            {...props}
            value={value}
            data={data}
            onChange={(d) => {
              onChange(d);
            }}
            rightSection={isLoading && <Loader color="blue" size="xs" />}
          />
        );
      }}
    />
  );
};

export default DropDownInput;
