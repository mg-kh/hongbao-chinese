import { Badge, Box, Group, Paper, Stack, Text } from "@mantine/core";
import { ArrowCounterClockwiseIcon, CheckIcon } from "@phosphor-icons/react";
import { useFormContext, useWatch } from "react-hook-form";
import { decodeEscapedHtml } from "@/utils/decodeEscapedHtml";
import { QuizAnswersFormField } from "../../quiz-answers-schema";
import { QuestionType, TAnswer, TQuizQuestion } from "../../types/quiz.type";

interface Props {
  question: TQuizQuestion;
}

const typeLabel: Record<string, string> = {
  [QuestionType.MULTIPLE_CHOICES]: "Multiple choice",
  [QuestionType.TRUE_OR_FALSE]: "True or false",
  [QuestionType.REARRANGE]: "Re-arrange",
};

/** A - B - C … so options are referable and easier to scan. */
const optionLetter = (i: number) => String.fromCharCode(65 + i);

const QuestionCard: React.FC<Props> = ({ question }) => {
  const { control, setValue } = useFormContext<QuizAnswersFormField>();
  const answer = useWatch({
    control,
    name: `answers.${question.id}`,
  }) as TAnswer;

  const setAnswer = (value: TAnswer) =>
    setValue(`answers.${question.id}`, value, {
      shouldDirty: true,
      shouldValidate: true,
    });

  const isRearrange = question.type === QuestionType.REARRANGE;
  const picked = Array.isArray(answer) ? answer : [];
  const bank = question.data.questions || [];

  const onSelect = (value: string) => setAnswer(value);
  const onPushWord = (word: string) => setAnswer([...picked, word]);
  const onPopWordAt = (position: number) =>
    setAnswer(picked.filter((_, i) => i !== position));

  /** A word is spent once it's been used as many times as it appears. */
  const remaining = bank.filter((word, i) => {
    const usedBefore = bank.slice(0, i).filter((w) => w === word).length;
    const usedTotal = picked.filter((w) => w === word).length;
    return usedTotal <= usedBefore;
  });

  return (
    <Paper
      withBorder
      bdrs={20}
      p={{ base: 18, sm: 28 }}
      className="border-gray-200! bg-white! shadow-sm!"
    >
      <Stack gap={18}>
        <Group gap={10} wrap="wrap">
          <Badge size="sm" radius="sm" variant="light" color="hongbao-red">
            {typeLabel[question.type] ?? "Question"}
          </Badge>
          <Text
            component="div"
            size="sm"
            c="gray.6"
            className="[&_p]:m-0!"
            dangerouslySetInnerHTML={{
              __html: decodeEscapedHtml(question.title),
            }}
          />
        </Group>

        {question.data.question && (
          <div
            className="text-lg! sm:text-2xl! leading-snug! text-gray-900! [&_p]:m-0!"
            dangerouslySetInnerHTML={{
              __html: decodeEscapedHtml(question.data.question),
            }}
          />
        )}

        {isRearrange ? (
          <Stack gap={14}>
            {/* the sentence being built - tap a word to send it back */}
            <Box
              className={`min-h-[64px]! rounded-2xl! border-2! border-dashed! p-3! transition-colors! duration-200! ${
                picked.length
                  ? "border-hongbao-red-200! bg-hongbao-cream-50/50!"
                  : "border-gray-200! bg-gray-50/60!"
              }`}
            >
              {picked.length === 0 ? (
                <Text size="sm" c="gray.5" className="p-2!">
                  Tap the words below to build your sentence.
                </Text>
              ) : (
                <Group gap={8} wrap="wrap">
                  {picked.map((word, i) => (
                    <button
                      key={`${word}-${i}`}
                      type="button"
                      onClick={() => onPopWordAt(i)}
                      className="rounded-xl! bg-hongbao-red-600! px-3.5! py-2! text-sm! font-semibold! text-white! cursor-pointer! transition-transform! duration-150! hover:-translate-y-0.5! active:scale-95!"
                    >
                      {word}
                    </button>
                  ))}
                </Group>
              )}
            </Box>

            {remaining.length > 0 && (
              <Group gap={8} wrap="wrap">
                {remaining.map((word, i) => (
                  <button
                    key={`${word}-bank-${i}`}
                    type="button"
                    onClick={() => onPushWord(word)}
                    className="rounded-xl! border! border-gray-200! bg-white! px-3.5! py-2! text-sm! font-semibold! text-gray-700! cursor-pointer! transition-all! duration-150! hover:border-hongbao-red-300! hover:text-hongbao-red-600! active:scale-95!"
                  >
                    {word}
                  </button>
                ))}
              </Group>
            )}

            {picked.length > 0 && (
              <button
                type="button"
                onClick={() => onPopWordAt(picked.length - 1)}
                className="flex! items-center! gap-1.5! w-fit! text-xs! font-semibold! text-gray-500! cursor-pointer! transition-colors! duration-150! hover:text-hongbao-red-600!"
              >
                <ArrowCounterClockwiseIcon size={13} weight="bold" />
                Undo last word
              </button>
            )}
          </Stack>
        ) : (
          <Stack gap={10}>
            {(question.data.options || []).map((option, i) => {
              const selected = answer === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onSelect(option.value)}
                  aria-pressed={selected}
                  className={`flex! items-center! gap-3! w-full! appearance-none! overflow-visible! text-left! rounded-2xl! border! px-4! py-3.5! cursor-pointer! transition-all! duration-200! ease-out! ${
                    selected
                      ? "border-hongbao-red-500! bg-hongbao-cream-50! ring-1! ring-hongbao-red-300!"
                      : "border-gray-200! bg-white! hover:border-hongbao-red-200! hover:bg-gray-50!"
                  }`}
                >
                  <Box
                    className={`flex! items-center! justify-center! shrink-0! w-8! h-8! rounded-lg! text-xs! font-bold! transition-colors! duration-200! ${
                      selected
                        ? "bg-hongbao-red-600! text-white!"
                        : "bg-gray-100! text-gray-500!"
                    }`}
                  >
                    {selected ? (
                      <CheckIcon size={15} weight="bold" />
                    ) : (
                      optionLetter(i)
                    )}
                  </Box>
                  <Text
                    component="div"
                    className="flex-1! leading-snug! [&_p]:m-0!"
                    dangerouslySetInnerHTML={{
                      __html: decodeEscapedHtml(option.label),
                    }}
                  />
                </button>
              );
            })}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
};

export default QuestionCard;
