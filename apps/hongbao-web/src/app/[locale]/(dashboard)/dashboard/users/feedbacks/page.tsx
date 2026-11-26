"use client";

import EditDrawerProvider from "@/providers/EditDrawerProvider";
import FeedbackPage from "./components/FeedbackPage/FeedbackPage";

const Page = () => {
  return (
    <EditDrawerProvider>
      <FeedbackPage />
    </EditDrawerProvider>
  );
};

export default Page;
