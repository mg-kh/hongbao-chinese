"use client";

import CustomBreadCrumb from "@/components/CustomBreadCrumb/CustomBreadCrumb";
import LoaderComponent from "@/components/LoaderComponent/LoaderComponent";
import { DASHBOARD, QUIZZES_LIST } from "@/constants/DashboardRoutes";
import { Group, Stack } from "@mantine/core";
import QuestionEngineEditor from "../../../../components/QuestionEngineEditor/QuestionEngineEditor";
import useContainer from "./useContainer";

const QuestionEditor = () => {
  const { form, handleFormSubmit, isLoading, quizzId } = useContainer();
  return (
    <Stack p={10} className="h-[calc(100vh-60px)]">
      <Group justify="space-between">
        <CustomBreadCrumb
          title="Questions Editor"
          links={[
            { label: "Dashboard", href: DASHBOARD, isActive: true },
            { label: "Quizzes", href: QUIZZES_LIST, isActive: true },
            {
              label: "Questions",
              href: `/dashboard/assets/quizzes/${quizzId}/questions`,
              isActive: true,
            },
            { label: "Questions Editor", href: "", isActive: false },
          ]}
        />
      </Group>
      {isLoading ? <LoaderComponent /> : <QuestionEngineEditor />}
    </Stack>
  );
};

export default QuestionEditor;
