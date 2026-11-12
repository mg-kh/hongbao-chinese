import useApiQuery from "@/hooks/fetching/useApiQuery";
import { DatesRangeValue } from "@mantine/dates";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { TRevenueDateRange, TRevenueRes } from "../../../types/revenue.type";
import { getMockRevenue } from "./mockRevenue";

const today = dayjs();

const DEFAULT_RANGE: TRevenueDateRange = {
  from: today.startOf("month").format("YYYY-MM-DD"),
  to: today.format("YYYY-MM-DD"),
};

export const REVENUE_PRESETS = [
  {
    label: "Today",
    value: [today.format("YYYY-MM-DD"), today.format("YYYY-MM-DD")] as [string, string],
  },
  {
    label: "This Week",
    value: [
      today.startOf("week").format("YYYY-MM-DD"),
      today.format("YYYY-MM-DD"),
    ] as [string, string],
  },
  {
    label: "This Month",
    value: [
      today.startOf("month").format("YYYY-MM-DD"),
      today.format("YYYY-MM-DD"),
    ] as [string, string],
  },
  {
    label: "3 Months",
    value: [
      today.subtract(3, "month").format("YYYY-MM-DD"),
      today.format("YYYY-MM-DD"),
    ] as [string, string],
  },
  {
    label: "6 Months",
    value: [
      today.subtract(6, "month").format("YYYY-MM-DD"),
      today.format("YYYY-MM-DD"),
    ] as [string, string],
  },
  {
    label: "1 Year",
    value: [
      today.subtract(1, "year").format("YYYY-MM-DD"),
      today.format("YYYY-MM-DD"),
    ] as [string, string],
  },
];

const useContainer = () => {
  const [range, setRange] = useState<TRevenueDateRange>(DEFAULT_RANGE);

  const handleRangeChange = (value: DatesRangeValue) => {
    const [from, to] = value;
    if (!from || !to) return;
    setRange({
      from: dayjs(from).format("YYYY-MM-DD"),
      to: dayjs(to).format("YYYY-MM-DD"),
    });
  };

  // TODO(api): backend endpoint isn't built yet. Flip `enabled` to `true`
  // once GET /dashboard/revenue ships, then drop the `?? mockRevenue`
  // fallback below - the response shape already matches TRevenueRes so
  // nothing else in this page needs to change.
  const { data, isLoading } = useApiQuery<TRevenueRes>({
    url: "dashboard/revenue",
    key: ["dashboard-revenue", range.from, range.to],
    params: range,
    enabled: false,
  });

  const mockRevenue = useMemo(() => getMockRevenue(range), [range]);
  const revenue = data ?? mockRevenue;

  return {
    revenue,
    isLoading,
    range,
    onRangeChange: handleRangeChange,
  };
};

export default useContainer;
