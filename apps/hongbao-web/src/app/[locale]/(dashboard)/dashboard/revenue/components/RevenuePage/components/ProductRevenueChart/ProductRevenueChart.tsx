import BarTooltip from "@/app/[locale]/(dashboard)/dashboard/revenue/components/RevenuePage/components/ProductRevenueChart/components/BarTooltip/BarTooltip";
import useContainer, {
  TProductBar,
} from "@/app/[locale]/(dashboard)/dashboard/revenue/components/RevenuePage/components/ProductRevenueChart/useContainer";
import { TRevenueProductRow } from "@/app/[locale]/(dashboard)/dashboard/types/revenue.type";
import { currencyFormatter } from "@/utils/currencyFormatter";
import { formatCompactAmount } from "@/utils/formatCompactAmount";
import { BarChart } from "@mantine/charts";
import { Paper, Skeleton, Text } from "@mantine/core";
import { IconChartBarOff } from "@tabler/icons-react";
import React from "react";

interface Props {
  rows: TRevenueProductRow[];
  isLoading?: boolean;
}

const ProductRevenueChart: React.FC<Props> = ({ rows, isLoading }) => {
  const { bars, chartHeight, truncateName } = useContainer(rows);

  return (
    <Paper withBorder radius="lg" p="md">
      <div className="flex flex-col gap-4">
        <div>
          <Text fw={700}>Revenue by Product</Text>
          <Text size="xs" c="dimmed">
            At list price when purchased. Coupon discounts aren&apos;t
            subtracted, so this can be higher than Total Revenue.
          </Text>
        </div>

        {isLoading ? (
          <Skeleton height={240} radius="md" />
        ) : bars.length === 0 ? (
          <div className="flex flex-col items-center gap-2.5 py-11">
            <IconChartBarOff size={26} stroke={1.6} className="text-gray-400" />
            <Text size="sm" c="dimmed" fw={500}>
              No approved orders in this period
            </Text>
          </div>
        ) : (
          <BarChart
            h={chartHeight}
            data={bars}
            dataKey="name"
            orientation="vertical"
            series={[
              { name: "revenue", label: "Revenue", color: "hongbao-red.5" },
            ]}
            gridAxis="x"
            maxBarWidth={22}
            barProps={{ radius: [0, 4, 4, 0] }}
            withBarValueLabel
            valueLabelProps={{
              position: "right",
              formatter: (value: unknown) => formatCompactAmount(Number(value)),
            }}
            valueFormatter={(value) => currencyFormatter({ value })}
            xAxisProps={{ tickFormatter: formatCompactAmount }}
            yAxisProps={{ width: 190, tickFormatter: truncateName }}
            tooltipProps={{
              content: ({ payload }) => (
                <BarTooltip
                  bar={payload?.[0]?.payload as TProductBar | undefined}
                />
              ),
            }}
            tooltipAnimationDuration={150}
          />
        )}
      </div>
    </Paper>
  );
};

export default ProductRevenueChart;
