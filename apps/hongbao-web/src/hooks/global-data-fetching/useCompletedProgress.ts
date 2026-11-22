import useApiQuery from "@/hooks/fetching/useApiQuery";
import { QueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useCallback, useMemo } from "react";

/**
 * Shared backing for `useCompletedVideos` / `useCompletedQuizzes`: the
 * `learning-progress/{video|quiz}/completed` endpoints return every completed
 * id of that type for the current user.
 */
export type TCompletedProgress = {
  count: number;
  ids: string[];
};

type TCompletedResponse = { data: TCompletedProgress };

const selectData = (res: TCompletedResponse) => res?.data;
const EMPTY_IDS: string[] = [];

/** The list only changes through our own "mark complete" calls, which write
 * straight into the cache - so it never needs refetching on mount. */
const STALE_TIME = 5 * 60 * 1000;

export const useCompletedProgress = (
  url: string,
  keyFor: (userId?: string) => unknown[],
) => {
  const { userId } = useParams();
  const uid = Array.isArray(userId) ? userId[0] : userId;

  const { data, isLoading } = useApiQuery<
    TCompletedResponse,
    TCompletedProgress
  >({
    url,
    key: keyFor(uid),
    enabled: !!uid,
    select: selectData,
    staleTime: STALE_TIME,
  });

  const completedIds = data?.ids ?? EMPTY_IDS;
  const completedSet = useMemo(() => new Set(completedIds), [completedIds]);
  /** Prefer the server's own count - `ids` is only what it chose to send. */
  const completedCount = data?.count ?? completedIds.length;

  const isCompleted = useCallback(
    (id?: string) => !!id && completedSet.has(id),
    [completedSet],
  );

  return { completedIds, completedSet, completedCount, isCompleted, isLoading };
};

/** Records a completion in the cached list instead of refetching it. */
export const addCompletedToCache = (
  queryClient: QueryClient,
  key: unknown[],
  id: string,
) => {
  queryClient.setQueryData<TCompletedResponse>(key, (prev) => {
    if (!prev?.data) return prev;
    if (prev.data.ids.includes(id)) return prev;
    return {
      ...prev,
      data: { ids: [id, ...prev.data.ids], count: prev.data.count + 1 },
    };
  });
};
