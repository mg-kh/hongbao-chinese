import CustomBreadCrumb from "@/components/CustomBreadCrumb/CustomBreadCrumb";
import CustomTable from "@/components/CustomTable/CustomTable";
import { DASHBOARD } from "@/constants/DashboardRoutes";
import { ActionIcon, Box, Button, Group, Stack, Text } from "@mantine/core";
import { IconPencil, IconPlus } from "@tabler/icons-react";
import { TCategoryRes } from "../../types/category.type";
import EditDrawer from "../EditDrawer/EditDrawer";
import useContainer from "./useContainer";

const CategoryPage = () => {
  const { open, opened, categoryRes, isLoading } = useContainer();
  return (
    <>
      <Stack p={10}>
        <Group justify="space-between">
          <CustomBreadCrumb
            title="Category"
            links={[
              { label: "Dashboard", href: DASHBOARD, isActive: true },
              { label: "Category", href: "", isActive: false },
            ]}
          />
          <Button
            leftSection={<IconPlus />}
            onClick={() => {
              open();
            }}
          >
            Create New Category
          </Button>
        </Group>

        <Box>
          <CustomTable<TCategoryRes>
            isLoading={isLoading}
            onTableRowClick={(d) => {
              open(d.id);
            }}
            rows={categoryRes || []}
            columns={[
              {
                id: "name",
                header: "Name",
                element: (v) => {
                  return <>{v?.name}</>;
                },
                columnClass: "min-w-[80px]! max-w-[160px]!",
              },
              {
                id: "description",
                header: "Description",
                element: (v) => {
                  return (
                    <Text size="sm" lineClamp={2}>
                      {v?.description}
                    </Text>
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

export default CategoryPage;
