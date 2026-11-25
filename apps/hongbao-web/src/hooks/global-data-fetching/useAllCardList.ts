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

type TUseAllCardListParams = {
  /** When set, only cards whose flashcard is in this category are fetched. */
  categoryId?: string;
  /** When set, only cards belonging to this flashcard (deck) are fetched. */
  flashcardId?: string;
};

/** Public card list (`all-cards`), shared by the profile flashcards page and stats. */
const useAllCardList = ({
  categoryId,
  flashcardId,
}: TUseAllCardListParams = {}) => {
  const { data: cards, isLoading } = useApiQuery<{ data: TCard[] }, TCard[]>({
    url: `all-cards`,
    key: ["all-cards", categoryId ?? "all", flashcardId ?? "all"],
    params:
      categoryId || flashcardId
        ? {
            ...(categoryId && { categoryId }),
            ...(flashcardId && { flashcardId }),
          }
        : undefined,
    select: (data) => data?.data,
  });

  return {
    cards: cards || [],
    isLoading,
  };
};

export default useAllCardList;
