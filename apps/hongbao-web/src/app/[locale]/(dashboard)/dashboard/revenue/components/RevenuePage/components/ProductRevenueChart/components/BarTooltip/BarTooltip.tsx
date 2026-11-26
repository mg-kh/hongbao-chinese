import { TProductBar } from "@/app/[locale]/(dashboard)/dashboard/revenue/components/RevenuePage/components/ProductRevenueChart/useContainer";
import { currencyFormatter } from "@/utils/currencyFormatter";
import { Paper, Text } from "@mantine/core";
import React from "react";

interface Props {
  bar?: TProductBar;
}

const BarTooltip: React.FC<Props> = ({ bar }) => {
  if (!bar) return null;

  return (
    <Paper withBorder shadow="md" radius="md" px="sm" py={8}>
      <Text size="sm" fw={600}>
        {bar.name}
      </Text>
      <Text size="xs" c="dimmed" mb={4}>
        {bar.detail}
      </Text>
      <Text size="sm">{currencyFormatter({ value: bar.revenue })}</Text>
      <Text size="xs" c="dimmed">
        {bar.quantity.toLocaleString()} sold
      </Text>
    </Paper>
  );
};

export default BarTooltip;
