import { DonutChart } from "@mantine/charts";
import { Center, Group, Paper, Skeleton, Stack, Text } from "@mantine/core";
import { TCategoryBreakdown } from "../../../../types/dashboardOverview.type";

interface Props {
  title: string;
  unitLabel: string;
  data: TCategoryBreakdown[];
  isLoading?: boolean;
}

const CategoryBreakdownChart: React.FC<Props> = ({ title, unitLabel, data, isLoading }) => {
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <Paper withBorder radius="lg" p="md" h="100%">
      <Stack gap="md" h="100%">
        <div>
          <Text fw={700}>{title}</Text>
          <Text size="xs" c="dimmed">
            {total} {unitLabel}
          </Text>
        </div>

        {isLoading ? (
          <Skeleton height={280} radius="md" />
        ) : (
          <>
            <Center>
              <DonutChart
                data={data.map((d) => ({
                  name: d.category,
                  value: d.count,
                  color: d.color,
                }))}
                size={170}
                thickness={26}
                withTooltip
                paddingAngle={2}
              />
            </Center>

            <Stack gap={8} mt={4}>
              {data.map((d) => (
                <Group key={d.category} justify="space-between" wrap="nowrap">
                  <Group gap={8} wrap="nowrap">
                    <span
                      className="inline-block size-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: `var(--mantine-color-${d.color.replace(".", "-")})` }}
                    />
                    <Text size="sm" c="dimmed" truncate>
                      {d.category}
                    </Text>
                  </Group>
                  <Text size="sm" fw={600}>
                    {d.count}
                  </Text>
                </Group>
              ))}
            </Stack>
          </>
        )}
      </Stack>
    </Paper>
  );
};

export default CategoryBreakdownChart;
