import CustomBreadCrumb from "@/components/CustomBreadCrumb/CustomBreadCrumb";
import CustomTable from "@/components/CustomTable/CustomTable";
import { DASHBOARD } from "@/constants/DashboardRoutes";
import { ActionIcon, Badge, Box, Button, Group, Stack } from "@mantine/core";
import { IconPencil, IconPlus } from "@tabler/icons-react";
import { TFlashcardRes } from "../../types/flashcard.type";
import EditDrawer from "../EditDrawer/EditDrawer";
import useContainer from "./useContainer";

const FlashcardPage = () => {
  const { open, opened, flashcardRes, isLoading } = useContainer();
  return (
    <>
      <Stack p={10}>
        <Group justify="space-between">
          <CustomBreadCrumb
            title="Flashcard"
            links={[
              { label: "Dashboard", href: DASHBOARD, isActive: true },
              { label: "Flashcard", href: "", isActive: false },
            ]}
          />
          <Button
            leftSection={<IconPlus />}
            onClick={() => {
              open();
            }}
          >
            Create New Flashcard
          </Button>
        </Group>

        <Box>
          <CustomTable<TFlashcardRes>
            isLoading={isLoading}
            onTableRowClick={(d) => {
              open(d.id);
            }}
            rows={flashcardRes || []}
            columns={[
              {
                id: "name",
                header: "Name",
                element: (v) => {
                  return <>{v?.name}</>;
                },
                columnClass: "min-w-[80px]! max-w-[200px]!",
              },
              {
                id: "category",
                header: "Category",
                element: (v) => {
                  return <>{v?.category?.name ?? "-"}</>;
                },
              },
              {
                id: "price",
                header: "Price",
                element: (v) => {
                  return v?.price ? (
                    <>{v.price.toLocaleString()} MMK</>
                  ) : (
                    <Badge color="green">Free</Badge>
                  );
                },
              },
              {
                id: "cards",
                header: "Cards",
                element: (v) => {
                  return <>{v?._count?.cards ?? 0}</>;
                },
              },
              {
                id: "published",
                header: "Is published",
                element: (v) => {
                  return v?.published ? (
                    <Badge color="green">Yes</Badge>
                  ) : (
                    <Badge color="gray">No</Badge>
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

export default FlashcardPage;
