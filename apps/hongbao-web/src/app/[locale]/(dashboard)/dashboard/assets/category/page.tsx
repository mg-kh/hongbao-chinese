"use client";

import EditDrawerProvider from "@/providers/EditDrawerProvider";
import CategoryPage from "./components/CategoryPage/CategoryPage";

const Courses = () => {
  return (
    <EditDrawerProvider>
      <CategoryPage />
    </EditDrawerProvider>
  );
};

export default Courses;
