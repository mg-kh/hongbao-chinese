/**
 * Tone helpers for the flashcard dialog. Coloring hanzi + pinyin by tone (the
 * convention Pleco, Skritter and most Chinese SRS decks use) turns the tone
 * into a visual cue, which helps it stick alongside the character.
 */

const TONE_MARKS: Record<string, number> = {
  ā: 1, á: 2, ǎ: 3, à: 4,
  ē: 1, é: 2, ě: 3, è: 4,
  ī: 1, í: 2, ǐ: 3, ì: 4,
  ō: 1, ó: 2, ǒ: 3, ò: 4,
  ū: 1, ú: 2, ǔ: 3, ù: 4,
  ǖ: 1, ǘ: 2, ǚ: 3, ǜ: 4,
};

/** Pleco-style palette: 1 red · 2 orange · 3 green · 4 blue · neutral gray. */
export const TONE_CLASS: Record<number, string> = {
  1: "text-red-600!",
  2: "text-orange-500!",
  3: "text-green-600!",
  4: "text-blue-600!",
  5: "text-gray-500!",
};

/** Matches CJK ideographs (incl. Extension A/B and compatibility blocks). */
const CJK_CHAR = /[㐀-䶿一-鿿豈-﫿\u{20000}-\u{2FA1F}]/u;

/** Tone (1-5) of a single pinyin syllable, from its diacritic or trailing digit. */
export const toneOf = (syllable: string): number => {
  for (const ch of syllable.normalize("NFC").toLowerCase()) {
    if (TONE_MARKS[ch]) return TONE_MARKS[ch];
  }
  const digit = syllable.match(/([1-5])$/);
  return digit ? Number(digit[1]) : 5;
};

export type TToneSegment = { hanzi: string; pinyin: string; tone: number };

/**
 * Pairs each character of `word` with its pinyin syllable. Only succeeds when
 * the pinyin is space/apostrophe separated one syllable per character -
 * splitting joined pinyin ("nǐhǎo") is ambiguous, and a wrong color is worse
 * than none, so callers fall back to plain text when this returns null.
 */
export const segmentByTone = (
  word: string,
  pinyin: string,
): TToneSegment[] | null => {
  const chars = Array.from(word ?? "").filter((c) => CJK_CHAR.test(c));
  const syllables = (pinyin ?? "")
    .trim()
    .split(/[\s']+/)
    .filter(Boolean);
  if (chars.length === 0 || chars.length !== syllables.length) return null;
  return chars.map((hanzi, i) => ({
    hanzi,
    pinyin: syllables[i],
    tone: toneOf(syllables[i]),
  }));
};
