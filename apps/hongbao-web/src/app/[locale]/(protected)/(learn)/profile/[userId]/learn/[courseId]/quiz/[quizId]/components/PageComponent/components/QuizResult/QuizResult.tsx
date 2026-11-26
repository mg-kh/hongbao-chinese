import { Link } from "@/i18n/navigation";
import {
  Badge,
  Box,
  Button,
  Group,
  Paper,
  RingProgress,
  Stack,
  Text,
} from "@mantine/core";
import {
  ArrowCounterClockwiseIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  LightbulbIcon,
  MinusCircleIcon,
  XCircleIcon,
} from "@phosphor-icons/react";
import { decodeEscapedHtml } from "@/utils/decodeEscapedHtml";
import { TGradedQuestion } from "../../types/quiz.type";

interface Props {
  graded: TGradedQuestion[];
  score: number;
  total: number;
  percent: number;
  elapsed: number;
  band: {
    title: string;
    body: string;
    tone: "success" | "attention" | "danger";
  };
  suggestionFor: (g: TGradedQuestion) => string;
  onRetake: () => void;
  isCompleted: boolean;
  isMarkingComplete: boolean;
  onMarkComplete: () => void;
  courseHref: string;
  /** Next video/quiz in the course; undefined when this is the last item. */
  nextHref?: string;
}

const toneStyles = {
  success: {
    ring: "green",
    text: "text-green-700! dark:text-night-green!",
    tile: "bg-green-50! text-green-600! dark:text-night-green!",
  },
  attention: {
    ring: "hongbao-gold",
    text: "text-hongbao-gold-800! dark:text-night-gold!",
    tile: "bg-hongbao-gold-50! text-hongbao-gold-700! dark:text-night-gold!",
  },
  danger: {
    ring: "hongbao-red",
    text: "text-hongbao-red-700! dark:text-night-red!",
    tile: "bg-hongbao-red-50! text-hongbao-red-600! dark:text-night-red!",
  },
};

const formatElapsed = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
};

