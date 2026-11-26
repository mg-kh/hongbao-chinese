"use client";

import { useMyFlashcardDetail } from "@/hooks/global-data-fetching/useMyFlashcards";
import { useParams } from "next/navigation";
import { useState } from "react";

const useContainer = () => {
  const { userId, flashcardId } = useParams();

  // the API only returns the deck when the user has an active enrollment.
  const { flashcard, cards, isLoading, isError } = useMyFlashcardDetail(
    String(flashcardId),
  );

  // index of the card open in the dialog, null when it's closed
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return {
    userId,
    flashcard,
    cards,
    isLoading,
    isError,
    activeIndex,
    setActiveIndex,
  };
};

export default useContainer;
