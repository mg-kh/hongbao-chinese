import useProfile from "@/hooks/global-data-fetching/useProfile";
import {
  toDayKey,
  useLearningActivity,
} from "@/hooks/global-data-fetching/useLearningActivity";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";

/** Jan 1 to today is at most 366 days, which is also the API's cap. The
 * current year is fetched as "last 366 days" rather than by year so a streak
 * running across Jan 1 still counts its days from last December. */
const FETCH_DAYS = 366;
/** Smallest a day cell may shrink to before the calendar scrolls (px). */
const MIN_CELL = 10;
export const CELL_GAP = 3;

export type TStreakCell = {
  key: string;
  /** Hidden placeholder: padding days from the previous/next year. */
  isOutside: boolean;
  /** After today - drawn faintly so the whole year's shape shows. Never
   * true when viewing a past year. */
  isFuture: boolean;
  count: number;
  level: TIntensity;
  /** Accessible one-liner, e.g. "Mon, Nov 23, 2026: 2 completions". */
  label: string;
  /** Tooltip parts: the date and a short activity summary. */
  dateLabel: string;
  summary: string;
};

/** Intensity level 0-4 from the number of completions in a day. */
export type TIntensity = 0 | 1 | 2 | 3 | 4;

const intensityFor = (count: number): TIntensity => {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count <= 4) return 3;
  return 4;
};

// Created once: `toLocaleDateString` builds a new formatter on every call,
// and the calendar formats ~370 dates. Locale is pinned so server and client
// render identical text (matches the rest of the profile card).
const dayFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
});
const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "short" });

/** Date-only facts about a cell - independent of the fetched data. */
type TCalendarDay = {
  key: string;
  dateLabel: string;
  isOutside: boolean;
  isFuture: boolean;
};

/** Mon..Sun week columns covering `year`, Jan 1 to Dec 31. `todayColumn`
 * is the column holding today, or -1 when today isn't in `year`. */
const buildCalendar = (year: number, today: Date) => {
  const rangeStart = new Date(year, 0, 1);
  const rangeEnd = new Date(year, 11, 31);
  const gridStart = new Date(rangeStart);
  gridStart.setDate(gridStart.getDate() - ((gridStart.getDay() + 6) % 7));

  const todayKey = toDayKey(today);
  const rangeStartKey = toDayKey(rangeStart);
  const rangeEndKey = toDayKey(rangeEnd);

  const days: TCalendarDay[] = [];
  const monthLabels: string[] = [];
  let todayColumn = -1;
  const cursor = new Date(gridStart);

  // Column-major (week by week), matching `grid-flow-col`.
  while (toDayKey(cursor) <= rangeEndKey) {
    let monthLabel = "";
    for (let d = 0; d < 7; d++) {
      const key = toDayKey(cursor);
      // One label per month, above the column holding that month's 1st.
      if (cursor.getDate() === 1 && cursor.getFullYear() === year) {
        monthLabel = monthFormatter.format(cursor);
      }
      if (key === todayKey) todayColumn = monthLabels.length;
      // YYYY-MM-DD keys sort lexically, so string compares are enough.
      days.push({
        key,
        dateLabel: dayFormatter.format(cursor),
        isOutside: key < rangeStartKey || key > rangeEndKey,
        isFuture: key > todayKey,
      });
      cursor.setDate(cursor.getDate() + 1);
    }
    monthLabels.push(monthLabel);
  }

  return { days, monthLabels, todayColumn };
};

const useContainer = () => {
  const { data: user } = useProfile();
  const t = useTranslations("Profile.LearningStreak");

  // Created once - "today" doesn't need to tick over while the page is open.
  const [today] = useState(() => new Date());
  const currentYear = today.getFullYear();
  const [year, setYear] = useState(currentYear);

  /** Earliest year worth showing: the year the account was created. */
  const isCurrentYear = year === currentYear;

  // The current-year query is always loaded (it also backs the streak), so
  // the earliest-activity year comes from it and stays stable while a past
  // year is loading. When viewing the current year both calls share one
  // cache entry, so nothing is fetched twice.
  const recent = useLearningActivity(FETCH_DAYS);
  const selected = useLearningActivity(
    FETCH_DAYS,
    isCurrentYear ? undefined : year,
  );
  const { dayCounts, isLoading } = selected;
  const { currentStreak, firstActivityYear } = recent;

  /** Earliest year worth showing: whichever is earlier of the account's
   * creation and its first recorded completion. */
  const firstYear = Math.min(
    currentYear,
    user?.createdAt ? new Date(user.createdAt).getFullYear() : currentYear,
    firstActivityYear ?? currentYear,
  );

  const canGoPrev = year > firstYear;
  const canGoNext = year < currentYear;
  const goPrev = () => canGoPrev && setYear((y) => y - 1);
  const goNext = () => canGoNext && setYear((y) => y + 1);

  // Rebuilt only when the year changes - none of it depends on the data.
  const { days, monthLabels, todayColumn } = useMemo(
    () => buildCalendar(year, today),
    [year, today],
  );
  const weeks = monthLabels.length;

  /** Only the data-dependent part re-runs when the activity changes. */
  const cells = useMemo<TStreakCell[]>(
    () =>
      days.map((day) => {
        const count = day.isFuture ? 0 : (dayCounts.get(day.key) ?? 0);
        const summary = day.isFuture
          ? t("upcoming")
          : count === 0
            ? t("no_activity")
            : t("completions", { count });
        return {
          key: day.key,
          isOutside: day.isOutside,
          isFuture: day.isFuture,
          count,
          level: intensityFor(count),
          label: `${day.dateLabel}: ${summary}`,
          dateLabel: day.dateLabel,
          summary,
        };
      }),
    [days, dayCounts, t],
  );

  /** Days in `year` with at least one completion - the past-year summary. */
  const activeDays = useMemo(
    () => cells.filter((c) => !c.isOutside && c.count > 0).length,
    [cells],
  );

  const gridStyle = useMemo(
    () => ({
      gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))`,
      gap: CELL_GAP,
    }),
    [weeks],
  );
  const scrollAreaStyle = useMemo(
    () => ({ minWidth: weeks * (MIN_CELL + CELL_GAP) }),
    [weeks],
  );

  // On narrow screens the full year scrolls sideways - start with today's
  // week centred in view, or at January for a past year.
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (todayColumn < 0) {
      el.scrollLeft = 0;
      return;
    }
    const columnWidth = el.scrollWidth / weeks;
    el.scrollLeft = (todayColumn + 0.5) * columnWidth - el.clientWidth / 2;
  }, [isLoading, weeks, todayColumn]);

  return {
    year,
    isCurrentYear,
    canGoPrev,
    canGoNext,
    goPrev,
    goNext,
    activeDays,
    scrollRef,
    gridStyle,
    scrollAreaStyle,
    cells,
    monthLabels,
    currentStreak,
    isLoading,
  };
};

export default useContainer;
