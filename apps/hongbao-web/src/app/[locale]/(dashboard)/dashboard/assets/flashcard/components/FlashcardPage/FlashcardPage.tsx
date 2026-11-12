import CustomBreadCrumb from "@/components/CustomBreadCrumb/CustomBreadCrumb";
import CustomTable from "@/components/CustomTable/CustomTable";
import { DASHBOARD } from "@/constants/DashboardRoutes";
import { ActionIcon, Box, Button, Group, Stack, Text } from "@mantine/core";
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
                id: "cnWord",
                header: "Word",
                element: (v) => {
                  return <>{v?.cnWord}</>;
                },
                columnClass: "min-w-[80px]! max-w-[160px]!",
              },
              {
                id: "pinyin",
                header: "Pinyin",
                element: (v) => {
                  return <>{v?.pinyin}</>;
                },
              },
              {
                id: "type",
                header: "Type",
                element: (v) => {
                  return <>{v?.type}</>;
                },
              },
              {
                id: "meaningEn",
                header: "Meaning (EN)",
                element: (v) => {
                  return (
                    <Text size="sm" lineClamp={2}>
                      {v?.meaningEn}
                    </Text>
                  );
                },
              },
              {
                id: "meaningMm",
                header: "Meaning (MM)",
                element: (v) => {
                  return (
                    <Text size="sm" lineClamp={2}>
                      {v?.meaningMm}
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

export default FlashcardPage;
