import { useEditDrawer } from "@/providers/EditDrawerProvider";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useCards from "../../../../hooks/data-fetching/useCards";
import useFlashcards from "../../../../hooks/data-fetching/useFlashcards";
import { DEFAULT_PAGE_SIZE } from "@/constants/pagination";

const useContainer = () => {
  const filterForm = useForm({
    mode: "onChange",
  });
  const flashcardId = filterForm.watch("flashcardId");
  const [params, setParams] = useState({ limit: DEFAULT_PAGE_SIZE, page: 1 });

  // A new filter changes the result set, so start again from page 1.
  useEffect(() => {
    setParams((prev) => ({ ...prev, page: 1 }));
  }, [flashcardId]);

  const { open, opened } = useEditDrawer();
  const [importOpened, { open: openImport, close: closeImport }] =
    useDisclosure(false);
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
    importOpened,
    openImport,
    closeImport,
  };
};

export default useContainer;
