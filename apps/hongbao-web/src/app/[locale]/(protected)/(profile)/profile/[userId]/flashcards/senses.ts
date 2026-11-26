/**
 * Splits a gloss like "to be; yes" into its separate senses. Only semicolons
 * are treated as sense separators - commas often belong inside one sense
 * ("to look, to watch").
 */
export const splitSenses = (meaning?: string | null): string[] =>
  (meaning ?? "")
    .split(/[;；]/)
    .map((s) => s.trim())
    .filter(Boolean);
