import { useEditDrawer } from "@/providers/EditDrawerProvider";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useCards from "../../../../hooks/data-fetching/useCards";
import useFlashcards from "../../../../hooks/data-fetching/useFlashcards";

const useContainer = () => {
  const filterForm = useForm({
    mode: "onChange",
  });
  const flashcardId = filterForm.watch("flashcardId");
  const [params, setParams] = useState({ limit: "10", page: 1 });

  // A new filter changes the result set, so start again from page 1.
  useEffect(() => {
    setParams((prev) => ({ ...prev, page: 1 }));
  }, [flashcardId]);

  const { open, opened } = useEditDrawer();
  const {
    data: cardRes,
    isLoading,
    totalPages,
  } = useCards({
    flashcardId,
    page: params.page,
    limit: params.limit,
  });
  const { flashcardDropdownData, isLoading: flashcardDropdownDataLoading } =
    useFlashcards();

  return {
    open,
    opened,
    cardRes,
    isLoading,
    filterForm,
    flashcardDropdownData,
    flashcardDropdownDataLoading,
    params,
    setParams,
    totalPages,
  };
};

export default useContainer;
