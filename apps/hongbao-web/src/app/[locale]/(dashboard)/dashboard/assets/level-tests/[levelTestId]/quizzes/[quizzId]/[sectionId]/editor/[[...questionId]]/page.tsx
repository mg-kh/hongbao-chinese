"use client";

import CustomBreadCrumb from "@/components/CustomBreadCrumb/CustomBreadCrumb";
import { DASHBOARD, LEVEL_TEST_LIST } from "@/constants/DashboardRoutes";
import { Group, Stack } from "@mantine/core";

import useContainer from "./useContainer";
import QuestionEngineEditor from "@/app/[locale]/(dashboard)/dashboard/assets/quizzes/components/QuestionEngineEditor/QuestionEngineEditor";

const QuestionEditor = () => {
  const { levelTestId, quizzId, sectionId, sectionDetail } = useContainer();
  return (
    <Stack p={10} className="h-[calc(100vh-60px)]">
      <Group justify="space-between">
        <CustomBreadCrumb
          title={`Questions Editor (${sectionDetail?.title || "-"})`}
          links={[
            { label: "Dashboard", href: DASHBOARD, isActive: true },
            { label: "Level Test", href: LEVEL_TEST_LIST, isActive: true },
            {
              label: "Quizzes",
              href: `/dashboard/assets/level-tests/${levelTestId}/quizzes`,
              isActive: true,
            },
            {
              label: sectionDetail?.title || "Section",
              href: `/dashboard/assets/level-tests/${levelTestId}/quizzes/${quizzId}/${sectionId}`,
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
