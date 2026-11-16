"use client";

import CustomBreadCrumb from "@/components/CustomBreadCrumb/CustomBreadCrumb";
import CustomTable from "@/components/CustomTable/CustomTable";
import { DASHBOARD } from "@/constants/DashboardRoutes";
import { ActionIcon, Badge, Box, Group, Stack } from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";
import { TCourseRes } from "../../../../assets/courses/types/courses.type";
import EditDrawer from "../EditDrawer/EditDrawer";
import useContainer from "./useContainer";

const PricingCoursePage = () => {
  const { open, opened, courseRes, isLoading } = useContainer();
  return (
    <>
      <Stack p={10}>
        <Group justify="space-between">
          <CustomBreadCrumb
            title="Courses"
            links={[
              { label: "Dashboard", href: DASHBOARD, isActive: true },
              { label: "Pricing - Course", href: "", isActive: false },
            ]}
          />
        </Group>

        <Box>
          <CustomTable<TCourseRes>
            isLoading={false}
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
                id: "level",
                header: "Level",
                element: (v) => {
                  return <>{v?.level ?? "-"}</>;
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

export default PricingCoursePage;
