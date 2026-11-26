"use client";

import RubyButtonComponent from "@/components/Buttons/RubyButtonComponent/RubyButtonComponent";
import LoaderComponent from "@/components/LoaderComponent/LoaderComponent";
import PriceText from "@/components/MiscellaneousComponents/PriceText/PriceText";
import RichTextContent from "@/components/RichTextContent/RichTextContent";
import { Link } from "@/i18n/navigation";
import ClientLayout from "@/layouts/ClientLayout/ClientLayout";
import {
  Accordion,
  Anchor,
  Badge,
  Box,
  Divider,
  Flex,
  Group,
  Modal,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  BookOpenIcon,
  ImageIcon,
  SealQuestionIcon,
  VideoIcon,
} from "@phosphor-icons/react";
import {
  IconChevronRight,
  IconCheck,
  IconPlayerPlayFilled,
  IconShare,
  IconSparkles,
} from "@tabler/icons-react";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  DefaultVideoLayout,
  defaultLayoutIcons,
} from "@vidstack/react/player/layouts/default";
import { useTranslations } from "next-intl";
import useContainer from "./useContainer";

const CurriculumRow: React.FC<{ title?: string; type: "video" | "quiz" }> = ({
  title,
  type,
}) => {
  const t = useTranslations("CourseDetail.PageComponent");

  return (
    <Group
      justify="space-between"
      py={9}
      px={10}
      wrap="nowrap"
      className="rounded-xl! transition-colors! duration-200! ease-out! hover:bg-gray-50!"
    >
      <Group gap={12} wrap="nowrap">
        <Box
          className={`flex! items-center! justify-center! w-8! h-8! rounded-lg! shrink-0! ${
            type === "video"
              ? "bg-hongbao-red-50! text-hongbao-red-600! dark:text-night-red!"
              : "bg-hongbao-gold-50! text-hongbao-gold-700! dark:text-night-gold!"
          }`}
        >
          {type === "video" ? (
            <VideoIcon size={15} weight="fill" />
          ) : (
            <SealQuestionIcon size={15} weight="fill" />
          )}
        </Box>
        <Text size="sm" fw={500} c={"gray.8"}>
          {title}
        </Text>
      </Group>
      <Badge
        size="xs"
        variant="light"
        radius="sm"
        color={type === "video" ? "hongbao-red" : "hongbao-gold"}
        className="shrink-0!"
      >
        {type === "video" ? t("video") : t("quiz")}
      </Badge>
    </Group>
  );
};

