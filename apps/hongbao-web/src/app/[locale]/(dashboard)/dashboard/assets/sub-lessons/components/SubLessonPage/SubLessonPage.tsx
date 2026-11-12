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
import { IconPencil, IconPlus } from "@tabler/icons-react";
import { TSubLessonRes } from "../../types/sub-lesson.type";
import EditDrawer from "../EditDrawer/EditDrawer";
import useContainer from "./useContainer";

const SubLessonPage = () => {
  const {
    open,
    opened,
    subLessonRes,
    isLoading,
    filterForm,
    courseDropdownData,
    courseDropdownDataLoading,
    lessonDropdownData,
    lessonDropdownDataLoading,
  } = useContainer();
  return (
    <>
      <Stack p={10}>
        <Group justify="space-between">
          <CustomBreadCrumb
            title="Sub Lessons"
            links={[
              { label: "Dashboard", href: DASHBOARD, isActive: true },
              { label: "Sub Lessons", href: "", isActive: false },
            ]}
          />
          <Button
            leftSection={<IconPlus />}
            onClick={() => {
              open();
            }}
          >
            Create New Sub Lesson
          </Button>
        </Group>

        <Box>
          <CustomTable<TSubLessonRes>
            isLoading={isLoading}
            header={
              <Paper className="overflow-hidden!">
                <Flex justify="end" gap={10} align="center" bg={"white"}>
                  <Group gap={10}>
                    <DropDownInput
                      control={filterForm.control}
                      name="courseId"
                      data={courseDropdownData || []}
                      className="w-75"
                      placeholder="Choose Course"
                      isLoading={courseDropdownDataLoading}
                      clearable={true}
                    />
                    <DropDownInput
                      control={filterForm.control}
                      name="lessonId"
                      data={lessonDropdownData || []}
                      className="w-75"
                      placeholder="Choose Lesson"
                      isLoading={lessonDropdownDataLoading}
                      clearable={true}
                    />
                  </Group>
                </Flex>
              </Paper>
            }
            onTableRowClick={(d) => {
              open(d.id);
            }}
            rows={subLessonRes || []}
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
                id: "lesson",
                header: "Lesson",
                element: (v) => {
                  return <>{v?.lesson?.title}</>;
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

export default SubLessonPage;
