"use client";

import EditDrawerProvider from "@/providers/EditDrawerProvider";
import VideoPage from "./components/VideoPage/VideoPage";

const SubLessons = () => {
  return (
    <EditDrawerProvider>
      <VideoPage />
    </EditDrawerProvider>
  );
};

export default SubLessons;
