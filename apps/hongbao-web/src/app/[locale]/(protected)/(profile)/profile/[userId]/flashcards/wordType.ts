/**
 * Message keys (under `Profile.Flashcards.WordType`) for the short word-type
 * codes coming from the API.
 */
const wordTypeKeys = {
  n: "noun",
  v: "verb",
  adj: "adjective",
  adv: "adverb",
  pron: "pronoun",
  num: "numeral",
  m: "measure_word",
  prep: "preposition",
  conj: "conjunction",
  part: "particle",
  interj: "interjection",
} as const;

export type TWordTypeKey = (typeof wordTypeKeys)[keyof typeof wordTypeKeys];

/** Human-readable label for a word-type code; unknown codes are shown as-is. */
export const wordTypeLabel = (
  type: string | null | undefined,
  translate: (key: TWordTypeKey) => string,
) => {
  if (!type) return null;
  const key = wordTypeKeys[type.toLowerCase() as keyof typeof wordTypeKeys];
  return key ? translate(key) : type;
};
