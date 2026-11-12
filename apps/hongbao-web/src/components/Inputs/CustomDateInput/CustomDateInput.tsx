import { DateInput, DateInputProps } from "@mantine/dates";
import "@mantine/dates/styles.css";
import { CalendarDotsIcon } from "@phosphor-icons/react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface Props<T extends FieldValues> extends DateInputProps {
  control: Control<T>;
  name: Path<T>;
}

const CustomDateInput = <T extends FieldValues>({
  control,
  name,
  ...props
}: Props<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, ...field } }) => {
        return (
          <DateInput
            {...field}
            value={value ?? null}
            onChange={(d) => onChange(d)}
            placeholder={`Please Select ${props.label || ""} here...`}
            valueFormat="DD-MM-YYYY"
            clearable
            rightSection={<CalendarDotsIcon />}
            {...props}
          />
        );
      }}
    />
  );
};

export default CustomDateInput;
