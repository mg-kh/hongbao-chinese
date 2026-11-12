import { Link } from "@/i18n/navigation";
import { COURSE_LIST } from "@/constants/DashboardRoutes";
import { Anchor, Group, Paper, Progress, Skeleton, Stack, Text } from "@mantine/core";
import { TTopCourse } from "../../../../types/dashboardOverview.type";

interface Props {
  data: TTopCourse[];
  isLoading?: boolean;
}

const RANK_COLORS = ["hongbao-red", "hongbao-gold", "hongbao-orange", "hongbao-maroon", "hongbao-brown"];

const TopCoursesList: React.FC<Props> = ({ data, isLoading }) => {
  return (
    <Paper withBorder radius="lg" p="md" h="100%">
      <Stack gap="md">
        <Group justify="space-between">
          <Text fw={700}>Top Courses</Text>
          <Anchor component={Link} href={COURSE_LIST} size="xs" fw={600}>
            View all
          </Anchor>
        </Group>

        <Stack gap="sm">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} height={38} radius="sm" />
              ))
            : data.map((course, i) => (
                <Stack key={course.id} gap={4}>
                  <Group justify="space-between" wrap="nowrap" gap="xs">
                    <Text size="sm" fw={500} truncate>
                      {i + 1}. {course.title}
                    </Text>
                    <Text size="sm" c="dimmed" fw={500}>
                      {course.enrollments.toLocaleString()}
                    </Text>
                  </Group>
                  <Progress
                    value={course.fillPct}
                    color={RANK_COLORS[i % RANK_COLORS.length]}
                    size="sm"
                    radius="xl"
                  />
                </Stack>
              ))}
        </Stack>
      </Stack>
    </Paper>
  );
};

export default TopCoursesList;
