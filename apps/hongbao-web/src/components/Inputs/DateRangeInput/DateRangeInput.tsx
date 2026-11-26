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

const fmt = (d: Dayjs) => d.format("YYYY-MM-DD");

// Shared presets for every date-range filter in the app. Built per render so
// "today" stays correct if the page is left open past midnight.
const getDefaultPresets = (
  today: Dayjs,
): DatePickerInputProps<"range">["presets"] => [
  { label: "Today", value: [fmt(today), fmt(today)] },
  { label: "This Week", value: [fmt(today.startOf("week")), fmt(today)] },
  { label: "This Month", value: [fmt(today.startOf("month")), fmt(today)] },
  { label: "3 Months", value: [fmt(today.subtract(3, "month")), fmt(today)] },
  { label: "6 Months", value: [fmt(today.subtract(6, "month")), fmt(today)] },
  { label: "1 Year", value: [fmt(today.subtract(1, "year")), fmt(today)] },
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
