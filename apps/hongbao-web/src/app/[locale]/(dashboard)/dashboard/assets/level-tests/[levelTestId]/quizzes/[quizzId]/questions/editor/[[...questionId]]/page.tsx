"use client";

import CustomBreadCrumb from "@/components/CustomBreadCrumb/CustomBreadCrumb";
import { DASHBOARD, LEVEL_TEST_LIST } from "@/constants/DashboardRoutes";
import { Group, Stack } from "@mantine/core";
import { useParams } from "next/navigation";
import QuestionEngineEditor from "../../../../../../components/QuestionEngineEditor/QuestionEngineEditor";

const QuestionEditor = () => {
  const { levelTestId, quizzId } = useParams();
  return (
    <Stack p={10} className="h-[calc(100vh-60px)]">
      <Group justify="space-between">
        <CustomBreadCrumb
          title="Questions Editor"
          links={[
            { label: "Dashboard", href: DASHBOARD, isActive: true },
            { label: "Level Test", href: LEVEL_TEST_LIST, isActive: true },
            {
              label: "Questions",
              href: `/dashboard/assets/level-tests/${levelTestId}/quizzes/${quizzId}/questions`,
              isActive: true,
            },
            { label: "Questions Editor", href: "", isActive: false },
          ]}
        />
      </Group>
      <QuestionEngineEditor />
    </Stack>
  );
};

export default QuestionEditor;
