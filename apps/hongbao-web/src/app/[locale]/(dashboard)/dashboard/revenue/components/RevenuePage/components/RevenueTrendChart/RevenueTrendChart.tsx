import { currencyFormatter } from "@/utils/currencyFormatter";
import { AreaChart } from "@mantine/charts";
import { Paper, Skeleton, Stack, Text } from "@mantine/core";
import { TRevenueTrendPoint } from "@/app/[locale]/(dashboard)/dashboard/types/revenue.type";
import { formatCompactAmount } from "@/utils/formatCompactAmount";

interface Props {
  data: TRevenueTrendPoint[];
  isLoading?: boolean;
}

// Y-axis ticks use the compact "18.4M" form so they fit the narrow axis; the
// tooltip still shows the full amount via `valueFormatter`.
// Month buckets arrive as "Nov 2026"; on the axis "Nov '26" is enough (the
// tooltip keeps the full label). Day/week labels ("Nov 21") pass through.
const formatXTick = (label: string) => label.replace(/ \d{2}(\d{2})$/, " '$1");

const RevenueTrendChart: React.FC<Props> = ({ data, isLoading }) => {
  const totalOrders = data.reduce((sum, p) => sum + p.orders, 0);
  const totalEnrollments = data.reduce((sum, p) => sum + p.enrollments, 0);

  return (
    <Paper withBorder radius="lg" p="md">
      <Stack gap="md">
        <div>
          <Text fw={700}>Revenue Trend</Text>
          <Text size="xs" c="dimmed">
            {totalOrders.toLocaleString()} orders ·{" "}
            {totalEnrollments.toLocaleString()} items sold in this period
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
            // minTickGap lets recharts drop ticks that would collide instead
            // of cramming every bucket label onto a narrow axis.
            xAxisProps={{
              tickFormatter: formatXTick,
              minTickGap: 24,
              interval: "preserveStartEnd",
              tickMargin: 8,
            }}
            tooltipAnimationDuration={150}
          />
        )}
      </Stack>
    </Paper>
  );
};

export default RevenueTrendChart;
