"use client";

import EditDrawerProvider from "@/providers/EditDrawerProvider";
import GenerateCouponPage from "./components/GenerateCouponPage/GenerateCouponPage";

const PricingCourse = () => {
  return (
    <>
      <EditDrawerProvider>
        <GenerateCouponPage />
      </EditDrawerProvider>
    </>
  );
};

export default PricingCourse;
