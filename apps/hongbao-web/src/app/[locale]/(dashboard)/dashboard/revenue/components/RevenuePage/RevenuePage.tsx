"use client";

import CustomBreadCrumb from "@/components/CustomBreadCrumb/CustomBreadCrumb";
import DateRangeInput from "@/components/Inputs/DateRangeInput/DateRangeInput";
import { DASHBOARD, REVENUE } from "@/constants/DashboardRoutes";
import { currencyFormatter } from "@/utils/currencyFormatter";
import { Grid, Group, SegmentedControl, Stack } from "@mantine/core";
import { IconCoin, IconReceipt } from "@tabler/icons-react";
import StatCard from "@/app/[locale]/(dashboard)/dashboard/components/StatCard/StatCard";
import ProductRevenueChart from "@/app/[locale]/(dashboard)/dashboard/revenue/components/RevenuePage/components/ProductRevenueChart/ProductRevenueChart";
import RevenueTrendChart from "@/app/[locale]/(dashboard)/dashboard/revenue/components/RevenuePage/components/RevenueTrendChart/RevenueTrendChart";
import useContainer, {
  GRANULARITY_OPTIONS,
  REVENUE_PRESETS,
} from "@/app/[locale]/(dashboard)/dashboard/revenue/components/RevenuePage/useContainer";

const RevenuePage = () => {
  const {
    revenue,
    isLoading,
    pickerValue,
    onRangeChange,
    granularity,
    onGranularityChange,
  } = useContainer();

  const loading = isLoading || !revenue;

  return (
    <Stack p={10} pb={40} gap="lg">
      <Group justify="space-between" align="flex-start" wrap="wrap">
        <CustomBreadCrumb
          title="Revenue"
          links={[
            { label: "Dashboard", href: DASHBOARD, isActive: true },
            { label: "Revenue", href: REVENUE, isActive: false },
          ]}
        />
        <DateRangeInput
          value={pickerValue}
          onChange={onRangeChange}
          presets={REVENUE_PRESETS}
        />
      </Group>

      <Grid gap="md">
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <StatCard
            label="Total Revenue"
            value={currencyFormatter({ value: revenue?.totalRevenue.value })}
            deltaPct={revenue?.totalRevenue.deltaPct ?? 0}
            icon={IconCoin}
            color="hongbao-red"
            isLoading={loading}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <StatCard
            label="Orders"
            value={(revenue?.orderCount.value ?? 0).toLocaleString()}
            deltaPct={revenue?.orderCount.deltaPct ?? 0}
            icon={IconReceipt}
            color="blue"
            isLoading={loading}
          />
        </Grid.Col>
      </Grid>

      <ProductRevenueChart
        rows={revenue?.byProduct ?? []}
        isLoading={loading}
      />

      <Stack gap="xs">
        <Group justify="flex-end">
          <SegmentedControl
            size="xs"
            data={GRANULARITY_OPTIONS}
            value={granularity}
            onChange={onGranularityChange}
          />
        </Group>
        <RevenueTrendChart data={revenue?.trend ?? []} isLoading={loading} />
      </Stack>
    </Stack>
  );
};

export default RevenuePage;
