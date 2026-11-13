"use client";

import EditDrawerProvider from "@/providers/EditDrawerProvider";
import PricingCoursePage from "./components/PricingCoursePage/PricingCoursePage";

const PricingCourse = () => {
  return (
    <>
      <EditDrawerProvider>
        <PricingCoursePage />
      </EditDrawerProvider>
    </>
  );
};

export default PricingCourse;
