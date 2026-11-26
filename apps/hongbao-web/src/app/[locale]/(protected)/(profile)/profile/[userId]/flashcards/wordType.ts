/** Human-readable labels for the short word-type codes coming from the API. */
const wordTypeLabels: Record<string, string> = {
  n: "noun",
  v: "verb",
  adj: "adjective",
  adv: "adverb",
  pron: "pronoun",
  num: "numeral",
  m: "measure word",
  prep: "preposition",
  conj: "conjunction",
  part: "particle",
  interj: "interjection",
};

export const wordTypeLabel = (type?: string | null) =>
  type ? (wordTypeLabels[type.toLowerCase()] ?? type) : null;
