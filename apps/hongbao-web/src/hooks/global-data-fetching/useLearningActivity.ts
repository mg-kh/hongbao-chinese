import useApiQuery from "@/hooks/fetching/useApiQuery";
import { useParams } from "next/navigation";
import { useMemo } from "react";

/**
 * Days on which the user completed anything (video, quiz, ...), backed by
 * `learning-progress/activity`. The API returns raw completion timestamps;
 * they're bucketed into local calendar days here so "today" matches the
 * user's own timezone.
 */
type TActivityResponse = {
  data: { completedAt: string[]; firstCompletedAt?: string | null };
};
type TActivity = { completedAt: string[]; firstCompletedAt: string | null };

/** `learningActivityKey(userId)` alone is the prefix of every variant, so
 * invalidating it refreshes all cached days/years at once. */
export const learningActivityKey = (
  userId?: string,
  days?: number,
  year?: number,
) =>
  days === undefined
    ? ["learning-activity", userId]
    : ["learning-activity", userId, days, year ?? "recent"];

/** Only changes through our own "mark complete" calls, which invalidate it -
 * so revisiting the profile doesn't need to refetch. */
const STALE_TIME = 5 * 60 * 1000;

/** Local-time `YYYY-MM-DD` key for a date. */
export const toDayKey = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const selectData = (res: TActivityResponse): TActivity => ({
  completedAt: res?.data?.completedAt ?? [],
  firstCompletedAt: res?.data?.firstCompletedAt ?? null,
});

/**
 * @param days  Look-back window from today (used when `year` is omitted).
 * @param year  Fetch that whole calendar year instead of the last `days`.
 */
export const useLearningActivity = (days = 120, year?: number) => {
  const { userId } = useParams();
  const uid = Array.isArray(userId) ? userId[0] : userId;

  const { data, isLoading } = useApiQuery<TActivityResponse, TActivity>({
    url: "learning-progress/activity",
    params: year === undefined ? { days } : { days, year },
    key: learningActivityKey(uid, days, year),
    enabled: !!uid,
    select: selectData,
    staleTime: STALE_TIME,
  });

  /** Completions per local day (`YYYY-MM-DD` -> count). */
  const dayCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const iso of data?.completedAt ?? []) {
      const key = toDayKey(new Date(iso));
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return counts;
  }, [data]);

  /** Consecutive active days ending today - or yesterday, so the streak
   * isn't shown as broken before the user has studied today. */
  const currentStreak = useMemo(() => {
    const cursor = new Date();
    if (!dayCounts.has(toDayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
    let streak = 0;
    while (dayCounts.has(toDayKey(cursor))) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
  }, [dayCounts]);

  /** Local year of the user's earliest completion ever, if any. */
  const firstActivityYear = data?.firstCompletedAt
    ? new Date(data.firstCompletedAt).getFullYear()
    : null;

  return { dayCounts, currentStreak, firstActivityYear, isLoading };
};
