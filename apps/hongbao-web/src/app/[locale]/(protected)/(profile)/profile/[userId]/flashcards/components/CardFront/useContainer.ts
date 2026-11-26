import { wordTypeLabel } from "@/app/[locale]/(protected)/(profile)/profile/[userId]/flashcards/wordType";
import type { TCard } from "@/hooks/global-data-fetching/useMyFlashcards";
import { useTranslations } from "next-intl";
import { useState } from "react";

/** Prompt side state - the pinyin stays blurred until the learner peeks. */
const useContainer = (card: TCard) => {
  const [showPinyin, setShowPinyin] = useState(false);
  const tWordType = useTranslations("Profile.Flashcards.WordType");

  return {
    typeLabel: wordTypeLabel(card.type, (key) => tWordType(key)),
    showPinyin,
    revealPinyin: () => setShowPinyin(true),
  };
};

export default useContainer;
