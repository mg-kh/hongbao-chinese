"use client";

import EditDrawerProvider from "@/providers/EditDrawerProvider";
import QuizListPage from "./components/QuizListPage/QuizListPage";

const LevelTestQuizzes = () => {
  return (
    <EditDrawerProvider>
      <QuizListPage />
    </EditDrawerProvider>
  );
};

export default LevelTestQuizzes;
