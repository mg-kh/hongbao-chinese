import { pluralize } from "@/utils/pluralize";
import { PURCHASES_PENDING } from "@/constants/DashboardRoutes";
import { Link } from "@/i18n/navigation";
import { Button, Group, Paper, Text, ThemeIcon } from "@mantine/core";
import { IconClockHour4 } from "@tabler/icons-react";

interface Props {
  pendingCount: number;
}

const PendingApprovalBanner: React.FC<Props> = ({ pendingCount }) => {
  if (pendingCount <= 0) return null;

  return (
    <Paper
      radius="lg"
      p="md"
      style={{
        background:
          "linear-gradient(135deg, var(--mantine-color-yellow-0), var(--mantine-color-hongbao-cream-1))",
        border: "1px solid var(--mantine-color-yellow-3)",
      }}
    >
      <Group justify="space-between" wrap="wrap">
        <Group gap="sm" wrap="nowrap">
          <ThemeIcon variant="light" color="yellow" size={38} radius="md">
            <IconClockHour4 size={20} stroke={1.75} />
          </ThemeIcon>
          <div>
            <Text fw={700} size="sm">
              {pluralize(pendingCount, "purchase")} awaiting approval
            </Text>
            <Text size="xs" c="dimmed">
              Review pending course purchases before students lose access.
            </Text>
          </div>
        </Group>

        <Button component={Link} href={PURCHASES_PENDING} color="yellow" variant="filled" size="xs">
          Review now
        </Button>
      </Group>
    </Paper>
  );
};

export default PendingApprovalBanner;
