export type TTrueOrFalseOption = { value: string; label: string };

/** True/false questions store options as `{ value: id, label }` and the answer
 * as the correct option's id, like multiple choice. Older questions stored
 * plain option strings and the answer as the option text; this converts that
 * legacy shape. `makeId` creates ids for legacy options - the editor passes
 * `nanoid` so they are saved as real ids; read-only callers can keep the
 * stable default. */
export const normalizeTrueOrFalse = (
  options: unknown[] = [],
  answer = "",
  makeId: (index: number) => string = (i) => `option-${i}`,
): { options: TTrueOrFalseOption[]; answer: string } => {
  const normalized = options.map((o, i) =>
    typeof o === "string"
      ? { label: o, value: makeId(i) }
      : (o as TTrueOrFalseOption),
  );
  const matched =
    normalized.find((o) => o.value === answer) ??
    normalized.find((o) => o.label === answer);
  return { options: normalized, answer: matched?.value ?? answer };
};
