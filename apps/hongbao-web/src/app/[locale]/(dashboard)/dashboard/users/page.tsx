"use client";

import EditDrawerProvider from "@/providers/EditDrawerProvider";
import UserPage from "./components/UserPage/UserPage";

const Page = () => {
  return (
    <EditDrawerProvider>
      <UserPage />
    </EditDrawerProvider>
  );
};

export default Page;
