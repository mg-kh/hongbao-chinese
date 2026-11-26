"use client";

import useMyFlashcards from "@/hooks/global-data-fetching/useMyFlashcards";
import { useParams } from "next/navigation";

const useContainer = () => {
  const { userId } = useParams();

  // only flashcards the user is actively enrolled in - never the whole catalogue.
  const { flashcards, isLoading } = useMyFlashcards();

  return { userId, flashcards, isLoading };
};

export default useContainer;
