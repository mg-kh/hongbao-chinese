export type THighlightPart = { text: string; match: boolean };

/** Splits `sentence` around every occurrence of `word` so the studied word can be emphasised in examples. */
export const splitHighlight = (
  sentence: string,
  word: string,
): THighlightPart[] => {
  if (!sentence) return [];
  if (!word) return [{ text: sentence, match: false }];
  return sentence
    .split(word)
    .flatMap((text, i) =>
      i === 0
        ? [{ text, match: false }]
        : [
            { text: word, match: true },
            { text, match: false },
          ],
    )
    .filter((part) => part.text.length > 0);
};
