"use client";

import CustomBreadCrumb from "@/components/CustomBreadCrumb/CustomBreadCrumb";
import DateRangeInput from "@/components/Inputs/DateRangeInput/DateRangeInput";
import { DASHBOARD, REVENUE } from "@/constants/DashboardRoutes";
import { currencyFormatter } from "@/utils/currencyFormatter";
import { Grid, Group, Stack } from "@mantine/core";
import { IconCoin } from "@tabler/icons-react";
import StatCard from "../../../components/StatCard/StatCard";
import RevenueTrendChart from "./components/RevenueTrendChart/RevenueTrendChart";
import useContainer, { REVENUE_PRESETS } from "./useContainer";

const RevenuePage = () => {
  const { revenue, isLoading, range, onRangeChange } = useContainer();

  return (
    <Stack p={10} gap="lg">
      <Group justify="space-between" align="flex-start" wrap="wrap">
        <CustomBreadCrumb
          title="Revenue"
          links={[
            { label: "Dashboard", href: DASHBOARD, isActive: true },
            { label: "Revenue", href: REVENUE, isActive: false },
          ]}
        />
        <DateRangeInput
          value={[range.from, range.to]}
          onChange={onRangeChange}
          presets={REVENUE_PRESETS}
        />
      </Group>

      <Grid gap="md">
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <StatCard
            label="Total Revenue"
            value={currencyFormatter({ value: revenue.totalRevenue.value })}
            deltaPct={revenue.totalRevenue.deltaPct}
            icon={IconCoin}
            color="hongbao-red"
            isLoading={isLoading}
          />
        </Grid.Col>
      </Grid>

      <RevenueTrendChart data={revenue.trend} isLoading={isLoading} />
    </Stack>
  );
};

export default RevenuePage;
