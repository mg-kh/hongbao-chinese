import {
  DateInput,
  DateInputProps,
  DateTimePicker,
  DateTimePickerProps,
} from "@mantine/dates";
import "@mantine/dates/styles.css";
import { CalendarDotsIcon } from "@phosphor-icons/react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface Props<T extends FieldValues> extends DateTimePickerProps {
  control: Control<T>;
  name: Path<T>;
  /** Show the time picker part. Set to `false` for a date-only input. @default true */
  withTime?: boolean;
}

const CustomDateTimeInput = <T extends FieldValues>({
  control,
  name,
  withTime = true,
  valueFormat,
  ...props
}: Props<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, ...field } }) => {
        const sharedProps = {
          ...field,
          value: value ?? null,
          onChange: (d: string | null) => onChange(d),
          placeholder: `Please Select ${props.label || ""} here...`,
          clearable: true,
          highlightToday: true,
          rightSection: <CalendarDotsIcon />,
        };

        return withTime ? (
          <DateTimePicker
            {...sharedProps}
            {...props}
            valueFormat={
              typeof valueFormat === "string" ? valueFormat : "DD-MM-YYYY HH:mm"
            }
          />
        ) : (
          <DateInput
            {...sharedProps}
            {...(props as unknown as DateInputProps)}
            valueFormat={
              typeof valueFormat === "string" ? valueFormat : "DD-MM-YYYY"
            }
          />
        );
      }}
    />
  );
};

export default CustomDateTimeInput;
