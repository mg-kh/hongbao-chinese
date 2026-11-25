"use client";

import useAllCategoryList from "@/hooks/global-data-fetching/useAllCategoryList";
import useAllCardList from "@/hooks/global-data-fetching/useAllCardList";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { markLearned } from "../../learned";

export const ALL_CATEGORIES = "all";

const useContainer = () => {
  const { userId } = useParams();
  const uid = String(userId);

  const [category, setCategory] = useState<string>(ALL_CATEGORIES);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [showPinyin, setShowPinyin] = useState(true);

  const { cards, isLoading } = useAllCardList({
    categoryId: category === ALL_CATEGORIES ? undefined : category,
  });
  const { categoryOptions } = useAllCategoryList();

  const categorySelectData = useMemo(
    () => [
      { label: "All categories", value: ALL_CATEGORIES },
      ...categoryOptions,
    ],
    [categoryOptions],
  );

  // the filtered list changes under an open dialog when the category
  // changes - close it rather than risk showing a stale index.
  useEffect(() => {
    setActiveIndex(null);
  }, [category]);

  const handleCategoryChange = (value: string | null) =>
    setCategory(value ?? ALL_CATEGORIES);

  const openAt = (index: number) => {
    setActiveIndex(index);
    setFlipped(false);
  };
  const closeDialog = () => setActiveIndex(null);
  const goTo = (index: number) => {
    if (index < 0 || index >= cards.length) return;
    setActiveIndex(index);
    setFlipped(false);
  };
  const goPrev = () => {
    if (activeIndex !== null) goTo(activeIndex - 1);
  };
  const goNext = () => {
    if (activeIndex !== null) goTo(activeIndex + 1);
  };

  // flipping to the back reveals the answer - treat that as "learned" for
  // the profile stat, regardless of whether it was triggered by click or keyboard.
  const toggleFlip = () => {
    setFlipped((f) => {
      const next = !f;
      if (next && activeIndex !== null) markLearned(uid, cards[activeIndex].id);
      return next;
    });
  };
  const toggleShowPinyin = () => setShowPinyin((v) => !v);

  useEffect(() => {
    if (activeIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        toggleFlip();
      } else if (e.key === "ArrowLeft") {
        goTo(activeIndex - 1);
      } else if (e.key === "ArrowRight") {
        goTo(activeIndex + 1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, cards.length]);

  const activeCard = activeIndex !== null ? cards[activeIndex] : null;

  return {
    userId,
    isLoading,
    cards,
    category,
    handleCategoryChange,
    categorySelectData,
    activeCard,
    activeIndex,
    flipped,
    showPinyin,
    openAt,
    closeDialog,
    goPrev,
    goNext,
    toggleFlip,
    toggleShowPinyin,
  };
};

export default useContainer;
