"use client";

import CustomBreadCrumb from "@/components/CustomBreadCrumb/CustomBreadCrumb";
import CustomTable from "@/components/CustomTable/CustomTable";
import LoaderComponent from "@/components/LoaderComponent/LoaderComponent";
import DeleteDialog from "@/components/Modals/DeleteDialog/DeleteDialog";
import { DASHBOARD, QUIZZES_LIST } from "@/constants/DashboardRoutes";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Group,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import { QuestionType } from "../../components/QuestionEngineEditor/components/QuestionTypeSelector/QuestionTypeSelector";
import { TQuestion } from "../../types/question.type";
import useContainer from "./useContainer";

const Questions = () => {
  const {
    router,
    questions,
    isLoading,
    opened,
    close,
    open,
    handleDelete,
    isPending,
  } = useContainer();
  return (
    <>
      <DeleteDialog
        opened={opened}
        onClose={() => {
          close();
        }}
        handleConfirm={() => {
          handleDelete();
        }}
        isLoading={isPending}
      />
      <Box p={10}>
        <Group justify="space-between">
          <CustomBreadCrumb
            title="Questions"
            links={[
              { label: "Dashboard", href: DASHBOARD, isActive: true },
              { label: "Quizzes", href: QUIZZES_LIST, isActive: true },
              { label: "Questions", href: "", isActive: false },
            ]}
          />
          <Button
            leftSection={<IconPlus />}
            onClick={(e) => {
              router.push("questions/editor");
            }}
          >
            Create New Question
          </Button>
        </Group>

        <Box pt={10}>
          {isLoading ? (
            <LoaderComponent />
          ) : (
            <CustomTable<TQuestion>
              onTableRowClick={(d) => {
                router.push(`questions/editor/${d?.id}`);
              }}
              rows={questions || []}
              columns={[
                {
                  id: "question",
                  header: "Question",
                  element: (v) => {
                    return (
                      <>
                        <Stack gap={5}>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: v?.data?.question,
                            }}
                          ></div>
                          {v?.type === QuestionType.REARRANGE && (
                            <Stack>
                              <Text>{v?.title}</Text>
                              <Group gap={5}>
                                {v?.data?.questions?.map((q) => {
                                  return (
                                    <Paper withBorder key={q} px={4}>
                                      <Text size="xs">{q}</Text>
                                    </Paper>
                                  );
                                })}
                              </Group>
                            </Stack>
                          )}
                        </Stack>
                      </>
                    );
                  },
                  columnClass: "min-w-[80px]! max-w-[120px]!",
                },
                {
                  id: "type",
                  header: "Question Type",
                  element: (v) => {
                    return (
                      <>
                        {v?.type === QuestionType.MULTIPLE_CHOICES && (
                          <Badge color="blue">Multiple Choice</Badge>
                        )}
                        {v?.type === QuestionType.TRUE_OR_FALSE && (
                          <Badge color="indigo">True Or False</Badge>
                        )}
                        {v?.type === QuestionType.REARRANGE && (
                          <Badge color="green">Rearrange</Badge>
                        )}
                      </>
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
                          onClick={(e) => {
                            e.stopPropagation();
                            open(v?.id);
                          }}
                          variant="transparent"
                          color="red"
                        >
                          <IconTrash />
                        </ActionIcon>
                        <ActionIcon
                          onClick={() => {
                            router.push(`questions/editor/${v?.id}`);
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
          )}
        </Box>
      </Box>
    </>
  );
};

export default Questions;
