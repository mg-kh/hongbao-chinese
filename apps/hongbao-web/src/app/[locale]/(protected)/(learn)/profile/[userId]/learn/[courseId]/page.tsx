"use client";

import RichTextContent from "@/components/RichTextContent/RichTextContent";
import { Badge, Box, Group, Stack, Text } from "@mantine/core";
import { BookOpenIcon, VideoIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import useContainer from "./useContainer";
import CustomBreadCrumb from "@/components/CustomBreadCrumb/CustomBreadCrumb";

const Page = () => {
  const { courseDetail } = useContainer();
  const { userId } = useParams();
  const t = useTranslations("Learn.CoursePage");
  const tc = useTranslations("Learn.Common");

  return (
    <div className="w-full min-w-0">
      <Stack gap={18}>
        <CustomBreadCrumb
          links={[
            { label: tc("profile"), href: `/profile/${userId}`, isActive: true },
            {
              label: tc("my_courses"),
              href: `/profile/${userId}/my-courses`,
              isActive: true,
            },
            {
              label: courseDetail?.title || tc("course"),
              href: "",
              isActive: false,
            },
          ]}
        />
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
                className="w-fit! bg-surface/95! text-hongbao-red-700! dark:text-night-red!"
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
            {t("lesson_count", { count: courseDetail?.lessonCount || 0 })}
          </Badge>
          <Badge
            size="lg"
            radius="md"
            variant="light"
            color="hongbao-orange"
            leftSection={<VideoIcon size={13} weight="fill" />}
          >
            {t("video_count", { count: courseDetail?.videoCount || 0 })}
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
  );
};

export default Page;
