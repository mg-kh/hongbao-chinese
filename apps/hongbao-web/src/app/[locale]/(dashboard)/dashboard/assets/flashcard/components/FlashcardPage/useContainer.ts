import { useEditDrawer } from "@/providers/EditDrawerProvider";
import useFlashcards from "../../../../hooks/data-fetching/useFlashcards";

const useContainer = () => {
  const { open, opened } = useEditDrawer();

  const { data: flashcardRes, isLoading } = useFlashcards();
  return { open, opened, flashcardRes, isLoading };
};

export default useContainer;
