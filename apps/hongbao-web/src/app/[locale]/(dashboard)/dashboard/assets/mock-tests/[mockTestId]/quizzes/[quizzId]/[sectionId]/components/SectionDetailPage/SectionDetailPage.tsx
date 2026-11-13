"use client";

import CustomBreadCrumb from "@/components/CustomBreadCrumb/CustomBreadCrumb";
import CustomTable from "@/components/CustomTable/CustomTable";
import DeleteDialog from "@/components/Modals/DeleteDialog/DeleteDialog";
import { DASHBOARD, MOCK_TEST_LIST } from "@/constants/DashboardRoutes";
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
import { useParams, useRouter } from "next/navigation";
import { QuestionType } from "../../../../../../components/QuestionEngineEditor/components/QuestionTypeSelector/QuestionTypeSelector";
import EditSectionDrawer from "../EditSectionDrawer/EditSectionDrawer";
import useContainer from "./useContainer";
import { TQuestion } from "../../../../../../types/question.type";
import Link from "next/link";
import { pluralize } from "@/utils/pluralize";

const SectionDetailPage = () => {
  const { mockTestId, quizzId, sectionId } = useParams();
  const router = useRouter();
  const editorPath = `/dashboard/assets/mock-tests/${mockTestId}/quizzes/${quizzId}/${sectionId}/editor`;
  const {
    section,
    questions,
    isQuestionsLoading,
    open,
    opened,
    openDeleteDialog,
    isDeleteDialogOpened,
    closeDeleteDialog,
    handleDelete,
    isDeleting,
  } = useContainer();

  return (
    <Stack p={10}>
      <Group justify="space-between">
        <CustomBreadCrumb
          title={section.title}
          links={[
            { label: "Dashboard", href: DASHBOARD, isActive: true },
            { label: "Mock Test", href: MOCK_TEST_LIST, isActive: true },
            {
              label: "Quizzes",
              href: `/dashboard/assets/mock-tests/${mockTestId}/quizzes`,
              isActive: true,
            },
            { label: section.title, href: "", isActive: false },
          ]}
        />
        <Link href={editorPath}>
          <Button leftSection={<IconPlus />}>Add Question</Button>
        </Link>
      </Group>

      <Group justify="space-between" align="flex-start" py={16}>
        <Stack gap={4}>
          <Text fw="bold" fz="lg">
            {section.title}
          </Text>
          <Text c="dimmed" size="sm">
            {section.description}
          </Text>
        </Stack>
        <Group gap={10}>
          <Badge size="lg" variant="light">
            {pluralize(questions.length, "Question")}
          </Badge>
          <ActionIcon variant="transparent" onClick={() => open()}>
            <IconPencil size={20} />
          </ActionIcon>
        </Group>
      </Group>

      <Box>
        <CustomTable<TQuestion>
          rows={questions}
          isLoading={isQuestionsLoading}
          onTableRowClick={(v) => router.push(`${editorPath}/${v.id}`)}
          columns={[
            {
              id: "question",
              header: "Question",
              element: (v) => {
                return (
                  <Stack gap={2}>
                    <Text fw={500}>{v.title}</Text>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: v?.data?.question,
                      }}
                    ></div>
                  </Stack>
                );
              },
            },
            {
              id: "type",
              header: "Question Type",
              element: (v) => {
                return (
                  <>
                    {v.type === QuestionType.MULTIPLE_CHOICES && (
                      <Badge color="blue">Multiple Choice</Badge>
                    )}
                    {v.type === QuestionType.TRUE_OR_FALSE && (
                      <Badge color="indigo">True Or False</Badge>
                    )}
                    {v.type === QuestionType.REARRANGE && (
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
                      variant="transparent"
                      color="red"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteDialog(v.id);
                      }}
                    >
                      <IconTrash />
                    </ActionIcon>
                  </Group>
                );
              },
            },
          ]}
        />
      </Box>

      {opened && <EditSectionDrawer section={section} />}

      <DeleteDialog
        opened={isDeleteDialogOpened}
        onClose={closeDeleteDialog}
        handleConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </Stack>
  );
};

export default SectionDetailPage;