const QuizResult: React.FC<Props> = ({
  graded,
  score,
  total,
  percent,
  elapsed,
  band,
  suggestionFor,
  onRetake,
  isCompleted,
  isMarkingComplete,
  onMarkComplete,
  courseHref,
  nextHref,
}) => {
  const t = toneStyles[band.tone];
  const wrongCount = graded.filter((g) => g.isAnswered && !g.isCorrect).length;
  const skippedCount = graded.filter((g) => !g.isAnswered).length;

  return (
    <Stack gap={20}>
      {/* headline score */}
      <Paper
        withBorder
        bdrs={20}
        p={{ base: 20, sm: 28 }}
        className="border-gray-200! bg-surface! shadow-sm!"
      >
        <Group
          gap={24}
          wrap="nowrap"
          className="flex-col! sm:flex-row! text-center! sm:text-left!"
        >
          <RingProgress
            size={132}
            thickness={12}
            roundCaps
            sections={[{ value: percent, color: t.ring }]}
            label={
              <Stack gap={0} align="center">
                <Text fw={800} className={`text-2xl! ${t.text}`}>
                  {percent}%
                </Text>
                <Text size="10px" c="gray.5" fw={600}>
                  {score}/{total}
                </Text>
              </Stack>
            }
            className="shrink-0!"
          />

          <Stack gap={8} className="min-w-0! flex-1!">
            <Text fw={800} className="text-xl! sm:text-2xl! text-gray-900!">
              {band.title}
            </Text>
            <Text size="sm" c="gray.6" className="leading-relaxed!">
              {band.body}
            </Text>

            <Group
              gap={8}
              wrap="wrap"
              mt={4}
              justify="center"
              className="sm:justify-start!"
            >
              <Badge
                size="sm"
                radius="sm"
                variant="light"
                color="green"
                leftSection={<CheckCircleIcon size={11} weight="fill" />}
              >
                {score} correct
              </Badge>
              {wrongCount > 0 && (
                <Badge
                  size="sm"
                  radius="sm"
                  variant="light"
                  color="red"
                  leftSection={<XCircleIcon size={11} weight="fill" />}
                >
                  {wrongCount} wrong
                </Badge>
              )}
              {skippedCount > 0 && (
                <Badge
                  size="sm"
                  radius="sm"
                  variant="light"
                  color="gray"
                  leftSection={<MinusCircleIcon size={11} weight="fill" />}
                >
                  {skippedCount} skipped
                </Badge>
              )}
              <Badge
                size="sm"
                radius="sm"
                variant="light"
                color="gray"
                leftSection={<ClockIcon size={11} weight="fill" />}
              >
                {formatElapsed(elapsed)}
              </Badge>
            </Group>
          </Stack>
        </Group>

        <Group
          gap={10}
          mt={20}
          className="flex-col-reverse! sm:flex-row! sm:justify-end! items-stretch! sm:items-center!"
        >
          {nextHref ? (
            <Button
              component={Link}
              href={nextHref}
              variant="default"
              size="md"
              radius="md"
              rightSection={<ArrowRightIcon size={15} weight="bold" />}
              className="w-full! sm:w-auto!"
            >
              Next
            </Button>
          ) : (
            <Button
              component={Link}
              href={courseHref}
              variant="default"
              size="md"
              radius="md"
              leftSection={<ArrowLeftIcon size={15} weight="bold" />}
              className="w-full! sm:w-auto!"
            >
              Back to course
            </Button>
          )}
          <Button
            size="md"
            radius="md"
            variant={isCompleted ? "light" : "outline"}
            color="green"
            leftSection={
              <CheckCircleIcon
                size={15}
                weight={isCompleted ? "fill" : "regular"}
              />
            }
            loading={isMarkingComplete}
            disabled={isCompleted}
            onClick={onMarkComplete}
            className={`w-full! sm:w-auto! ${
              isCompleted
                ? "disabled:bg-green-50! disabled:text-green-700! dark:disabled:text-night-green! disabled:cursor-default!"
                : ""
            }`}
          >
            {isCompleted ? "Completed" : "Mark as complete"}
          </Button>
          <Button
            onClick={onRetake}
            size="md"
            radius="md"
            color="hongbao-red"
            leftSection={<ArrowCounterClockwiseIcon size={15} weight="bold" />}
            className="w-full! sm:w-auto!"
          >
            Retake quiz
          </Button>
        </Group>
      </Paper>

      {/* per-question review */}
      <Stack gap={10}>
        <Text
          size="11px"
          fw={700}
          c="gray.5"
          className="uppercase! tracking-[0.12em]!"
        >
          Review your answers
        </Text>

        {graded.map((g, i) => (
          <Paper
            key={g.question.id}
            withBorder
            bdrs={16}
            p={{ base: 14, sm: 18 }}
            className={`bg-surface! ${
              g.isCorrect
                ? "border-green-200!"
                : g.isAnswered
                  ? "border-red-200!"
                  : "border-gray-200!"
            }`}
          >
            <Group gap={12} wrap="nowrap" align="flex-start">
              <Box
                className={`flex! items-center! justify-center! shrink-0! w-8! h-8! rounded-lg! ${
                  g.isCorrect
                    ? "bg-green-50! text-green-600! dark:text-night-green!"
                    : g.isAnswered
                      ? "bg-red-50! text-red-600! dark:text-night-red!"
                      : "bg-gray-100! text-gray-400!"
                }`}
              >
                {g.isCorrect ? (
                  <CheckCircleIcon size={17} weight="fill" />
                ) : g.isAnswered ? (
                  <XCircleIcon size={17} weight="fill" />
                ) : (
                  <MinusCircleIcon size={17} weight="fill" />
                )}
              </Box>

              <Stack gap={10} className="min-w-0! flex-1!">
                <Stack gap={3}>
                  <Text
                    size="10px"
                    fw={700}
                    c="gray.4"
                    className="uppercase! tracking-[0.1em]!"
                  >
                    Question {i + 1}
                  </Text>
                  {g.question.data.question ? (
                    <Text
                      component="div"
                      fw={700}
                      size="sm"
                      className="text-gray-900! leading-snug! [&_p]:m-0!"
                      dangerouslySetInnerHTML={{
                        __html: decodeEscapedHtml(g.question.data.question),
                      }}
                    />
                  ) : (
                    <Text
                      component="div"
                      fw={700}
                      size="sm"
                      className="text-gray-900! leading-snug! [&_p]:m-0!"
                      dangerouslySetInnerHTML={{
                        __html: decodeEscapedHtml(g.question.title),
                      }}
                    />
                  )}
                </Stack>

                {/* their answer, then the right one when they differ */}
                <Stack gap={6}>
                  <Group gap={8} wrap="nowrap" align="flex-start">
                    <Text
                      size="xs"
                      c="gray.5"
                      fw={600}
                      className="w-[92px]! shrink-0!"
                    >
                      Your answer
                    </Text>
                    {g.isAnswered ? (
                      <Text
                        component="div"
                        size="xs"
                        fw={600}
                        c={g.isCorrect ? "green.7" : "red.7"}
                        className="flex-1! leading-snug! [&_p]:m-0!"
                        dangerouslySetInnerHTML={{
                          __html: decodeEscapedHtml(g.givenLabel),
                        }}
                      />
                    ) : (
                      <Text
                        size="xs"
                        fw={600}
                        c="gray.5"
                        className="flex-1! leading-snug!"
                      >
                        Not answered
                      </Text>
                    )}
                  </Group>

                  {!g.isCorrect && (
                    <Group gap={8} wrap="nowrap" align="flex-start">
                      <Text
                        size="xs"
                        c="gray.5"
                        fw={600}
                        className="w-[92px]! shrink-0!"
                      >
                        Correct answer
                      </Text>
                      <Text
                        component="div"
                        size="xs"
                        fw={700}
                        c="var(--hb-success-text)"
                        className="flex-1! leading-snug! [&_p]:m-0!"
                        dangerouslySetInnerHTML={{
                          __html: decodeEscapedHtml(g.correct),
                        }}
                      />
                    </Group>
                  )}
                </Stack>

                {/* suggestion */}
                <Group
                  gap={8}
                  wrap="nowrap"
                  align="flex-start"
                  p={10}
                  className={`rounded-xl! ${
                    g.isCorrect ? "bg-green-50/60!" : "bg-hongbao-cream-50/70!"
                  }`}
                >
                  <LightbulbIcon
                    size={14}
                    weight="fill"
                    className={`shrink-0! mt-0.5! ${
                      g.isCorrect ? "text-green-600! dark:text-night-green!" : "text-hongbao-gold-600! dark:text-night-gold!"
                    }`}
                  />
                  <Text
                    size="xs"
                    c="gray.7"
                    className="leading-relaxed! flex-1!"
                  >
                    {suggestionFor(g)}
                  </Text>
                </Group>
              </Stack>
            </Group>
          </Paper>
        ))}
      </Stack>
    </Stack>
  );
};

export default QuizResult;
