import CustomBreadCrumb from "@/components/CustomBreadCrumb/CustomBreadCrumb";
import CustomTable from "@/components/CustomTable/CustomTable";
import { DASHBOARD } from "@/constants/DashboardRoutes";
import { currencyFormatter } from "@/utils/currencyFormatter";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import { IconArrowRight, IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { TMockTestRes } from "../../types/mock-test.type";
import EditDrawer from "../EditDrawer/EditDrawer";
import useContainer from "./useContainer";

const MockTestPage = () => {
  const { open, opened, mockTests, isLoading } = useContainer();
  return (
    <>
      <Stack p={10}>
        <Group justify="space-between">
          <CustomBreadCrumb
            title="Mock Test"
            links={[
              { label: "Dashboard", href: DASHBOARD, isActive: true },
              { label: "Mock Test", href: "", isActive: false },
            ]}
          />
          <Button
            leftSection={<IconPlus />}
            onClick={() => {
              open();
            }}
          >
            Create New Mock Test
          </Button>
        </Group>

        <Box>
          <CustomTable<TMockTestRes>
            isLoading={isLoading}
            onTableRowClick={(d) => {
              open(d.id);
            }}
            rows={mockTests}
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
                id: "description",
                header: "Description",
                element: (v) => {
                  return (
                    <Text size="sm" lineClamp={2}>
                      {v?.description || "-"}
                    </Text>
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
                        value: v?.price ?? undefined,
                      })}{" "}
                      / {v?.perTime ?? 0} Month
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
                id: "published",
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
                        component={Link}
                        href={`mock-tests/${v.id}/quizzes`}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        variant="transparent"
                        title="Manage Quizzes"
                      >
                        <IconArrowRight />
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

export default MockTestPage;
