"use client";

import EditDrawerProvider from "@/providers/EditDrawerProvider";
import MockTestPage from "./components/MockTestPage/MockTestPage";

const MockTests = () => {
  return (
    <EditDrawerProvider>
      <MockTestPage />
    </EditDrawerProvider>
  );
};

export default MockTests;
