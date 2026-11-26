import { useMemo } from "react";
import useApiQuery from "../fetching/useApiQuery";

export type TCardExampleUsage = {
  pinyin: string;
  chinese: string;
  meaningEn: string;
  meaningMm: string;
};

export type TCardCategory = {
  id: string;
  name: string;
};

export type TCard = {
  id: string;
  cnWord: string;
  pinyin: string;
  type: string;
  meaningEn: string;
  meaningMm: string;
  exampleUsage: TCardExampleUsage[];
  flashcard: {
    id: string;
    name: string;
    category: TCardCategory | null;
  } | null;
};

export type TMyFlashcard = {
  id: string;
  name: string;
  cardCount: number;
  category: TCardCategory | null;
  cards: Omit<TCard, "flashcard">[];
};

/**
 * Flashcard decks the current user is actively enrolled in
 * (`my-flashcards`), plus their cards flattened into one list. Shared by the
 * profile flashcards page and the profile stats.
 */
const useMyFlashcards = () => {
  const { data, isLoading } = useApiQuery<
    { data: TMyFlashcard[] },
    TMyFlashcard[]
  >({
    url: `my-flashcards`,
    key: "my-flashcards",
    select: (res) => res?.data,
  });

  const flashcards = useMemo(() => data ?? [], [data]);

  const cards = useMemo<TCard[]>(
    () =>
      flashcards.flatMap(({ cards, ...deck }) =>
        cards.map((card) => ({
          ...card,
          flashcard: { id: deck.id, name: deck.name, category: deck.category },
        })),
      ),
    [flashcards],
  );

  return { flashcards, cards, isLoading };
};

export default useMyFlashcards;

/** One enrolled deck with its cards (`my-flashcards/:id`). 404s if not enrolled. */
export const useMyFlashcardDetail = (flashcardId: string) => {
  const { data, isLoading, isError } = useApiQuery<
    { data: TMyFlashcard },
    TMyFlashcard
  >({
    url: `my-flashcards/${flashcardId}`,
    key: ["my-flashcards", flashcardId],
    select: (res) => res?.data,
    enabled: !!flashcardId,
    retry: false,
  });

  const cards = useMemo<TCard[]>(
    () =>
      data
        ? data.cards.map((card) => ({
            ...card,
            flashcard: {
              id: data.id,
              name: data.name,
              category: data.category,
            },
          }))
        : [],
    [data],
  );

  return { flashcard: data ?? null, cards, isLoading, isError };
};
