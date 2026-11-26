/**
 * Self-ratings on flashcards ("Still learning" / "Got it"), Quizlet-style.
 * Like `learned.ts` there's no backend endpoint yet, so they live in
 * localStorage - they persist on this device/browser but don't sync.
 */
export type TRating = "learning" | "known";

const storageKey = (userId: string) => `hongbao:flashcards-ratings:${userId}`;

export const loadRatings = (userId: string): Record<string, TRating> => {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(storageKey(userId));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

// same-tab subscribers (the `storage` event only fires in other tabs)
const listeners = new Set<() => void>();

/** For `useSyncExternalStore`: notified on saves here and in other tabs. */
export const subscribeRatings = (onChange: () => void) => {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
};

/** One card's rating; `undefined` on the server and when unrated. */
export const getRating = (userId: string, cardId: string) =>
  loadRatings(userId)[cardId] as TRating | undefined;

export const saveRating = (userId: string, cardId: string, rating: TRating) => {
  if (typeof window === "undefined") return;
  try {
    const ratings = loadRatings(userId);
    ratings[cardId] = rating;
    window.localStorage.setItem(storageKey(userId), JSON.stringify(ratings));
  } catch {
    // localStorage unavailable (private mode / quota) - rating just won't persist
  }
  listeners.forEach((l) => l());
};
