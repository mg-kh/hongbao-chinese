import CustomBreadCrumb from "@/components/CustomBreadCrumb/CustomBreadCrumb";
import CustomTable from "@/components/CustomTable/CustomTable";
import { COURSE_LIST, DASHBOARD } from "@/constants/DashboardRoutes";
import { currencyFormatter } from "@/utils/currencyFormatter";
import { ActionIcon, Badge, Box, Button, Group, Stack } from "@mantine/core";
import { IconPencil, IconPlus } from "@tabler/icons-react";
import { TCourseRes } from "../../types/courses.type";
import EditDrawer from "../EditDrawer/EditDrawer";
import useContainer from "./useContainer";

const CoursesPage = () => {
  const { open, opened, courseRes, isLoading } = useContainer();
  return (
    <>
      <Stack p={10}>
        <Group justify="space-between">
          <CustomBreadCrumb
            title="Courses"
            links={[
              { label: "Dashboard", href: DASHBOARD, isActive: true },
              { label: "Courses", href: COURSE_LIST, isActive: false },
            ]}
          />
          <Button
            leftSection={<IconPlus />}
            onClick={() => {
              open();
            }}
          >
            Create New Course
          </Button>
        </Group>

        <Box>
          <CustomTable<TCourseRes>
            isLoading={isLoading}
            onTableRowClick={(d) => {
              open(d.id);
            }}
            rows={courseRes || []}
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
                id: "isFree",
                header: "Is Free",
                element: (v) => {
                  return (
                    <>
                      {v?.isFree ? (
                        <Badge color="green">Yes</Badge>
                      ) : (
                        <Badge color="gray">No</Badge>
                      )}
                    </>
                  );
                },
              },
              {
                id: "price",
                header: "Pricing",
                element: (v) => {
                  return (
                    <>
                      {currencyFormatter({
                        value: v?.price,
                      })}{" "}
                      / {v?.perTime} Month
                    </>
                  );
                },
              },
              {
                id: "category",
                header: "Category",
                element: (v) => {
                  return <>{v?.category?.name ?? "-"}</>;
                },
              },
              {
                id: "isPublish",
                header: "Is published",
                element: (v) => {
                  return (
                    <>
                      {v?.published ? (
                        <Badge color="green">Yes</Badge>
                      ) : (
                        <Badge color="gray">No</Badge>
                      )}
                    </>
                  );
                },
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

export default CoursesPage;
