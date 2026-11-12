"use client";

import CustomBreadCrumb from "@/components/CustomBreadCrumb/CustomBreadCrumb";
import LoaderComponent from "@/components/LoaderComponent/LoaderComponent";
import { DASHBOARD } from "@/constants/DashboardRoutes";
import { Alert, Paper, Stack, Text, TextInput } from "@mantine/core";
import { IconInfoCircle, IconSearch } from "@tabler/icons-react";
import { isEmpty } from "lodash";
import CourseNode from "../CourseNode/CourseNode";
import QuizDialog from "../QuizDialog/QuizDialog";
import useContainer from "./useContainer";

const AttachQuizzesPage = () => {
  const { search, setSearch, isLoading, filteredCourses, isDialogOpen } =
    useContainer();

  return (
    <>
      {isDialogOpen && <QuizDialog />}

      <Stack p={10} gap={14}>
        <CustomBreadCrumb
          title="Attach Quizzes"
          links={[
            { label: "Dashboard", href: DASHBOARD, isActive: true },
            { label: "Attach Quizzes", href: "", isActive: false },
          ]}
        />

        <TextInput
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          placeholder="Search course by name"
          leftSection={<IconSearch size={16} />}
        />

        {isLoading ? (
          <LoaderComponent />
        ) : isEmpty(filteredCourses) ? (
          <Paper withBorder p={30}>
            <Text ta="center" c="gray.6">
              {search
                ? "No course matches your search."
                : "No course found. Create a course first."}
            </Text>
          </Paper>
        ) : (
          <Stack gap={8}>
            {filteredCourses.map((course) => (
              <CourseNode key={course.id} course={course} />
            ))}
          </Stack>
        )}
      </Stack>
    </>
  );
};

export default AttachQuizzesPage;
