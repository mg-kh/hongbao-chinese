"use client";

import EditDrawerProvider from "@/providers/EditDrawerProvider";
import LevelTestPage from "./components/LevelTestPage/LevelTestPage";

const LevelTests = () => {
  return (
    <EditDrawerProvider>
      <LevelTestPage />
    </EditDrawerProvider>
  );
};

export default LevelTests;
