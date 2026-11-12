import CustomBreadCrumb from "@/components/CustomBreadCrumb/CustomBreadCrumb";
import CustomTable from "@/components/CustomTable/CustomTable";
import { DASHBOARD } from "@/constants/DashboardRoutes";
import { ActionIcon, Box, Button, Group, Stack, Text } from "@mantine/core";
import { IconArrowRight, IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { TQuiz } from "../../types/quiz.type";
import EditDrawer from "../EditDrawer/EditDrawer";
import useContainer from "./useContainer";

const QuizzPage = () => {
  const { open, opened, quizzes, isLoading } = useContainer();
  return (
    <>
      <Stack p={10}>
        <Group justify="space-between">
          <CustomBreadCrumb
            title="Quizzes"
            links={[
              { label: "Dashboard", href: DASHBOARD, isActive: true },
              { label: "Quizzes", href: "", isActive: false },
            ]}
          />
          <Button
            leftSection={<IconPlus />}
            onClick={() => {
              open();
            }}
          >
            Create New Quizz
          </Button>
        </Group>

        <Box>
          <CustomTable<TQuiz>
            isLoading={isLoading}
            onTableRowClick={(d) => {
              open(d.id);
            }}
            rows={quizzes}
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
                id: "action",
                header: "Actions",
                headerClass: "text-right!",
                element: (v) => {
                  return (
                    <Group justify="end">
                      <ActionIcon
                        component={Link}
                        href={`quizzes/${v.id}/questions`}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        variant="transparent"
                        title="Manage Questions"
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

export default QuizzPage;
