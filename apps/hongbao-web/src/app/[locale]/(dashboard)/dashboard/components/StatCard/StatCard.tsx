import { Link } from "@/i18n/navigation";
import { Group, Paper, Skeleton, Stack, Text, ThemeIcon } from "@mantine/core";
import { IconArrowDownRight, IconArrowUpRight } from "@tabler/icons-react";
import type { Icon } from "@tabler/icons-react";

interface Props {
  label: string;
  value: string;
  deltaPct: number;
  icon: Icon;
  color: string;
  isLoading?: boolean;
  /** Makes the card clickable, linking through to a more detailed report page. */
  href?: string;
}

const StatCard: React.FC<Props> = ({
  label,
  value,
  deltaPct,
  icon: IconComp,
  color,
  isLoading,
  href,
}) => {
  const isUp = deltaPct >= 0;

  const card = (
    <Paper
      withBorder
      radius="lg"
      p="md"
      className={`transition-shadow duration-200 hover:shadow-md ${href ? "cursor-pointer" : ""}`}
    >
      {isLoading ? (
        <Stack gap={10}>
          <Skeleton height={34} width={34} circle />
          <Skeleton height={12} width="60%" />
          <Skeleton height={22} width="45%" />
        </Stack>
      ) : (
        <Stack gap={6}>
          <Group justify="space-between" align="flex-start">
            <ThemeIcon
              variant="light"
              color={color}
              size={38}
              radius="md"
            >
              <IconComp size={20} stroke={1.75} />
            </ThemeIcon>

            {deltaPct !== 0 && (
              <Group
                gap={2}
                className={
                  isUp ? "text-emerald-600" : "text-hongbao-red-600"
                }
              >
                {isUp ? (
                  <IconArrowUpRight size={15} stroke={2.5} />
                ) : (
                  <IconArrowDownRight size={15} stroke={2.5} />
                )}
                <Text size="xs" fw={700} inherit>
                  {Math.abs(deltaPct).toFixed(1)}%
                </Text>
              </Group>
            )}
          </Group>

          <Text size="xs" c="dimmed" fw={500} mt={4}>
            {label}
          </Text>
          <Text size="xl" fw={700} lh={1.2}>
            {value}
          </Text>
        </Stack>
      )}
    </Paper>
  );

  return href ? (
    <Link href={href} className="block">
      {card}
    </Link>
  ) : (
    card
  );
};

export default StatCard;
