/**
 * Tracks which flashcards a user has flipped to reveal, so "learned" counts
 * elsewhere (e.g. the profile stats) reflect real activity. There's no
 * backend endpoint for this yet, so it's kept in localStorage - it persists
 * on this device/browser but won't sync across devices.
 */
const storageKey = (userId: string) => `hongbao:flashcards-learned:${userId}`;

export const loadLearnedIds = (userId: string): string[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(storageKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const markLearned = (userId: string, cardId: string) => {
  if (typeof window === "undefined") return;
  try {
    const ids = new Set(loadLearnedIds(userId));
    if (ids.has(cardId)) return;
    ids.add(cardId);
    window.localStorage.setItem(storageKey(userId), JSON.stringify([...ids]));
  } catch {
    // localStorage unavailable (private mode / quota) - progress just won't persist
  }
};
