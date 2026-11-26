"use client";

import LoaderComponent from "@/components/LoaderComponent/LoaderComponent";
import {
  Box,
  Button,
  Group,
  Paper,
  Progress,
  Stack,
  Text,
} from "@mantine/core";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PaperPlaneTiltIcon,
  SealQuestionIcon,
} from "@phosphor-icons/react";
import { FormProvider } from "react-hook-form";
import QuestionCard from "./components/QuestionCard/QuestionCard";
import QuizResult from "./components/QuizResult/QuizResult";
import useContainer from "./useContainer";
import CustomBreadCrumb from "@/components/CustomBreadCrumb/CustomBreadCrumb";

const PageComponent = () => {
  const {
    form,
    isLoading,
    questions,
    total,
    index,
    current,
    isAnswered,
    answeredCount,
    answers,
    goPrev,
    goNext,
    goTo,
    submit,
    retake,
    submitted,
    graded,
    score,
    percent,
    elapsed,
    band,
    suggestionFor,
    isCompleted,
    isMarkingComplete,
    handleMarkComplete,
    courseHref,
    myCoursesHref,
    courseTitle,
    quizTitle,
    nextHref,
  } = useContainer();

  if (isLoading) {
    return <LoaderComponent h={320} />;
  }

  if (!total) {
    return (
      <Paper withBorder bdrs={20} p={{ base: 28, sm: 40 }}>
        <Stack align="center" gap={10}>
          <Box className="flex! items-center! justify-center! w-14! h-14! rounded-2xl! bg-hongbao-red-50! text-hongbao-red-600! dark:text-night-red!">
            <SealQuestionIcon size={26} weight="fill" />
          </Box>
          <Text fw={700}>No questions yet</Text>
          <Text size="sm" c="gray.6" ta="center">
            This quiz doesn&apos;t have any questions added to it.
          </Text>
        </Stack>
      </Paper>
    );
  }

  const isLast = index === total - 1;
  const progress = ((index + 1) / total) * 100;

  return (
    <FormProvider {...form}>
      <Stack gap={18} className="flex-1! w-full!">
        <CustomBreadCrumb
          links={[
            { label: "My courses", href: myCoursesHref, isActive: true },
            {
              label: courseTitle || "Course",
              href: courseHref,
              isActive: true,
            },
            { label: quizTitle || "Quiz", href: "", isActive: false },
          ]}
        />

        {submitted ? (
          <QuizResult
            graded={graded}
            score={score}
            total={total}
            percent={percent}
            elapsed={elapsed}
            band={band}
            suggestionFor={suggestionFor}
            onRetake={retake}
            isCompleted={isCompleted}
            isMarkingComplete={isMarkingComplete}
            onMarkComplete={handleMarkComplete}
            courseHref={courseHref}
            nextHref={nextHref}
          />
        ) : (
          <form onSubmit={submit}>
            <Stack gap={18}>
              {/* progress - a count plus a bar, so "how far in am I" is
                  answerable at a glance without counting dots */}
              <Stack gap={8}>
                <Group justify="space-between" gap={8} wrap="nowrap">
                  <Text size="sm" fw={700} c="gray.8">
                    Question {index + 1}{" "}
                    <Text span size="sm" fw={500} c="gray.5">
                      of {total}
                    </Text>
                  </Text>
                  <Text size="xs" fw={600} c="gray.5">
                    {answeredCount}/{total} answered
                  </Text>
                </Group>
                <Progress
                  value={progress}
                  size="sm"
                  radius="xl"
                  color="hongbao-red"
                  className="bg-gray-100!"
                />
              </Stack>

              {current && <QuestionCard key={current.id} question={current} />}

              {/* jump dots - lets learners revisit a skipped question directly */}
              <Group gap={6} wrap="wrap">
                {questions.map((q, i) => {
                  const a = answers[q.id];
                  const done = Array.isArray(a) ? a.length > 0 : !!a;
                  const isCurrent = i === index;
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => goTo(i)}
                      aria-label={`Go to question ${i + 1}`}
                      aria-current={isCurrent ? "true" : undefined}
                      className={`w-8! h-8! rounded-lg! text-xs! font-bold! cursor-pointer! transition-all! duration-200! ${
                        isCurrent
                          ? "bg-hongbao-red-600! text-white! shadow-sm!"
                          : done
                            ? "bg-hongbao-red-50! text-hongbao-red-600! dark:text-night-red!"
                            : "bg-gray-100! text-gray-500! hover:bg-gray-200!"
                      }`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </Group>

              {/* actions */}
              <Group
                py={10}
                justify="space-between"
                gap={10}
                className="flex-col-reverse! sm:flex-row! items-stretch! sm:items-center!"
              >
                <Button
                  type="button"
                  variant="default"
                  size="md"
                  onClick={goPrev}
                  disabled={index === 0}
                  leftSection={<ArrowLeftIcon size={16} />}
                  className="w-full! sm:w-auto!"
                >
                  နောက်သို့
                </Button>

                {/* distinct keys stop React reusing one <button> node: otherwise
                    clicking "next" on the second-to-last question flips that
                    same node to type="submit" mid-click and submits the form */}
                {isLast ? (
                  <Button
                    key="submit"
                    type="submit"
                    size="md"
                    color="hongbao-red"
                    rightSection={
                      <PaperPlaneTiltIcon size={16} weight="fill" />
                    }
                    className="w-full! sm:w-auto!"
                  >
                    Submit quiz
                  </Button>
                ) : (
                  <Button
                    key="next"
                    type="button"
                    size="md"
                    color="hongbao-red"
                    onClick={goNext}
                    disabled={!isAnswered}
                    rightSection={<ArrowRightIcon size={16} />}
                    className="w-full! sm:w-auto!"
                  >
                    နောက်ထပ်
                  </Button>
                )}
              </Group>
            </Stack>
          </form>
        )}
      </Stack>
    </FormProvider>
  );
};

export default PageComponent;
