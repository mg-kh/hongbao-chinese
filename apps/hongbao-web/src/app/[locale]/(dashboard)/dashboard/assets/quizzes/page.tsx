"use client";

import EditDrawerProvider from "@/providers/EditDrawerProvider";
import QuizzPage from "./components/QuizzPage/QuizzPage";

const SubLessons = () => {
  return (
    <EditDrawerProvider>
      <QuizzPage />
    </EditDrawerProvider>
  );
};

export default SubLessons;
