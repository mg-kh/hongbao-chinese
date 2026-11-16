"use client";

import EditDrawerProvider from "@/providers/EditDrawerProvider";
import QuizListPage from "./components/QuizListPage/QuizListPage";

const MockTestQuizzes = () => {
  return (
    <EditDrawerProvider>
      <QuizListPage />
    </EditDrawerProvider>
  );
};

export default MockTestQuizzes;
