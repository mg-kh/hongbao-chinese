"use client";

import { markLearned } from "@/app/[locale]/(protected)/(profile)/profile/[userId]/flashcards/learned";
import {
  getRating,
  saveRating,
  subscribeRatings,
  type TRating,
} from "@/app/[locale]/(protected)/(profile)/profile/[userId]/flashcards/ratings";
import type { TCard } from "@/hooks/global-data-fetching/useMyFlashcards";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

interface Params {
  cards: TCard[];
  userId: string;
  index: number | null;
  onIndexChange: (index: number | null) => void;
}

const useContainer = ({ cards, userId, index, onIndexChange }: Params) => {
  // Tailwind `sm` breakpoint - fullscreen sheet on phones, centered modal above.
  const isMobile = useMediaQuery("(max-width: 40em)");

  const card = index !== null ? (cards[index] ?? null) : null;
  const isOpen = card !== null;
  const total = cards.length;
  const position = index !== null ? index + 1 : 0;
  const progress = total > 0 ? (position / total) * 100 : 0;
  const prevCard = index !== null && index > 0 ? cards[index - 1] : null;
  const nextCard =
    index !== null && index < total - 1 ? cards[index + 1] : null;

  const close = () => onIndexChange(null);
  const goPrev = () => {
    if (index !== null && index > 0) onIndexChange(index - 1);
  };
  const goNext = () => {
    if (index !== null && index < total - 1) onIndexChange(index + 1);
  };

  // front/back: remembers WHICH card was revealed, so moving to another card
  // shows its front again without a reset effect
  const [revealedId, setRevealedId] = useState<string | null>(null);
  const revealed = card !== null && revealedId === card.id;
  const reveal = () => {
    if (card) setRevealedId(card.id);
  };

  // opening a card counts towards the profile's "learned" stat
  useEffect(() => {
    if (card) markLearned(userId, card.id);
  }, [card, userId]);

  // self-rating for the open card, persisted per user in localStorage
  const cardId = card?.id;
  const rating = useSyncExternalStore(
    subscribeRatings,
    () => (cardId ? getRating(userId, cardId) : undefined),
    () => undefined,
  );

  /** Save the rating, then move on to the next card (Quizlet-style). */
  const rate = (value: TRating) => {
    if (!cardId || !revealed) return;
    saveRating(userId, cardId, value);
    goNext();
  };

  // keyboard: ← / → step through the deck, Space / Enter reveal the answer,
  // then 1 = still learning, 2 = got it.
  // Handlers are read through a ref so the listener isn't re-bound every render.
  const handlers = useRef({ goPrev, goNext, rate, reveal });
  useEffect(() => {
    handlers.current = { goPrev, goNext, rate, reveal };
  });
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target?.closest(
          "input, textarea, [contenteditable='true'], [role='tab']",
        )
      )
        return;
      const h = handlers.current;
      if (e.key === "ArrowLeft") h.goPrev();
      else if (e.key === "ArrowRight") h.goNext();
      else if (
        (e.key === " " || e.key === "Enter") &&
        !target?.closest("button, a, [role='button']")
      ) {
        e.preventDefault();
        h.reveal();
      } else if (e.key === "1") h.rate("learning");
      else if (e.key === "2") h.rate("known");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return {
    isMobile,
    isOpen,
    card,
    position,
    total,
    progress,
    prevCard,
    nextCard,
    rating,
    revealed,
    reveal,
    close,
    goPrev,
    goNext,
    rate,
  };
};

export default useContainer;
