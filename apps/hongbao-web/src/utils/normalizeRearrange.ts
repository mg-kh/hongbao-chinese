export type TRearrangeWord = { value: string; label: string };

/** Re-arrange questions store each word as `{ value: id, label: word }` and
 * the answer as the word ids in the correct order (like multiple choice).
 * Older questions stored plain word strings for both; this converts that
 * legacy shape, matching each answer word to an unused question word. */
export const normalizeRearrange = (
  questions: unknown[] = [],
  answers: unknown[] = [],
): { questions: TRearrangeWord[]; answers: string[] } => {
  const words: TRearrangeWord[] = questions.map((q, i) =>
    typeof q === "string"
      ? { value: `word-${i}`, label: q }
      : (q as TRearrangeWord),
  );

  const used = new Set<string>();
  const answerIds: string[] = [];
  answers.forEach((a) => {
    if (typeof a !== "string") return;
    const match =
      words.find((w) => w.value === a && !used.has(w.value)) ??
      words.find((w) => w.label === a && !used.has(w.value));
    if (match) {
      used.add(match.value);
      answerIds.push(match.value);
    }
  });

  return { questions: words, answers: answerIds };
};

/** Resolves an ordered list of word ids to their words. */
export const rearrangeLabels = (words: TRearrangeWord[], ids: string[] = []) =>
  ids.map((id) => words.find((w) => w.value === id)?.label ?? "");
