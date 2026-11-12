export type Rating = "again" | "hard" | "good" | "easy";

export type CardProgress = {
  interval: number; // days until next due
  ease: number;
  reps: number;
  dueAt: number; // epoch ms
};

const DAY_MS = 24 * 60 * 60 * 1000;

export const initialProgress = (): CardProgress => ({
  interval: 0,
  ease: 2.5,
  reps: 0,
  dueAt: Date.now(),
});

/** SM-2-style interval growth, simplified for a lightweight client-only scheduler. */
export const nextInterval = (progress: CardProgress, rating: Rating) => {
  switch (rating) {
    case "again":
      return 0;
    case "hard":
      return Math.max(1, Math.round((progress.interval || 1) * 1.2));
    case "good":
      return progress.reps === 0
        ? 1
        : Math.round(progress.interval * progress.ease);
    case "easy":
      return progress.reps === 0
        ? 3
        : Math.round(progress.interval * progress.ease * 1.3);
  }
};

export const schedule = (
  progress: CardProgress,
  rating: Rating,
): CardProgress => {
  const interval = nextInterval(progress, rating);
  const ease =
    rating === "again"
      ? Math.max(1.3, progress.ease - 0.2)
      : rating === "hard"
        ? Math.max(1.3, progress.ease - 0.15)
        : rating === "easy"
          ? progress.ease + 0.15
          : progress.ease;

  return {
    interval,
    ease,
    reps: rating === "again" ? 0 : progress.reps + 1,
    dueAt: Date.now() + interval * DAY_MS,
  };
};

export const formatInterval = (days: number) => {
  if (days <= 0) return "now";
  if (days < 1) return "<1d";
  if (days < 30) return `${days}d`;
  return `${Math.round(days / 30)}mo`;
};

const storageKey = (userId: string) => `hongbao:srs:${userId}`;

/**
 * There is no backend SRS endpoint yet, so review progress is kept in
 * localStorage - it survives reloads on this device/browser but won't sync
 * across devices until a real endpoint exists.
 */
export const loadProgress = (
  userId: string,
): Record<string, CardProgress> => {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(storageKey(userId));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const saveProgress = (
  userId: string,
  data: Record<string, CardProgress>,
) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey(userId), JSON.stringify(data));
  } catch {
    // localStorage unavailable (private mode / quota) - progress just won't persist
  }
};
