import { parseCsv, toCsvCell } from "@/utils/parseCsv";
import { CreateCardSchema, type CreateCardRequest } from "@repo/shared";

const CARD_COLUMNS = [
  "cnWord",
  "pinyin",
  "type",
  "meaningEn",
  "meaningMm",
] as const;
const EXAMPLE_FIELDS = ["chinese", "pinyin", "meaningEn", "meaningMm"] as const;

export type TCsvCardRow = {
  /** Line number in the CSV file (header is line 1). */
  line: number;
  cnWord: string;
  payload: Omit<CreateCardRequest, "flashcardId">;
  /** Validation problem; rows with an error are never sent. */
  error?: string;
};

const exampleHeader = (n: number, field: (typeof EXAMPLE_FIELDS)[number]) =>
  `example${n}_${field}`;

export const buildCardCsvTemplate = () => {
  const header = [
    ...CARD_COLUMNS,
    ...[1, 2].flatMap((n) => EXAMPLE_FIELDS.map((f) => exampleHeader(n, f))),
  ];
  const sample = [
    "你好",
    "nǐ hǎo",
    "phrase",
    "hello",
    "မင်္ဂလာပါ",
    "你好，老师！",
    "nǐ hǎo, lǎoshī!",
    "Hello, teacher!",
    "မင်္ဂလာပါ ဆရာ",
    "",
    "",
    "",
    "",
  ];
  return [header, sample].map((r) => r.map(toCsvCell).join(",")).join("\r\n");
};

/**
 * Turn CSV text into card rows. Headers are matched case-insensitively.
 * Examples come from numbered column groups (example1_chinese,
 * example1_pinyin, example1_meaningEn, example1_meaningMm, example2_..., any
 * count); a group with every cell empty is skipped.
 */
export const parseCardCsv = (text: string): TCsvCardRow[] => {
  const [headerRow, ...dataRows] = parseCsv(text);
  if (!headerRow) throw new Error("The CSV file is empty.");

  const index = new Map(
    headerRow.map((h, i) => [h.trim().toLowerCase(), i] as const),
  );
  const missing = CARD_COLUMNS.filter((c) => !index.has(c.toLowerCase()));
  if (missing.length) {
    throw new Error(`Missing column(s): ${missing.join(", ")}`);
  }

  const exampleNumbers = Array.from(
    new Set(
      headerRow
        .map((h) => /^example(\d+)_/i.exec(h.trim())?.[1])
        .filter((n): n is string => !!n)
        .map(Number),
    ),
  ).sort((a, b) => a - b);

  return dataRows.map((cells, i) => {
    const get = (column: string) =>
      (cells[index.get(column.toLowerCase()) ?? -1] ?? "").trim();

    const exampleUsage = exampleNumbers
      .map((n) => ({
        n,
        values: Object.fromEntries(
          EXAMPLE_FIELDS.map((f) => [f, get(exampleHeader(n, f))]),
        ) as Record<(typeof EXAMPLE_FIELDS)[number], string>,
      }))
      .filter(({ values }) => Object.values(values).some(Boolean));

    const payload = {
      cnWord: get("cnWord"),
      pinyin: get("pinyin"),
      type: get("type"),
      meaningEn: get("meaningEn"),
      meaningMm: get("meaningMm"),
      exampleUsage: exampleUsage.map(({ values }) => values),
    };

    return {
      line: i + 2,
      cnWord: payload.cnWord,
      payload,
      error: validateRow(payload, exampleUsage),
    };
  });
};

const validateRow = (
  payload: TCsvCardRow["payload"],
  examples: { n: number; values: Record<string, string> }[],
): string | undefined => {
  const emptyColumns = CARD_COLUMNS.filter((c) => !payload[c]);
  if (emptyColumns.length) return `Empty: ${emptyColumns.join(", ")}`;

  // Same rule as the card drawer: at least one complete example.
  if (!examples.length) return "Needs at least one example";
  const partial = examples.find(({ values }) =>
    Object.values(values).some((v) => !v),
  );
  if (partial) return `Example ${partial.n} is incomplete`;

  const result = CreateCardSchema.safeParse(payload);
  if (!result.success) {
    const issue = result.error.issues[0];
    return `${issue?.path.join(".") || "row"}: ${issue?.message}`;
  }
  return undefined;
};
