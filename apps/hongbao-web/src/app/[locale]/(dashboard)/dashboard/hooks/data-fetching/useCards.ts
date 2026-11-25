import useApiQuery from "@/hooks/fetching/useApiQuery";
import { TCardListRes } from "../../assets/card/types/card.type";

type TCardFilter = {
  flashcardId?: string | null;
  page?: number;
  limit?: number | string;
};

const useCards = ({ flashcardId, page = 1, limit = 10 }: TCardFilter = {}) => {
  const { data, isLoading, isFetching } = useApiQuery<
    { data: TCardListRes },
    TCardListRes
  >({
    url: `dashboard/card`,
    key: "card",
    params: {
      page,
      limit,
      ...(flashcardId && { flashcardId }),
    },
    select: (res) => res?.data,
  });

  return {
    data: data?.items || [],
    totalPages: data?.totalPage || 1,
    total: data?.total || 0,
    isLoading,
    isFetching,
  };
};

export default useCards;
