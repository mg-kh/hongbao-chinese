"use client";

import EditDrawerProvider from "@/providers/EditDrawerProvider";
import CardPage from "./components/CardPage/CardPage";

const Card = () => {
  return (
    <EditDrawerProvider>
      <CardPage />
    </EditDrawerProvider>
  );
};

export default Card;
