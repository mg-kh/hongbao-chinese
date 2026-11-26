import SectionTitle from "@/components/SectionTitle/SectionTitle";
import { Box, Container, Space, Text } from "@mantine/core";
import { IconPlayerPlayFilled } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

/**
 * Placeholder poster until a real walkthrough video is uploaded - swap this
 * block for <MediaPlayer src=... viewType="video"><MediaProvider /></MediaPlayer>
 * (see course-detail/[courseId]/components/PageComponent for the pattern
 * already used elsewhere in this codebase) once a src is available.
 */
const UserGuideVideo = () => {
  const t = useTranslations("Home.UserGuideVideo");
  return (
    <Box>
      <Container size={"xl"} px={{ base: 16, sm: 24 }}>
        <SectionTitle
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
          align="center"
        />
        <Space h={40} />

        <Box className="relative! mx-auto! max-w-[860px]! aspect-video! rounded-[28px]! overflow-hidden! bg-gradient-to-br! from-hongbao-maroon-700! via-hongbao-red-600! to-hongbao-brown-700! shadow-xl!">
          <Box className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:22px_22px]" />

          <Box className="absolute! inset-0! flex! items-center! justify-center!">
            <Box className="flex! items-center! justify-center! w-20! h-20! sm:w-24! sm:h-24! rounded-full! bg-surface! shadow-2xl!">
              <IconPlayerPlayFilled
                size={34}
                className="text-hongbao-red-600! dark:text-night-red! translate-x-[2px]!"
              />
            </Box>
          </Box>

          <Box className="absolute! bottom-0! left-0! right-0! p-6! bg-gradient-to-t! from-black/60! to-transparent!">
            <Text fw={700} c="white" size="lg">
              {t("video_title")}
            </Text>
            <Text size="sm" c="#dee2e6">
              {t("video_coming_soon")}
            </Text>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default UserGuideVideo;
