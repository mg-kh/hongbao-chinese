import useApiQuery from "@/hooks/fetching/useApiQuery";
import { DatesRangeValue } from "@mantine/dates";
import dayjs from "dayjs";
import { RevenueGranularity } from "@repo/shared";
import { useState } from "react";
import {
  TRevenueDateRange,
  TRevenueRes,
} from "@/app/[locale]/(dashboard)/dashboard/types/revenue.type";

const today = dayjs();

const DEFAULT_RANGE: TRevenueDateRange = {
  from: today.startOf("month").format("YYYY-MM-DD"),
  to: today.format("YYYY-MM-DD"),
};

export type TGranularityOption = RevenueGranularity | "auto";

export const GRANULARITY_OPTIONS: {
  label: string;
  value: TGranularityOption;
}[] = [
  { label: "Auto", value: "auto" },
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
];

const useContainer = () => {
  const [range, setRange] = useState<TRevenueDateRange>(DEFAULT_RANGE);
  const [granularity, setGranularity] = useState<TGranularityOption>("auto");

  // The picker reports a half-picked range ([start, null]) after the first
  // click, so it needs its own value; the query range only updates once both
  // ends are picked. Clearing falls back to the default range.
  const [pickerValue, setPickerValue] = useState<DatesRangeValue<string>>([
    DEFAULT_RANGE.from,
    DEFAULT_RANGE.to,
  ]);

  const handleRangeChange = (value: DatesRangeValue) => {
    const [from, to] = value;

    if (!from && !to) {
      setPickerValue([DEFAULT_RANGE.from, DEFAULT_RANGE.to]);
      setRange(DEFAULT_RANGE);
      return;
    }

    const next: DatesRangeValue<string> = [
      from ? dayjs(from).format("YYYY-MM-DD") : null,
      to ? dayjs(to).format("YYYY-MM-DD") : null,
    ];
    setPickerValue(next);
    if (next[0] && next[1]) setRange({ from: next[0], to: next[1] });
  };

  // "auto" lets the API pick day/week/month from the range width.
  const params = {
    ...range,
    ...(granularity !== "auto" && { granularity }),
  };

  const { data: revenue, isLoading } = useApiQuery<
    { data: TRevenueRes },
    TRevenueRes
  >({
    url: "dashboard/revenue",
    key: ["dashboard-revenue", range.from, range.to, granularity],
    params,
    select: (res) => res.data,
  });

  return {
    revenue,
    isLoading,
    range,
    pickerValue,
    onRangeChange: handleRangeChange,
    granularity,
    onGranularityChange: (value: string) =>
      setGranularity(value as TGranularityOption),
  };
};

export default useContainer;
