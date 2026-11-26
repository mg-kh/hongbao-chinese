import { wordTypeLabel } from "@/app/[locale]/(protected)/(profile)/profile/[userId]/flashcards/wordType";
import type { TCard } from "@/hooks/global-data-fetching/useMyFlashcards";
import { useState } from "react";

/** Prompt side state - the pinyin stays blurred until the learner peeks. */
const useContainer = (card: TCard) => {
  const [showPinyin, setShowPinyin] = useState(false);

  return {
    typeLabel: wordTypeLabel(card.type),
    showPinyin,
    revealPinyin: () => setShowPinyin(true),
  };
};

export default useContainer;
