import { parseCsv, toCsvCell } from "@/utils/parseCsv";
import { CreateFeedbackSchema, type CreateFeedbackRequest } from "@repo/shared";

const REQUIRED_COLUMNS = ["name", "content"] as const;
const DEFAULT_RATING = 5;

export type TCsvFeedbackRow = {
  /** Line number in the CSV file (header is line 1). */
  line: number;
  payload: CreateFeedbackRequest;
  /** Validation problem; rows with an error are never sent. */
  error?: string;
};

export const buildFeedbackCsvTemplate = () => {
  const header = ["name", "position", "content", "rating"];
  const sample = [
    "Alice Chen",
    "HSK 4 learner",
    "This platform helped me pass HSK4 in just 3 months!",
    "5",
  ];
  return [header, sample].map((r) => r.map(toCsvCell).join(",")).join("\r\n");
};

/**
 * Turn CSV text into feedback rows. Headers are matched case-insensitively.
 * `name` and `content` are required columns; `position` and `rating` are
 * optional (an empty rating defaults to 5).
 */
export const parseFeedbackCsv = (text: string): TCsvFeedbackRow[] => {
  const [headerRow, ...dataRows] = parseCsv(text);
  if (!headerRow) throw new Error("The CSV file is empty.");

  const index = new Map(
    headerRow.map((h, i) => [h.trim().toLowerCase(), i] as const),
  );
  const missing = REQUIRED_COLUMNS.filter((c) => !index.has(c));
  if (missing.length) {
    throw new Error(`Missing column(s): ${missing.join(", ")}`);
  }

  return dataRows.map((cells, i) => {
    const get = (column: "name" | "position" | "content" | "rating") =>
      (cells[index.get(column) ?? -1] ?? "").trim();

    const rawRating = get("rating");
    const payload = {
      name: get("name"),
      position: get("position") || null,
      content: get("content"),
      rating: rawRating ? Number(rawRating) : DEFAULT_RATING,
    };

    return { line: i + 2, payload, error: validateRow(payload, rawRating) };
  });
};

const validateRow = (
  payload: TCsvFeedbackRow["payload"],
  rawRating: string,
): string | undefined => {
  const emptyColumns = REQUIRED_COLUMNS.filter((c) => !payload[c]);
  if (emptyColumns.length) return `Empty: ${emptyColumns.join(", ")}`;

  const rating = payload.rating ?? DEFAULT_RATING;
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return `Rating must be a whole number from 1 to 5 (got "${rawRating}")`;
  }

  const result = CreateFeedbackSchema.safeParse(payload);
  if (!result.success) {
    const issue = result.error.issues[0];
    return `${issue?.path.join(".") || "row"}: ${issue?.message}`;
  }
  return undefined;
};
