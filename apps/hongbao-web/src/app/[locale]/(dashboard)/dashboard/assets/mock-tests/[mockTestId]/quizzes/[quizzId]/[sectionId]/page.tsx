"use client";

import EditDrawerProvider from "@/providers/EditDrawerProvider";
import SectionDetailPage from "./components/SectionDetailPage/SectionDetailPage";

const SectionDetail = () => {
  return (
    <EditDrawerProvider>
      <SectionDetailPage />
    </EditDrawerProvider>
  );
};

export default SectionDetail;
