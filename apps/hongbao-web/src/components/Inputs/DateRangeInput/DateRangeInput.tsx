import { Indicator } from "@mantine/core";
import {
  DatePickerInput,
  DatePickerInputProps,
  DatesRangeValue,
} from "@mantine/dates";
import "@mantine/dates/styles.css";
import { CalendarDotsIcon } from "@phosphor-icons/react";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";

interface Props extends Omit<DatePickerInputProps<"range">, "type" | "onChange"> {
  onChange?: (value: DatesRangeValue) => void;
}

const dayRenderer: DatePickerInputProps<"range">["renderDay"] = (date) => {
  const day = dayjs(date).date();

  return (
    <Indicator size={6} color="hongbao-red.2" disabled={day !== dayjs().date()}>
      <div>{day}</div>
    </Indicator>
  );
};

const getDefaultPresets = (today: Dayjs): DatePickerInputProps<"range">["presets"] => [
  {
    value: [today.format("YYYY-MM-DD"), today.format("YYYY-MM-DD")],
    label: "Today",
  },
  {
    value: [
      today.subtract(2, "day").format("YYYY-MM-DD"),
      today.format("YYYY-MM-DD"),
    ],
    label: "Last two days",
  },
  {
    value: [
      today.subtract(7, "day").format("YYYY-MM-DD"),
      today.format("YYYY-MM-DD"),
    ],
    label: "Last 7 days",
  },
  {
    value: [
      today.startOf("month").format("YYYY-MM-DD"),
      today.format("YYYY-MM-DD"),
    ],
    label: "This month",
  },
  {
    value: [
      today.subtract(1, "month").startOf("month").format("YYYY-MM-DD"),
      today.subtract(1, "month").endOf("month").format("YYYY-MM-DD"),
    ],
    label: "Last month",
  },
  {
    value: [
      today.subtract(1, "year").startOf("year").format("YYYY-MM-DD"),
      today.subtract(1, "year").endOf("year").format("YYYY-MM-DD"),
    ],
    label: "Last year",
  },
];

const DateRangeInput: React.FC<Props> = ({ onChange, value, presets, ...props }) => {
  const [internalValue, setInternalValue] = useState<DatesRangeValue>([null, null]);

  const today = dayjs();
  const resolvedValue = value ?? internalValue;

  return (
    <DatePickerInput
      {...props}
      type="range"
      value={resolvedValue}
      onChange={(v: DatesRangeValue) => {
        setInternalValue(v);
        onChange?.(v);
      }}
      placeholder="Select date"
      valueFormat="DD-MM-YYYY"
      maxDate={new Date()}
      clearable
      w={{ base: "100%", sm: 250 }}
      renderDay={dayRenderer}
      presets={presets ?? getDefaultPresets(today)}
      rightSection={<CalendarDotsIcon />}
    />
  );
};

export default DateRangeInput;
