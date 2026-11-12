import useApiQuery from "../fetching/useApiQuery";

export type TFlashcardExampleUsage = {
  pinyin: string;
  chinese: string;
  meaningEn: string;
  meaningMm: string;
};

export type TFlashcardCategory = {
  id: string;
  name: string;
};

export type TFlashcard = {
  id: string;
  cnWord: string;
  pinyin: string;
  type: string;
  meaningEn: string;
  meaningMm: string;
  exampleUsage: TFlashcardExampleUsage[];
  category: TFlashcardCategory | null;
};

type TUseAllFlashcardListParams = {
  /** When set, only flashcards in this category are fetched. */
  categoryId?: string;
};

/** Public flashcard deck (`all-flashcards`), shared by the profile flashcards page and stats. */
const useAllFlashcardList = ({
  categoryId,
}: TUseAllFlashcardListParams = {}) => {
  const { data: flashcards, isLoading } = useApiQuery<
    { data: TFlashcard[] },
    TFlashcard[]
  >({
    url: `all-flashcards`,
    key: ["all-flashcards", categoryId ?? "all"],
    params: categoryId ? { categoryId } : undefined,
    select: (data) => data?.data,
  });

  return {
    flashcards: flashcards || [],
    isLoading,
  };
};

export default useAllFlashcardList;