const PageComponent = () => {
  const t = useTranslations("CourseDetail.PageComponent");
  const { courseDetail, isFetching } = useContainer();
  const [previewOpened, { open: openPreview, close: closePreview }] =
    useDisclosure(false);
  const previewVideo = courseDetail?.videos?.[0];

  const totalQuizCount =
    (courseDetail?.lessons?.reduce(
      (sum, lesson) =>
        sum +
        (lesson?.quizzes?.length || 0) +
        (lesson?.subLessons?.reduce(
          (subSum, sl) => subSum + (sl?.quizzes?.length || 0),
          0,
        ) || 0),
      0,
    ) || 0) + (courseDetail?.quizzes?.length || 0);

  return (
    <ClientLayout>
      {isFetching ? (
        <LoaderComponent wrapperClass="absolute -translate-y-1/2! top-1/2! -translate-x-1/2 left-1/2" />
      ) : (
        <Stack py={{ base: 20, md: 30 }} gap={24}>
          <Group gap={6}>
            <Anchor component={Link} href="/" c="gray.6" size="sm">
              {t("home")}
            </Anchor>
            <IconChevronRight size={14} className="text-gray-400!" />
            <Text size="sm" c="gray.7" fw={600} lineClamp={1}>
              {courseDetail?.title}
            </Text>
          </Group>

          <Flex
            gap={30}
            align={"start"}
            direction={{ base: "column", lg: "row" }}
          >
            <Stack className="flex-1! w-full!" gap={36}>
              {/* header */}
              <Stack gap={14}>
                {courseDetail?.level && (
                  <Badge
                    size="lg"
                    radius="md"
                    color="var(--hb-tint-red)"
                    c="var(--hb-accent-strong)"
                    className="w-fit!"
                    leftSection={<IconSparkles size={14} />}
                  >
                    {courseDetail.level}
                  </Badge>
                )}
                <Text
                  fw={800}
                  className="text-[1.75rem]! sm:text-[2.25rem]! leading-tight! tracking-tight!"
                >
                  {courseDetail?.title}
                </Text>

                {courseDetail?.description && (
                  <RichTextContent
                    html={courseDetail.description}
                    className="text-gray-600! leading-relaxed! [&_p]:mb-3! [&_strong]:font-semibold! [&_strong]:text-gray-900! [&_ul]:list-disc! [&_ul]:pl-5! [&_ol]:list-decimal! [&_ol]:pl-5! [&_a]:text-hongbao-red-600! [&_a]:underline!"
                  />
                )}

                <Group gap={24} className="pt-2!">
                  <Group gap={8}>
                    <BookOpenIcon
                      size={18}
                      className="text-hongbao-red-600! dark:text-night-red!"
                    />
                    <Text size="sm" fw={600} c={"gray.7"}>
                      {t("lessons", { count: courseDetail?.lessonCount || 0 })}
                    </Text>
                  </Group>
                  <Group gap={8}>
                    <VideoIcon
                      size={18}
                      className="text-hongbao-red-600! dark:text-night-red!"
                    />
                    <Text size="sm" fw={600} c={"gray.7"}>
                      {t("videos", { count: courseDetail?.videoCount || 0 })}
                    </Text>
                  </Group>
                </Group>
              </Stack>

              {/* course preview */}
              <Stack gap={12}>
                <Text fw={700} size="lg">
                  {t("course_preview")}
                </Text>
                {previewVideo ? (
                  <Paper
                    bdrs={20}
                    withBorder
                    className="overflow-hidden! border-gray-200! shadow-sm!"
                  >
                    <MediaPlayer
                      title={previewVideo.title}
                      src={previewVideo.url || ""}
                      viewType="video"
                      className="aspect-video!"
                    >
                      <MediaProvider />
                      <DefaultVideoLayout icons={defaultLayoutIcons} />
                    </MediaPlayer>
                    <Stack gap={4} p={20}>
                      <Text fw={700}>{previewVideo.title}</Text>
                      {previewVideo.description && (
                        <Text size="sm" c={"gray.6"}>
                          {previewVideo.description}
                        </Text>
                      )}
                    </Stack>
                  </Paper>
                ) : (
                  <Box className="relative! aspect-video! rounded-[20px]! overflow-hidden! bg-gradient-to-br! from-hongbao-maroon-700! via-hongbao-red-600! to-hongbao-brown-700!">
                    <Box className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:22px_22px]" />
                    <Box className="absolute! inset-0! flex! flex-col! items-center! justify-center! gap-3!">
                      <Box className="flex! items-center! justify-center! w-16! h-16! rounded-full! bg-white/15! ring-1! ring-white/30!">
                        <IconPlayerPlayFilled
                          size={26}
                          className="text-white/70! translate-x-[2px]!"
                        />
                      </Box>
                      <Text
                        size="sm"
                        fw={600}
                        c="white"
                        className="opacity-80!"
                      >
                        {t("preview_coming_soon")}
                      </Text>
                    </Box>
                  </Box>
                )}
              </Stack>

              {/* curriculum */}
              <Stack gap={16}>
                <Stack gap={10}>
                  <Text fw={700} size="lg">
                    {t("course_curriculum")}
                  </Text>
                  <Group gap={8}>
                    <Badge
                      size="lg"
                      radius="md"
                      variant="light"
                      color="hongbao-red"
                      leftSection={<BookOpenIcon size={13} weight="fill" />}
                    >
                      {t("modules", { count: courseDetail?.lessonCount || 0 })}
                    </Badge>
                    <Badge
                      size="lg"
                      radius="md"
                      variant="light"
                      color="hongbao-orange"
                      leftSection={<VideoIcon size={13} weight="fill" />}
                    >
                      {t("videos", { count: courseDetail?.videoCount || 0 })}
                    </Badge>
                    {totalQuizCount > 0 && (
                      <Badge
                        size="lg"
                        radius="md"
                        variant="light"
                        color="hongbao-gold"
                        leftSection={
                          <SealQuestionIcon size={13} weight="fill" />
                        }
                      >
                        {t("quizzes", { count: totalQuizCount })}
                      </Badge>
                    )}
                  </Group>
                </Stack>

                <Accordion
                  variant="separated"
                  radius={16}
                  chevronPosition="right"
                  multiple
                  classNames={{
                    item: "border-gray-200! shadow-none! overflow-hidden! transition-all! duration-200! ease-out! hover:border-hongbao-red-200! data-[active]:border-hongbao-red-200! data-[active]:shadow-[0_10px_30px_-12px_rgba(245,34,45,0.25)]!",
                    control: "hover:bg-hongbao-cream-50/60!",
                    panel: "border-t! border-gray-100!",
                  }}
                >
                  {courseDetail?.lessons?.map((lesson, index) => {
                    const itemCount =
                      (lesson?.subLessons?.reduce(
                        (sum, sl) =>
                          sum +
                          (sl?.videos?.length || 0) +
                          (sl?.quizzes?.length || 0),
                        0,
                      ) || 0) + (lesson?.quizzes?.length || 0);

                    return (
                      <Accordion.Item key={lesson.id} value={lesson.id}>
                        <Accordion.Control>
                          <Group gap={14} wrap="nowrap">
                            <Box className="flex! items-center! justify-center! shrink-0! w-10! h-10! rounded-xl! bg-gradient-to-br! from-hongbao-red-500! to-hongbao-maroon-600! text-white! font-bold! text-sm! shadow-sm! shadow-hongbao-red-500/30!">
                              {index + 1}
                            </Box>
                            <Stack gap={3}>
                              <Text
                                size="10px"
                                fw={700}
                                c="var(--hb-accent-text)"
                                className="uppercase! tracking-[0.14em]!"
                              >
                                {t("module_n", { n: index + 1 })}
                              </Text>
                              <Text fw={700} size="sm">
                                {lesson.title}
                              </Text>
                              <Text size="xs" c={"gray.6"}>
                                {t("items", { count: itemCount })}
                              </Text>
                            </Stack>
                          </Group>
                        </Accordion.Control>
                        <Accordion.Panel>
                          <Stack gap={4} pt={8}>
                            {lesson?.subLessons?.map((sublesson) => (
                              <Box key={sublesson?.title}>
                                {sublesson?.title && (
                                  <Group gap={8} className="pt-3! pb-1! px-2!">
                                    <Box className="w-1! h-3.5! rounded-full! bg-gradient-to-b! from-hongbao-red-400! to-hongbao-gold-400!" />
                                    <Text
                                      size="xs"
                                      fw={700}
                                      c={"gray.5"}
                                      className="uppercase! tracking-wide!"
                                    >
                                      {sublesson.title}
                                    </Text>
                                  </Group>
                                )}
                                <Stack gap={0}>
                                  {sublesson?.videos?.map((v) => (
                                    <CurriculumRow
                                      key={v?.id}
                                      title={v?.title}
                                      type="video"
                                    />
                                  ))}
                                  {sublesson?.quizzes?.map((q) => (
                                    <CurriculumRow
                                      key={q.id}
                                      title={q.title}
                                      type="quiz"
                                    />
                                  ))}
                                </Stack>
                              </Box>
                            ))}
                            {lesson?.quizzes?.map((q) => (
                              <CurriculumRow
                                key={q.id}
                                title={q?.title}
                                type="quiz"
                              />
                            ))}
                          </Stack>
                        </Accordion.Panel>
                      </Accordion.Item>
                    );
                  })}

                  {(courseDetail?.quizzes?.length || 0) > 0 && (
                    <Accordion.Item value="final-assessment">
                      <Accordion.Control>
                        <Group gap={14} wrap="nowrap">
                          <Box className="flex! items-center! justify-center! shrink-0! w-10! h-10! rounded-xl! bg-gradient-to-br! from-hongbao-gold-500! to-hongbao-orange-600! text-white! shadow-sm! shadow-hongbao-gold-500/30!">
                            <SealQuestionIcon size={18} weight="fill" />
                          </Box>
                          <Stack gap={3}>
                            <Text
                              size="10px"
                              fw={700}
                              c="var(--hb-gold-text)"
                              className="uppercase! tracking-[0.14em]!"
                            >
                              {t("assessment")}
                            </Text>
                            <Text fw={700} size="sm">
                              {t("final_assessment")}
                            </Text>
                            <Text size="xs" c={"gray.6"}>
                              {t("quizzes_lower", {
                                count: courseDetail?.quizzes?.length || 0,
                              })}
                            </Text>
                          </Stack>
                        </Group>
                      </Accordion.Control>
                      <Accordion.Panel>
                        <Stack gap={0} pt={8}>
                          {courseDetail?.quizzes?.map((q) => (
                            <CurriculumRow
                              key={q.id}
                              title={q.title}
                              type="quiz"
                            />
                          ))}
                        </Stack>
                      </Accordion.Panel>
                    </Accordion.Item>
                  )}
                </Accordion>
              </Stack>
            </Stack>

            {/* purchase card */}
            <Paper
              bdrs={24}
              withBorder
              className="w-full! lg:w-[360px]! lg:shrink-0! lg:sticky! lg:top-24! overflow-hidden! border-gray-200! shadow-lg!"
            >
              {/* image placeholder / preview trigger */}
              <Box
                onClick={previewVideo ? openPreview : undefined}
                className={`relative! h-40! w-full! bg-gradient-to-br! from-hongbao-red-500! to-hongbao-maroon-600! ${previewVideo ? "cursor-pointer! group!" : ""}`}
              >
                <Box className="absolute! inset-0! bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.3)_1px,transparent_0)]! bg-[length:18px_18px]!" />
                <Box className="absolute! inset-0! flex! items-center! justify-center!">
                  {previewVideo ? (
                    <Box className="flex! items-center! justify-center! w-16! h-16! rounded-full! bg-surface! shadow-xl! transition-transform! duration-200! ease-out! group-hover:scale-110!">
                      <IconPlayerPlayFilled
                        size={26}
                        className="text-hongbao-red-600! dark:text-night-red! translate-x-[2px]!"
                      />
                    </Box>
                  ) : (
                    <ImageIcon
                      size={44}
                      weight="light"
                      className="text-white/50!"
                    />
                  )}
                </Box>
                {previewVideo && (
                  <Text
                    size="xs"
                    fw={600}
                    c="white"
                    className="absolute! bottom-3! left-1/2! -translate-x-1/2!"
                  >
                    {t("preview_this_course")}
                  </Text>
                )}
                {courseDetail?.level && (
                  <Badge
                    size="lg"
                    radius="md"
                    className="absolute! top-3! left-3! bg-surface/95! text-hongbao-red-700! dark:text-night-red!"
                  >
                    {courseDetail.level}
                  </Badge>
                )}
                {courseDetail?.isFree ? (
                  <Badge
                    size="lg"
                    radius="md"
                    color="dark.9"
                    className="absolute! top-3! right-3! text-white!"
                  >
                    {t("free")}
                  </Badge>
                ) : (
                  (courseDetail?.discount || 0) > 0 && (
                    <Badge
                      size="lg"
                      radius="md"
                      color="hongbao-gold.6"
                      className="absolute! top-3! right-3! text-white!"
                    >
                      {t("percent_off", { pct: courseDetail?.discount || 0 })}
                    </Badge>
                  )
                )}
              </Box>

              <Stack gap={24} p={28}>
                <PriceText
                  data={{
                    price: courseDetail?.price || 0,
                    perTime: courseDetail?.perTime || 2,
                    isFree: courseDetail?.isFree || false,
                  }}
                />

                <RubyButtonComponent
                  size="xl"
                  fullWidth
                  component={Link}
                  href="/shop?type=course"
                >
                  {t("buy_now")}
                </RubyButtonComponent>

                <Divider />

                <Stack gap={12}>
                  <Text fw={700} size="sm">
                    {t("whats_included")}
                  </Text>
                  <Stack gap={10}>
                    {courseDetail?.includedAssets?.map((asset) => (
                      <Group key={asset} gap={10} wrap="nowrap">
                        <Box className="flex! items-center! justify-center! w-5! h-5! rounded-full! bg-hongbao-red-50! text-hongbao-red-600! dark:text-night-red! shrink-0!">
                          <IconCheck size={12} stroke={3} />
                        </Box>
                        <Text size="sm" c={"gray.7"}>
                          {asset}
                        </Text>
                      </Group>
                    ))}
                  </Stack>
                </Stack>

                <Divider />

                <button className="flex! items-center! justify-center! gap-2! text-gray-500! hover:text-hongbao-red-600! dark:hover:text-night-red! transition-colors! duration-200! cursor-pointer!">
                  <IconShare size={14} />
                  <Text size="xs" fw={600}>
                    {t("share_course")}
                  </Text>
                </button>
              </Stack>
            </Paper>
          </Flex>

          {previewVideo && (
            <Modal
              opened={previewOpened}
              onClose={closePreview}
              title={t("course_preview")}
              size="xl"
              radius={16}
              centered
            >
              <MediaPlayer
                title={previewVideo.title}
                src={previewVideo.url || ""}
                viewType="video"
                className="aspect-video!"
              >
                <MediaProvider />
                <DefaultVideoLayout icons={defaultLayoutIcons} />
              </MediaPlayer>
            </Modal>
          )}
        </Stack>
      )}
    </ClientLayout>
  );
};

export default PageComponent;
