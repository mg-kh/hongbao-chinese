"use client";

import EditDrawerProvider from "@/providers/EditDrawerProvider";
import SubLessonPage from "./components/SubLessonPage/SubLessonPage";

const SubLessons = () => {
  return (
    <EditDrawerProvider>
      <SubLessonPage />
    </EditDrawerProvider>
  );
};

export default SubLessons;
