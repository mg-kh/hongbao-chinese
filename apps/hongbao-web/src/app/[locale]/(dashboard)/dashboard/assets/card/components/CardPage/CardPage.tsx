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
  Pagination,
  Paper,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { IconFileImport, IconPencil, IconPlus } from "@tabler/icons-react";
import { TCardRes } from "../../types/card.type";
import EditDrawer from "../EditDrawer/EditDrawer";
import ImportCsvModal from "../ImportCsvModal/ImportCsvModal";
import useContainer from "./useContainer";
import { PAGE_SIZE_OPTIONS } from "@/constants/pagination";

const CardPage = () => {
  const {
    open,
    opened,
    cardRes,
    isLoading,
    filterForm,
    flashcardDropdownData,
    flashcardDropdownDataLoading,
    params,
    setParams,
    totalPages,
    importOpened,
    openImport,
    closeImport,
  } = useContainer();
  return (
    <>
      <Stack p={10}>
        <Group justify="space-between">
          <CustomBreadCrumb
            title="Card"
            links={[
              { label: "Dashboard", href: DASHBOARD, isActive: true },
              { label: "Card", href: "", isActive: false },
            ]}
          />
          <Group gap={10}>
            <Button
              variant="light"
              leftSection={<IconFileImport />}
              onClick={openImport}
            >
              Import CSV
            </Button>
            <Button
              leftSection={<IconPlus />}
              onClick={() => {
                open();
              }}
            >
              Create New Card
            </Button>
          </Group>
        </Group>

        <Box>
          <CustomTable<TCardRes>
            isLoading={isLoading}
            noOffset={(Number(params.page) - 1) * Number(params.limit)}
            header={
              <Paper className="overflow-hidden!">
                <Flex justify="end" gap={10} align="center" bg={"white"}>
                  <DropDownInput
                    control={filterForm.control}
                    name="flashcardId"
                    data={flashcardDropdownData || []}
                    className="w-75"
                    placeholder="Choose Flashcard"
                    isLoading={flashcardDropdownDataLoading}
                    clearable={true}
                  />
                </Flex>
              </Paper>
            }
            footer={
              <Flex justify="end" align={"center"} gap={10}>
                <Select
                  placeholder="Per page"
                  data={PAGE_SIZE_OPTIONS}
                  w={120}
                  value={params.limit}
                  allowDeselect={false}
                  onChange={(v) => {
                    setParams({ limit: `${v}`, page: 1 });
                  }}
                />
                <Pagination
                  size="lg"
                  total={totalPages}
                  value={params.page}
                  onChange={(value: number) => {
                    setParams((prev) => ({ ...prev, page: value }));
                  }}
                  siblings={1}
                  boundaries={1}
                />
              </Flex>
            }
            onTableRowClick={(d) => {
              open(d.id);
            }}
            rows={cardRes || []}
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
                id: "flashcard",
                header: "Flashcard",
                element: (v) => {
                  return <>{v?.flashcard?.name ?? "-"}</>;
                },
              },
              {
                id: "category",
                header: "Category",
                element: (v) => {
                  return <>{v?.flashcard?.category?.name ?? "-"}</>;
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
      <ImportCsvModal opened={importOpened} onClose={closeImport} />
    </>
  );
};

export default CardPage;
