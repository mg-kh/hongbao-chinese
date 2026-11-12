"use client";

import EditDrawerProvider from "@/providers/EditDrawerProvider";
import LessonPage from "./components/LessonPage/LessonPage";

const Lesson = () => {
  return (
    <EditDrawerProvider>
      <LessonPage />
    </EditDrawerProvider>
  );
};

export default Lesson;
