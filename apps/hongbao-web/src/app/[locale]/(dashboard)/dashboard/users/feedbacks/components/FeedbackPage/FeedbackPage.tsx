"use client";

import CustomBreadCrumb from "@/components/CustomBreadCrumb/CustomBreadCrumb";
import CustomTable from "@/components/CustomTable/CustomTable";
import { DASHBOARD } from "@/constants/DashboardRoutes";
import {
  ActionIcon,
  Box,
  Button,
  Group,
  Rating,
  Stack,
  Text,
} from "@mantine/core";
import { IconFileImport, IconPencil, IconPlus } from "@tabler/icons-react";
import dayjs from "dayjs";
import { TFeedbackRes } from "../../types/feedback.type";
import EditDrawer from "../EditDrawer/EditDrawer";
import ImportCsvModal from "../ImportCsvModal/ImportCsvModal";
import useContainer from "./useContainer";

const FeedbackPage = () => {
  const {
    open,
    opened,
    feedbacks,
    isLoading,
    importOpened,
    openImport,
    closeImport,
  } = useContainer();

  return (
    <>
      <Stack p={10}>
        <Group justify="space-between">
          <CustomBreadCrumb
            title="Feedbacks"
            links={[
              { label: "Dashboard", href: DASHBOARD, isActive: true },
              { label: "Feedbacks", href: "", isActive: false },
            ]}
          />
          <Group>
            <Button
              variant="light"
              leftSection={<IconFileImport />}
              onClick={openImport}
            >
              Import CSV
            </Button>
            <Button leftSection={<IconPlus />} onClick={() => open()}>
              Create New Feedback
            </Button>
          </Group>
        </Group>

        <Box>
          <CustomTable<TFeedbackRes>
            isLoading={isLoading}
            onTableRowClick={(d) => open(d.id)}
            rows={feedbacks || []}
            columns={[
              {
                id: "name",
                header: "Name",
                element: (v) => <Text fw={600}>{v?.name}</Text>,
                columnClass: "min-w-[140px]!",
              },
              {
                id: "position",
                header: "Position",
                element: (v) => <>{v?.position || "-"}</>,
                columnClass: "min-w-[120px]!",
              },
              {
                id: "rating",
                header: "Rating",
                element: (v) => (
                  <Rating value={v?.rating ?? 0} readOnly size="sm" />
                ),
                columnClass: "whitespace-nowrap!",
              },
              {
                id: "content",
                header: "Feedback",
                element: (v) => (
                  <Text size="sm" lineClamp={2}>
                    {v?.content}
                  </Text>
                ),
                columnClass: "min-w-[240px]! max-w-[480px]!",
              },
              {
                id: "created_at",
                header: "Created At",
                element: (v) => (
                  <>
                    {v?.createdAt
                      ? dayjs(v.createdAt).format("DD MMM YYYY")
                      : "-"}
                  </>
                ),
                columnClass: "whitespace-nowrap!",
              },
              {
                id: "action",
                header: "Actions",
                headerClass: "text-right!",
                element: (v) => (
                  <Group justify="end">
                    <ActionIcon
                      onClick={(e) => {
                        e.stopPropagation();
                        open(v.id);
                      }}
                      variant="transparent"
                    >
                      <IconPencil />
                    </ActionIcon>
                  </Group>
                ),
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

export default FeedbackPage;
