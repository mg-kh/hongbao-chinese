import LoaderComponent from "@/components/LoaderComponent/LoaderComponent";
import { Link } from "@/i18n/navigation";
import { formatDuration } from "@/utils/formatDuration";
import {
  Badge,
  Box,
  Button,
  CloseButton,
  Group,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  PlayCircleIcon,
  SealQuestionIcon,
  VideoIcon,
} from "@phosphor-icons/react";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  DefaultVideoLayout,
  defaultLayoutIcons,
} from "@vidstack/react/player/layouts/default";
import CustomBreadCrumb from "@/components/CustomBreadCrumb/CustomBreadCrumb";
import { useTranslations } from "next-intl";
import useContainer from "./useContainer";

const PageComponent = () => {
  const {
    video,
    isLoading,
    courseTitle,
    courseHref,
    myCoursesHref,
    prevHref,
    nextHref,
    nextItem,
    showCompleteOverlay,
    closeCompleteOverlay,
    handleTimeUpdate,
    handleDurationChange,
    handleEnded,
    isCompleted,
    isMarkingComplete,
    handleMarkComplete,
  } = useContainer();
  const t = useTranslations("Learn.Video");
  const tc = useTranslations("Learn.Common");

  const duration = formatDuration(video?.duration);

  return (
    <Stack gap={18} className="w-full!">
      <CustomBreadCrumb
        links={[
          { label: tc("my_courses"), href: myCoursesHref, isActive: true },
          { label: courseTitle || tc("course"), href: courseHref, isActive: true },
          { label: video?.title || tc("video"), href: "", isActive: false },
        ]}
      />

      {isLoading ? (
        <LoaderComponent
          h={340}
          wrapperClass="rounded-[20px]! bg-gray-50! w-full!"
        />
      ) : !video ? (
        <Paper withBorder bdrs={20} p={{ base: 32, sm: 48 }}>
          <Stack align="center" gap={10}>
            <Box className="flex! items-center! justify-center! w-14! h-14! rounded-2xl! bg-hongbao-red-50! text-hongbao-red-600! dark:text-night-red!">
              <VideoIcon size={26} weight="fill" />
            </Box>
            <Text fw={700}>{t("not_found_title")}</Text>
            <Text size="sm" c="gray.6" ta="center">
              {t("not_found_description")}
            </Text>
          </Stack>
        </Paper>
      ) : (
        <>
          {/* video player */}
          <Paper
            withBorder
            bdrs={20}
            pos="relative"
            className="overflow-hidden! border-gray-200! shadow-sm! bg-black!"
          >
            <MediaPlayer
              src={video?.url || ""}
              viewType="video"
              className="aspect-video!"
              onTimeUpdate={handleTimeUpdate}
              onDurationChange={handleDurationChange}
              onEnded={handleEnded}
            >
              <MediaProvider />
              <DefaultVideoLayout icons={defaultLayoutIcons} />
            </MediaPlayer>

            {/* completion checkpoint - shown once playback crosses the
                watched threshold, mirroring Coursera's in-player dialog */}
            {showCompleteOverlay && (
              <Box className="absolute! inset-0! z-50! flex! items-center! justify-center! bg-black/60! backdrop-blur-[2px]! p-2! sm:p-4!">
                <Paper
                  bdrs={16}
                  pos="relative"
                  className="w-full! max-w-[360px]! max-h-full! overflow-y-auto! text-center! shadow-xl! p-3.5! sm:p-7! sm:rounded-[20px]!"
                >
                  <CloseButton
                    onClick={closeCompleteOverlay}
                    aria-label={tc("close")}
                    size="sm"
                    className="absolute! top-1.5! right-1.5! sm:top-3! sm:right-3!"
                  />
                  <Box className="mx-auto! flex! items-center! justify-center! w-9! h-9! sm:w-14! sm:h-14! rounded-full! bg-green-100! text-green-600! dark:text-night-green!">
                    <CheckCircleIcon
                      size={18}
                      weight="fill"
                      className="sm:hidden!"
                    />
                    <CheckCircleIcon
                      size={30}
                      weight="fill"
                      className="hidden! sm:block!"
                    />
                  </Box>
                  <Text
                    fw={800}
                    className="text-sm! sm:text-lg! mt-2! sm:mt-3.5!"
                  >
                    {t("complete_title")}
                  </Text>
                  <Text
                    c="gray.6"
                    className="text-xs! sm:text-sm! mt-1! sm:mt-1!"
                  >
                    {t("complete_description")}
                  </Text>
                  <Group
                    justify="center"
                    gap={8}
                    className="mt-2.5! sm:mt-[18px]!"
                  >
                    <Button
                      variant="default"
                      size="xs"
                      onClick={closeCompleteOverlay}
                      className="sm:h-[36px]! sm:px-[18px]! sm:text-sm!"
                    >
                      {t("stay_here")}
                    </Button>
                    {nextHref && (
                      <Button
                        component={Link}
                        href={nextHref}
                        size="xs"
                        color="hongbao-red"
                        rightSection={<ArrowRightIcon size={13} />}
                        className="sm:h-[36px]! sm:px-[18px]! sm:text-sm!"
                      >
                        {t("continue")}
                      </Button>
                    )}
                  </Group>
                </Paper>
              </Box>
            )}
          </Paper>

          {/* lesson info */}
          <Stack gap={10}>
            <Group gap={10} wrap="wrap">
              <Box className="flex! items-center! justify-center! shrink-0! w-9! h-9! rounded-xl! bg-hongbao-red-50! text-hongbao-red-600! dark:text-night-red!">
                <VideoIcon size={18} weight="fill" />
              </Box>
              {duration && (
                <Badge
                  size="sm"
                  radius="sm"
                  variant="light"
                  color="gray"
                  leftSection={<ClockIcon size={11} weight="fill" />}
                >
                  {duration}
                </Badge>
              )}
              <Button
                ml="auto"
                size="xs"
                radius="md"
                variant={isCompleted ? "light" : "outline"}
                color="green"
                leftSection={
                  <CheckCircleIcon
                    size={14}
                    weight={isCompleted ? "fill" : "regular"}
                  />
                }
                loading={isMarkingComplete}
                disabled={isCompleted}
                onClick={handleMarkComplete}
                className={
                  isCompleted
                    ? "disabled:bg-green-50! disabled:text-green-700! dark:disabled:text-night-green! disabled:cursor-default!"
                    : undefined
                }
              >
                {isCompleted ? tc("completed") : tc("mark_as_complete")}
              </Button>
            </Group>

            <Text
              fw={800}
              className="text-xl! sm:text-2xl! leading-snug! text-gray-900!"
            >
              {video?.title}
            </Text>

            {video?.description && (
              <Text c="gray.6" size="sm" className="leading-relaxed!">
                {video.description}
              </Text>
            )}
          </Stack>

          {/* up next */}
          {nextItem && nextHref && (
            <Paper
              component={Link}
              href={nextHref}
              withBorder
              bdrs={16}
              p={14}
              className="no-underline! border-gray-200! transition-all! duration-200! ease-out! hover:border-hongbao-red-200! hover:bg-hongbao-cream-50/60! hover:-translate-y-0.5!"
            >
              <Group justify="space-between" wrap="nowrap" gap={12}>
                <Group gap={12} wrap="nowrap" className="min-w-0! flex-1!">
                  <Box className="flex! items-center! justify-center! shrink-0! w-10! h-10! rounded-xl! bg-gradient-to-br! from-hongbao-red-500! to-hongbao-maroon-600! text-white!">
                    {nextItem.type === "video" ? (
                      <PlayCircleIcon size={19} weight="fill" />
                    ) : (
                      <SealQuestionIcon size={19} weight="fill" />
                    )}
                  </Box>
                  <Stack gap={0} className="min-w-0!">
                    <Text
                      size="10px"
                      fw={700}
                      c="var(--hb-accent-text)"
                      className="uppercase! tracking-[0.1em]!"
                    >
                      {t("up_next")}
                    </Text>
                    <Text
                      fw={700}
                      size="sm"
                      lineClamp={1}
                      className="text-gray-900!"
                    >
                      {nextItem.title}
                    </Text>
                  </Stack>
                </Group>
                <ArrowRightIcon
                  size={16}
                  className="text-gray-400! shrink-0!"
                />
              </Group>
            </Paper>
          )}

          {/* prev / next */}
          <Group
            py={10}
            justify="space-between"
            gap={10}
            className="flex-col-reverse! sm:flex-row! items-stretch! sm:items-center!"
          >
            {prevHref ? (
              <Button
                component={Link}
                href={prevHref}
                variant="default"
                size="md"
                leftSection={<ArrowLeftIcon size={16} />}
                className="w-full! sm:w-auto!"
              >
                {tc("previous")}
              </Button>
            ) : (
              <Button
                variant="default"
                size="md"
                disabled
                leftSection={<ArrowLeftIcon size={16} />}
                className="w-full! sm:w-auto!"
              >
                {tc("previous")}
              </Button>
            )}
            {nextHref ? (
              <Button
                component={Link}
                href={nextHref}
                size="md"
                color="hongbao-red"
                rightSection={<ArrowRightIcon size={16} />}
                className="w-full! sm:w-auto!"
              >
                {tc("next")}
              </Button>
            ) : (
              <Button
                size="md"
                color="hongbao-red"
                disabled
                rightSection={<ArrowRightIcon size={16} />}
                className="w-full! sm:w-auto!"
              >
                {tc("next")}
              </Button>
            )}
          </Group>
        </>
      )}
    </Stack>
  );
};

export default PageComponent;
