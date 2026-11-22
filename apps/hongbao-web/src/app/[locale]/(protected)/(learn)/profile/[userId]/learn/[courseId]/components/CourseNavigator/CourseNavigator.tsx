"use client";

import {
  Accordion,
  Badge,
  Box,
  Burger,
  Drawer,
  Group,
  Paper,
  Progress,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  CheckCircleIcon,
  ListBulletsIcon,
  SealQuestionIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import NavItem from "./components/NavItem/NavItem";
import useContainer from "./useContainer";

const CourseNavigator = () => {
  const {
    expandSidbar,
    setExpendSidebar,
    courseDetail,
    courseId,
    userId,
    videoId,
    quizId,
    progress,
    lessonStats,
    isVideoCompleted,
    isQuizCompleted,
    activeLessonId,
  } = useContainer();
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);

  // Auto-expand the lesson containing the active video/quiz. Kept additive
  // (never removes an id) so navigating doesn't collapse lessons the user
  // opened manually. Seeded synchronously when possible (data already
  // cached) so it renders already-open instead of animating open on mount;
  // the effect below covers later navigations. Both paths defer the actual
  // open to a rAF tick - toggling Accordion's `value` in the very same
  // commit that mounts its panel content trips Mantine's height
  // measurement and leaves the panel visually collapsed at height:0.
  const [openLessons, setOpenLessons] = useState<string[]>([]);
  useEffect(() => {
    if (!activeLessonId) return;
    const id = requestAnimationFrame(() => {
      setOpenLessons((prev) =>
        prev.includes(activeLessonId) ? prev : [...prev, activeLessonId],
      );
    });
    return () => cancelAnimationFrame(id);
  }, [activeLessonId]);

  const videoHref = (id?: string) =>
    `/profile/${userId}/learn/${courseId}/video/${id}`;
  const quizHref = (id?: string) =>
    `/profile/${userId}/learn/${courseId}/quiz/${id}`;

  /** Gradient course header + progress bar. */
  const header = (withBurger: boolean) => (
    <Stack
      gap={14}
      p={18}
      className="bg-gradient-to-br! from-hongbao-red-600! to-hongbao-maroon-700!"
    >
      <Group justify="space-between" wrap="nowrap" align="start">
        <Stack gap={4} className="flex-1!">
          <Text
            size="10px"
            fw={700}
            c="white"
            className="uppercase! tracking-[0.16em]! opacity-70!"
          >
            Course
          </Text>
          <Text
            component={Link}
            href={`/profile/${userId}/learn/${courseId}`}
            onClick={closeDrawer}
            fw={700}
            size="md"
            c="white"
            lineClamp={2}
            className="no-underline! hover:underline!"
          >
            {courseDetail?.title}
          </Text>
        </Stack>
        {withBurger && (
          <Burger
            opened={expandSidbar}
            onClick={() => setExpendSidebar((prev) => !prev)}
            size="sm"
            color="white"
          />
        )}
      </Group>

      <Stack gap={6}>
        <Group justify="space-between">
          <Text size="xs" c="white" className="opacity-85!">
            {progress.completed} of {progress.total} complete
          </Text>
          <Text size="xs" fw={700} c="white">
            {progress.percent}%
          </Text>
        </Group>
        <Progress
          value={progress.percent}
          size="sm"
          radius="xl"
          color="hongbao-gold.4"
          className="bg-white/25!"
        />
      </Stack>
    </Stack>
  );

  /** Lesson accordion + final assessment. `onNavigate` closes the mobile drawer. */
  const lessonList = (onNavigate?: () => void) => (
    <Box p={10}>
      <Accordion
        multiple
        value={openLessons}
        onChange={setOpenLessons}
        variant="filled"
        radius={14}
        chevronPosition="right"
        classNames={{
          content: "px-2! pb-2!",
          control: "rounded-xl! hover:bg-hongbao-cream-50/70!",
        }}
      >
        {courseDetail?.lessons?.map((lesson, index) => {
          const {
            total: totalCount = 0,
            done: doneCount = 0,
            isDone: isLessonDone = false,
          } = lessonStats[lesson.id] ?? {};

          return (
            <Accordion.Item key={lesson.id} value={lesson.id}>
              <Accordion.Control>
                <Group gap={12} wrap="nowrap">
                  <Box
                    className={`flex! items-center! justify-center! shrink-0! w-9! h-9! rounded-xl! text-sm! font-bold! ${
                      isLessonDone
                        ? "bg-green-100! text-green-600!"
                        : "bg-gradient-to-br! from-hongbao-red-500! to-hongbao-maroon-600! text-white! shadow-sm! shadow-hongbao-red-500/30!"
                    }`}
                  >
                    {isLessonDone ? (
                      <CheckCircleIcon size={20} weight="fill" />
                    ) : (
                      index + 1
                    )}
                  </Box>
                  <Stack gap={2} className="flex-1!">
                    <Text size="sm" fw={700} lineClamp={2}>
                      {lesson?.title}
                    </Text>
                    <Text size="xs" c="gray.6">
                      {totalCount > 0
                        ? `${doneCount}/${totalCount} completed`
                        : "No content yet"}
                    </Text>
                  </Stack>
                </Group>
              </Accordion.Control>

              <Accordion.Panel>
                <Stack gap={2}>
                  {lesson?.subLessons?.map((sub) => (
                    <Box key={sub?.title}>
                      {sub?.title && (
                        <Group gap={8} className="pt-2! pb-1! px-2!">
                          <Box className="w-1! h-3! rounded-full! bg-gradient-to-b! from-hongbao-red-400! to-hongbao-gold-400!" />
                          <Text
                            size="10px"
                            fw={700}
                            c="gray.5"
                            className="uppercase! tracking-wide!"
                          >
                            {sub.title}
                          </Text>
                        </Group>
                      )}

                      {(sub?.videos?.length || 0) === 0 &&
                        (sub?.quizzes?.length || 0) === 0 && (
                          <Text size="xs" c="gray.5" px={10} py={4}>
                            No content yet
                          </Text>
                        )}

                      {sub?.videos?.map((vid) => (
                        <NavItem
                          key={vid?.id}
                          title={vid?.title}
                          href={videoHref(vid?.id)}
                          type="video"
                          isCompleted={
                            vid?.isCompleted || isVideoCompleted(vid?.id)
                          }
                          isActive={vid?.id === videoId}
                          onNavigate={onNavigate}
                        />
                      ))}

                      {sub?.quizzes?.map((quiz) => (
                        <NavItem
                          key={quiz?.id}
                          title={quiz?.title}
                          href={quizHref(quiz?.id)}
                          type="quiz"
                          isCompleted={
                            quiz?.isCompleted || isQuizCompleted(quiz?.id)
                          }
                          isActive={quiz?.id === quizId}
                          onNavigate={onNavigate}
                        />
                      ))}
                    </Box>
                  ))}

                  {lesson?.quizzes?.map((quiz) => (
                    <NavItem
                      key={quiz?.id}
                      title={quiz?.title}
                      href={quizHref(quiz?.id)}
                      type="quiz"
                      isCompleted={
                        quiz?.isCompleted || isQuizCompleted(quiz?.id)
                      }
                      isActive={quiz?.id === quizId}
                      onNavigate={onNavigate}
                    />
                  ))}
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          );
        })}
      </Accordion>

      {(courseDetail?.quizzes?.length || 0) > 0 && (
        <Stack gap={2} pt={10} px={2}>
          <Group gap={8} className="px-2! pb-1!">
            <Badge
              size="sm"
              radius="sm"
              variant="light"
              color="hongbao-gold"
              leftSection={<SealQuestionIcon size={11} weight="fill" />}
            >
              Final Assessment
            </Badge>
          </Group>
          {courseDetail?.quizzes?.map((quiz) => (
            <NavItem
              key={quiz?.id}
              title={quiz?.title}
              href={quizHref(quiz?.id)}
              type="quiz"
              isCompleted={quiz?.isCompleted || isQuizCompleted(quiz?.id)}
              isActive={quiz?.id === quizId}
              onNavigate={onNavigate}
            />
          ))}
        </Stack>
      )}
    </Box>
  );

  return (
    <>
      {/* ---------- mobile: sticky trigger bar ---------- */}
      <Paper
        component="button"
        type="button"
        withBorder
        bdrs={16}
        p={10}
        onClick={openDrawer}
        aria-label="Open course content"
        className="lg:hidden! w-full! text-left! border-gray-200! shadow-sm! cursor-pointer! active:bg-gray-50! transition-colors! duration-200!"
      >
        <Group justify="space-between" wrap="nowrap">
          <Group gap={10} wrap="nowrap" className="min-w-0!">
            <Box className="flex! items-center! justify-center! w-9! h-9! rounded-xl! shrink-0! bg-gradient-to-br! from-hongbao-red-500! to-hongbao-maroon-600! text-white!">
              <ListBulletsIcon size={18} weight="bold" />
            </Box>
            <Stack gap={0} className="min-w-0!">
              <Text size="sm" fw={700} lineClamp={1}>
                Course content
              </Text>
              <Text size="xs" c="gray.6">
                {progress.completed} of {progress.total} complete
              </Text>
            </Stack>
          </Group>
          <Badge
            size="lg"
            radius="md"
            variant="light"
            color="hongbao-red"
            className="shrink-0!"
          >
            {progress.percent}%
          </Badge>
        </Group>
      </Paper>

      {/* ---------- mobile: slide-in drawer ---------- */}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="88%"
        padding={0}
        withCloseButton={false}
        classNames={{ body: "p-0!" }}
      >
        <Stack gap={0}>
          {header(false)}
          {lessonList(closeDrawer)}
        </Stack>
      </Drawer>

      {/* ---------- desktop: sticky sidebar ---------- */}
      {expandSidbar ? (
        <Paper
          w={350}
          withBorder
          bdrs={20}
          className="hidden! lg:flex! flex-col! shrink-0! sticky! top-21! h-[calc(100vh-6.25rem)]! overflow-hidden! border-gray-200! shadow-sm!"
        >
          <Box className="shrink-0!">{header(true)}</Box>
          <Box className="flex-1! min-h-0! overflow-y-auto!">
            {lessonList()}
          </Box>
        </Paper>
      ) : (
        <Paper
          withBorder
          bdrs={14}
          p={6}
          className="hidden! lg:block! border-gray-200! shadow-sm!"
        >
          <Tooltip label="Show course menu" position="right">
            <Burger
              opened={expandSidbar}
              onClick={() => setExpendSidebar((prev) => !prev)}
              size="sm"
            />
          </Tooltip>
        </Paper>
      )}
    </>
  );
};

export default CourseNavigator;
