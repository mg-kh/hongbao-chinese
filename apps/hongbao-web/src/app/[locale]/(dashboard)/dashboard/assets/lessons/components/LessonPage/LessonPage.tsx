import CustomBreadCrumb from "@/components/CustomBreadCrumb/CustomBreadCrumb";
import CustomTable from "@/components/CustomTable/CustomTable";
import DropDownInput from "@/components/Inputs/DropDownInput/DropDownInput";
import { DASHBOARD } from "@/constants/DashboardRoutes";
import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Group,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { FunnelIcon } from "@phosphor-icons/react";
import { IconPencil, IconPlus } from "@tabler/icons-react";
import { TLessonRes } from "../../types/lessons.type";
import EditDrawer from "../EditDrawer/EditDrawer";
import useContainer from "./useContainer";

const LessonPage = () => {
  const {
    open,
    opened,
    lessonRes,
    isLoading,
    filterForm,
    courseDropdownData,
    courseDropdownDataLoading,
  } = useContainer();
  return (
    <>
      <Stack p={10}>
        <Group justify="space-between">
          <CustomBreadCrumb
            title="Lessons"
            links={[
              { label: "Dashboard", href: DASHBOARD, isActive: true },
              { label: "Lessons", href: "", isActive: false },
            ]}
          />
          <Button
            leftSection={<IconPlus />}
            onClick={() => {
              open();
            }}
          >
            Create New Lesson
          </Button>
        </Group>

        <Box>
          <CustomTable<TLessonRes>
            isLoading={isLoading}
            header={
              <Paper className="overflow-hidden!">
                <Flex justify="end" gap={10} align="center" bg="var(--hb-surface)">
                  <DropDownInput
                    control={filterForm.control}
                    name="courseId"
                    data={courseDropdownData || []}
                    className="w-75"
                    placeholder="Choose Course"
                    isLoading={courseDropdownDataLoading}
                    clearable={true}
                  />
                </Flex>
              </Paper>
            }
            onTableRowClick={(d) => {
              open(d.id);
            }}
            rows={lessonRes || []}
            columns={[
              {
                id: "title",
                header: "Title",
                element: (v) => {
                  return <>{v?.title}</>;
                },
                columnClass: "min-w-[80px]! max-w-[120px]!",
              },
              {
                id: "course",
                header: "Course",
                element: (v) => {
                  return <>{v?.course?.title}</>;
                },
                columnClass: "min-w-[80px]! max-w-[120px]!",
              },
              {
                id: "description",
                header: "Description",
                element: (v) => {
                  return (
                    <Text size="sm" lineClamp={2}>
                      {v?.description || "-"}
                    </Text>
                  );
                },
                columnClass: "min-w-[80px]! max-w-[120px]!",
              },
              {
                id: "action",
                header: "Actions",
                headerClass: "text-right!",
                element: (v) => {
                  return (
                    <Group justify="end">
                      <ActionIcon
                        onClick={() => {
                          open(v.id);
                        }}
                        variant="transparent"
                      >
                        <IconPencil />
                      </ActionIcon>
                    </Group>
                  );
                },
              },
            ]}
          />
        </Box>
      </Stack>
      {opened && <EditDrawer />}
    </>
  );
};

export default LessonPage;
