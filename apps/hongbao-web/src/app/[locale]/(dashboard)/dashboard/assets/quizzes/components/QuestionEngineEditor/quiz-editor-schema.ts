import { FieldErrors } from "react-hook-form";
import { z } from "zod";
import { QuestionType } from "@repo/shared";
import { nanoid } from "nanoid";

const MultipleChoiceSchema = z.object({
  type: z.literal(QuestionType.MULTIPLE_CHOICES),
  title: z.string(), // Choose the correct answer
  data: z.object({
    question: z.string(), // Nice ---- meet you
    options: z.array(
      z.object({
        value: z.nanoid(),
        label: z.string(),
      }),
    ), // a.) to b.) in c.)or d.)up
    answer: z.nanoid(), // to
  }),
});
const RearrangeSchema = z.object({
  type: z.literal(QuestionType.REARRANGE),
  title: z.string(), // Re-arrange to get the correct answer
  data: z.object({
    questions: z.array(
      z.object({
        value: z.string(),
        label: z.string(),
      }),
    ), // [{ value: id, label: 'nice' }, ...] in the order learners see them
    answers: z.array(z.string()), // word ids in the correct order
  }),
});
const TrueOrFalseSchema = z.object({
  type: z.literal(QuestionType.TRUE_OR_FALSE),
  title: z.string(),
  data: z.object({
    question: z.string(),
    options: z
      .array(
        z.object({
          value: z.nanoid(),
          label: z.string().min(1, "Option can't be empty"),
        }),
      )
      .min(2, "Add the True and False options"), // [{ value: id, label: "True" }, { value: id, label: "False" }]
    answer: z.nanoid("Choose the correct answer"), // id of the correct option
  }),
});

export const QuizSchema = z.discriminatedUnion("type", [
  MultipleChoiceSchema,
  TrueOrFalseSchema,
  RearrangeSchema,
]);
export type QuizFormField = z.infer<typeof QuizSchema>;

const REARRANGE_INITIAL_SLOTS = 4;

/** The fixed True / False options, each with its own id. */
export const getTrueOrFalseOptions = () =>
  ["True", "False"].map((label) => ({ value: nanoid(), label }));

/** Blank form values for a question type. Switching type resets to these so
 * every field is defined (an untouched `undefined` field fails validation). */
export const getEmptyValues = (type: QuestionType): QuizFormField => {
  switch (type) {
    case QuestionType.REARRANGE:
      return {
        type,
        title: "Re-arrange to get the correct answer",
        // Start with 4 empty word slots; answers fill in as words are typed.
        data: {
          questions: Array.from({ length: REARRANGE_INITIAL_SLOTS }, () => ({
            value: nanoid(),
            label: "",
          })),
          answers: [],
        },
      };
    case QuestionType.TRUE_OR_FALSE:
      return {
        type,
        title: "Choose true or false",
        data: { question: "", options: getTrueOrFalseOptions(), answer: "" },
      };
    default:
      return {
        type: QuestionType.MULTIPLE_CHOICES,
        title: "Choose the correct answer",
        data: { question: "", options: [], answer: "" },
      };
  }
};

/** First validation message in a (possibly nested) errors object, so a failed
 * submit can tell the user what's missing instead of silently doing nothing. */
export const getFirstErrorMessage = (
  errors: FieldErrors | undefined,
): string | undefined => {
  if (!errors || typeof errors !== "object") return undefined;
  if (typeof errors.message === "string" && errors.message) {
    return errors.message;
  }
  for (const [key, value] of Object.entries(errors)) {
    if (key === "ref") continue;
    const message = getFirstErrorMessage(value as FieldErrors);
    if (message) return message;
  }
  return undefined;
};
