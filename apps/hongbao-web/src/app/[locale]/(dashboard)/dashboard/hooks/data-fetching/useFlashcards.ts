import useApiQuery from "@/hooks/fetching/useApiQuery";
import { map } from "lodash";
import { useMemo } from "react";
import { TFlashcardRes } from "../../assets/flashcard/types/flashcard.type";

const useFlashcards = () => {
  const {
    data: flashcardRes,
    isLoading,
    isFetching,
  } = useApiQuery<{ data: TFlashcardRes[] }, TFlashcardRes[]>({
    url: `dashboard/flashcard`,
    key: "flashcard",
    select: (data) => data?.data,
  });

  const flashcardDropdownData = useMemo(() => {
    return map(flashcardRes, (f) => ({
      label: f.name,
      value: f.id,
    }));
  }, [flashcardRes]);

  return {
    data: flashcardRes || [],
    flashcardDropdownData: flashcardDropdownData || [],
    isLoading,
    isFetching,
  };
};

export default useFlashcards;
