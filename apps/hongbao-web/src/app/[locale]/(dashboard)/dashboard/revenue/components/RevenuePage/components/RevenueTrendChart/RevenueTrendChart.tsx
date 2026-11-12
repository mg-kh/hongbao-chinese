import { currencyFormatter } from "@/utils/currencyFormatter";
import { AreaChart } from "@mantine/charts";
import { Paper, Skeleton, Stack, Text } from "@mantine/core";
import { TRevenueTrendPoint } from "../../../../../types/revenue.type";

interface Props {
  data: TRevenueTrendPoint[];
  isLoading?: boolean;
}

/**
 * The y-axis has little horizontal room, so ticks get an abbreviated
 * "18.4M" form instead of the full "18,420,000 MMK" string - which overflows
 * the chart's left edge. The full formatted amount still shows in the
 * tooltip via `valueFormatter` below.
 */
const formatCompactAmount = (value: number) => {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(abs % 1_000_000 === 0 ? 0 : 1)}M`;
  if (abs >= 1_000) return `${(value / 1_000).toFixed(abs % 1_000 === 0 ? 0 : 1)}K`;
  return `${value}`;
};

const RevenueTrendChart: React.FC<Props> = ({ data, isLoading }) => {
  const totalEnrollments = data.reduce((sum, p) => sum + p.enrollments, 0);

  return (
    <Paper withBorder radius="lg" p="md">
      <Stack gap="md">
        <div>
          <Text fw={700}>Revenue Trend</Text>
          <Text size="xs" c="dimmed">
            {totalEnrollments.toLocaleString()} enrollments in this period
          </Text>
        </div>

        {isLoading ? (
          <Skeleton height={360} radius="md" />
        ) : (
          <AreaChart
            h={360}
            data={data}
            dataKey="label"
            series={[{ name: "revenue", color: "hongbao-red.5" }]}
            curveType="monotone"
            withGradient
            gridAxis="y"
            valueFormatter={(value) => currencyFormatter({ value })}
            yAxisProps={{ tickFormatter: formatCompactAmount, width: 56 }}
            tooltipAnimationDuration={150}
          />
        )}
      </Stack>
    </Paper>
  );
};

export default RevenueTrendChart;
