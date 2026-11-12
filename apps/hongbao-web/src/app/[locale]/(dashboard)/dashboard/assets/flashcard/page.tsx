"use client";

import EditDrawerProvider from "@/providers/EditDrawerProvider";
import FlashcardPage from "./components/FlashcardPage/FlashcardPage";

const Flashcard = () => {
  return (
    <EditDrawerProvider>
      <FlashcardPage />
    </EditDrawerProvider>
  );
};

export default Flashcard;
