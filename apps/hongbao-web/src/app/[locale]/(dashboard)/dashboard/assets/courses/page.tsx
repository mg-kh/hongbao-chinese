"use client";

import EditDrawerProvider from "@/providers/EditDrawerProvider";
import CoursesPage from "./components/CoursesPage/CoursesPage";

const Courses = () => {
  return (
    <EditDrawerProvider>
      <CoursesPage />
    </EditDrawerProvider>
  );
};

export default Courses;
