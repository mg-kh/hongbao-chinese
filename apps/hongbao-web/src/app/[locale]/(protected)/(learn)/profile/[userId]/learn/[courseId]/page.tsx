"use client";

import { pluralize } from "@/utils/pluralize";
import RichTextContent from "@/components/RichTextContent/RichTextContent";
import {
  Badge,
  Box,
  Button,
  Group,
  Paper,
  Stack,
  Text,
  Timeline,
} from "@mantine/core";
import {
  BookOpenIcon,
  CaretRightIcon,
  CheckCircleIcon,
  SealQuestionIcon,
  TargetIcon,
  VideoIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import useContainer from "./useContainer";

const Page = () => {
  const { courseDetail } = useContainer();
  const { userId, courseId } = useParams();

  const lessons = courseDetail?.lessons || [];

  /** Flatten each lesson into the numbers the plan needs. */
  const plan = lessons.map((lesson) => {
    const videos =
      lesson?.subLessons?.flatMap((sub) => sub?.videos || []) || [];
    const quizzes = [
      ...(lesson?.subLessons?.flatMap((sub) => sub?.quizzes || []) || []),
      ...(lesson?.quizzes || []),
    ];
    const items = [...videos, ...quizzes];
    const done = items.filter((i) => i?.isCompleted).length;

    return {
      lesson,
      videoCount: videos.length,
      quizCount: quizzes.length,
      total: items.length,
      done,
      isDone: items.length > 0 && done === items.length,
      firstVideoId: videos[0]?.id,
    };
  });

  const completedLessons = plan.filter((p) => p.isDone).length;
  const remaining = plan.length - completedLessons;

  /**
   * Recommended cadence to get through the course inside the purchased access
   * window. Derived from lesson count / `perTime` (months) - the API exposes no
   * enrollment or expiry date here, so this is a steady target rather than a
   * countdown against a real deadline.
   */
  const accessMonths = courseDetail?.perTime || 0;
  const accessWeeks = Math.round(accessMonths * 4.35);
  const lessonsPerWeek =
    accessWeeks > 0 && plan.length > 0 ? plan.length / accessWeeks : 0;
  const paceLabel =
    lessonsPerWeek >= 1
      ? `${pluralize(Math.ceil(lessonsPerWeek), "lesson")} a week`
      : `1 lesson every ${pluralize(Math.max(1, Math.round(1 / lessonsPerWeek)), "week")}`;

  /** First lesson that still has unfinished content. */
  const upNext =
    plan.find((p) => !p.isDone && p.firstVideoId) ||
    plan.find((p) => !p.isDone);

  return (
    <div className="flex flex-col lg:flex-row gap-5 w-full">
      {/* ---------- overview ---------- */}
      <div className="w-full lg:w-8/12 min-w-0">
        <Stack gap={18}>
          <Box className="relative! w-full! aspect-video! rounded-2xl! overflow-hidden! bg-gradient-to-br! from-hongbao-red-600! via-hongbao-red-700! to-hongbao-maroon-800!">
            <Box className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.16)_1px,transparent_0)] bg-[length:22px_22px]" />
            <Stack
              gap={10}
              justify="end"
              className="absolute! inset-0! p-5! sm:p-7!"
            >
              {courseDetail?.level && (
                <Badge
                  size="lg"
                  radius="md"
                  className="w-fit! bg-white/95! text-hongbao-red-700!"
                >
                  {courseDetail.level}
                </Badge>
              )}
              <Text
                fw={800}
                c="white"
                className="text-xl! sm:text-3xl! leading-tight!"
                lineClamp={2}
              >
                {courseDetail?.title}
              </Text>
            </Stack>
          </Box>

          <Group gap={8}>
            <Badge
              size="lg"
              radius="md"
              variant="light"
              color="hongbao-red"
              leftSection={<BookOpenIcon size={13} weight="fill" />}
            >
              {courseDetail?.lessonCount || 0} Lessons
            </Badge>
            <Badge
              size="lg"
              radius="md"
              variant="light"
              color="hongbao-orange"
              leftSection={<VideoIcon size={13} weight="fill" />}
            >
              {courseDetail?.videoCount || 0} Videos
            </Badge>
          </Group>

          {courseDetail?.description && (
            <RichTextContent
              html={courseDetail.description}
              className="text-gray-700! leading-relaxed! [&_p]:mb-3! [&_strong]:font-semibold! [&_ul]:list-disc! [&_ul]:pl-5! [&_ol]:list-decimal! [&_ol]:pl-5!"
            />
          )}
        </Stack>
      </div>

      {/* ---------- lesson plan ---------- */}
      <div className="w-full lg:w-4/12 min-w-0">
        <Paper
          withBorder
          bdrs={20}
          className="overflow-hidden! border-gray-200! shadow-sm! lg:sticky! lg:top-21!"
        >
          {/* pacing suggestion */}
          {plan.length > 0 && (
            <Stack
              gap={10}
              p={14}
              className="border-b! border-gray-100! bg-hongbao-cream-50/70!"
            >
              <Group gap={10} wrap="nowrap" align="start">
                <Box className="flex! items-center! justify-center! w-8! h-8! rounded-lg! shrink-0! bg-hongbao-gold-100! text-hongbao-gold-800!">
                  <TargetIcon size={16} weight="fill" />
                </Box>
                <Stack gap={2} className="min-w-0!">
                  <Text size="xs" fw={700} c="gray.8">
                    Suggested pace
                  </Text>
                  <Text size="xs" c="gray.6" className="leading-relaxed!">
                    {accessWeeks > 0 ? (
                      <>
                        Finish <strong>{paceLabel}</strong> to complete this
                        course within your {accessMonths}-month access.
                      </>
                    ) : (
                      <>
                        {pluralize(remaining, "lesson")} left to complete this
                        course.
                      </>
                    )}
                  </Text>
                </Stack>
              </Group>

              {upNext?.firstVideoId && (
                <Button
                  component={Link}
                  href={`/profile/${userId}/learn/${courseId}/video/${upNext.firstVideoId}`}
                  size="sm"
                  radius="md"
                  fullWidth
                  color="hongbao-red"
                  rightSection={<CaretRightIcon size={14} weight="bold" />}
                  styles={{ label: { overflow: "hidden" } }}
                >
                  <Text size="xs" fw={600} lineClamp={1}>
                    Continue: {upNext.lesson?.title}
                  </Text>
                </Button>
              )}
            </Stack>
          )}

          {/* timeline */}
          <Box p={18}>
            {plan.length === 0 ? (
              <Text size="sm" c="gray.6" ta="center" py={20}>
                No lessons yet.
              </Text>
            ) : (
              <Timeline
                active={completedLessons - 1}
                bulletSize={34}
                lineWidth={2}
                color="hongbao-red"
                styles={{
                  itemBullet: {
                    backgroundColor: "transparent",
                    border: "none",
                  },
                }}
              >
                {plan.map((row, index) => {
                  const href = row.firstVideoId
                    ? `/profile/${userId}/learn/${courseId}/video/${row.firstVideoId}`
                    : undefined;

                  const title = (
                    <Text size="sm" fw={700} lineClamp={2}>
                      {row.lesson?.title}
                    </Text>
                  );

                  return (
                    <Timeline.Item
                      key={row.lesson.id}
                      lineVariant={row.isDone ? "solid" : "dashed"}
                      bullet={
                        <Box
                          className={`flex! items-center! justify-center! w-full! h-full! rounded-full! text-xs! font-bold! ${
                            row.isDone
                              ? "bg-green-100! text-green-600! ring-2! ring-green-200!"
                              : "bg-gradient-to-br! from-hongbao-red-500! to-hongbao-maroon-600! text-white! shadow-sm! shadow-hongbao-red-500/30!"
                          }`}
                        >
                          {row.isDone ? (
                            <CheckCircleIcon size={18} weight="fill" />
                          ) : (
                            index + 1
                          )}
                        </Box>
                      }
                      title={
                        href ? (
                          <Link href={href} className="no-underline!">
                            <Group
                              gap={6}
                              wrap="nowrap"
                              className="group! w-fit!"
                            >
                              {title}
                              <CaretRightIcon
                                size={13}
                                className="text-gray-400! shrink-0! transition-transform! duration-200! group-hover:translate-x-0.5!"
                              />
                            </Group>
                          </Link>
                        ) : (
                          title
                        )
                      }
                    >
                      {row.total > 0 ? (
                        <Group gap={6} wrap="wrap" pt={2}>
                          {row.videoCount > 0 && (
                            <Badge
                              size="xs"
                              radius="sm"
                              variant="light"
                              color="hongbao-red"
                              leftSection={
                                <VideoIcon size={10} weight="fill" />
                              }
                            >
                              {row.videoCount}
                            </Badge>
                          )}
                          {row.quizCount > 0 && (
                            <Badge
                              size="xs"
                              radius="sm"
                              variant="light"
                              color="hongbao-gold"
                              leftSection={
                                <SealQuestionIcon size={10} weight="fill" />
                              }
                            >
                              {row.quizCount}
                            </Badge>
                          )}
                          <Text size="10px" c="gray.6" fw={600}>
                            {row.done}/{row.total} done
                          </Text>
                        </Group>
                      ) : (
                        <Text size="10px" c="gray.5" pt={2}>
                          No content yet
                        </Text>
                      )}
                    </Timeline.Item>
                  );
                })}
              </Timeline>
            )}
          </Box>
        </Paper>
      </div>
    </div>
  );
};

export default Page;
