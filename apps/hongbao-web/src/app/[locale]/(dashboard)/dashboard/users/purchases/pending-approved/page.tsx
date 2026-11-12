"use client";

import EditDrawerProvider from "@/providers/EditDrawerProvider";
import PageComponent from "./components/PageComponent/PageComponent";

const Page = () => {
  return (
    <EditDrawerProvider>
      <PageComponent />
    </EditDrawerProvider>
  );
};

export default Page;
