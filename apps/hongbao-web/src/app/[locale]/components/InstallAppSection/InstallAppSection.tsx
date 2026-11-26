"use client";

import { usePwaInstall } from "@/providers/PwaInstallProvider";
import { Box, Button, Container, Group, Stack, Text } from "@mantine/core";
import {
  BellRingingIcon,
  DeviceMobileIcon,
  LightningIcon,
  StarIcon,
  WifiSlashIcon,
} from "@phosphor-icons/react";
import { IconDownload } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

/**
 * Benefits are written as outcomes ("what you get") rather than feature
 * labels - the clearer conversion signal for an install prompt.
 */
const benefits = [
  {
    icon: <LightningIcon size={20} weight="fill" />,
    key: "one_tap",
  },
  {
    icon: <BellRingingIcon size={20} weight="fill" />,
    key: "reminders",
  },
  {
    icon: <WifiSlashIcon size={20} weight="fill" />,
    key: "no_download",
  },
] as const;

/** Manual steps shown when the browser can't offer a native install prompt. */
const manualSteps = ["open_menu", "add_to_home", "confirm"] as const;

const InstallAppSection = () => {
  const t = useTranslations("Home.InstallAppSection");
  const tPwa = useTranslations("PwaInstall");
  const { canInstall, open } = usePwaInstall();

  return (
    // full-bleed band - the gradient spans the viewport, the content stays
    // inside the same xl container the rest of the homepage uses.
    <Box className="relative! overflow-hidden! bg-gradient-to-br! from-hongbao-maroon-800! via-hongbao-red-700! to-hongbao-brown-800!">
      <Box className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.13)_1px,transparent_0)] bg-[length:24px_24px]" />
      <Box className="pointer-events-none absolute -top-24 right-[8%] w-[380px] h-[380px] rounded-full bg-hongbao-gold-400/20 blur-[110px]" />
      <Box className="pointer-events-none absolute -bottom-28 left-[6%] w-[340px] h-[340px] rounded-full bg-hongbao-red-400/25 blur-[110px]" />

      <Container size={"xl"} px={{ base: 16, sm: 24 }} className="relative!">
        <Stack
          gap={0}
          align="center"
          className="py-14! sm:py-18! md:py-24! text-center!"
        >
          <Group
            gap={8}
            wrap="nowrap"
            px={14}
            py={7}
            className="rounded-full! bg-white/12! ring-1! ring-white/25! backdrop-blur-sm!"
          >
            <DeviceMobileIcon size={14} weight="fill" className="text-white!" />
            <Text size="xs" fw={700} c="white" className="tracking-wide!">
              {t("pwa_badge")}
            </Text>
          </Group>

          <Text
            fw={800}
            c="white"
            mt={20}
            className="text-[1.75rem]! sm:text-4xl! md:text-[2.75rem]! leading-[1.2]! max-w-[720px]! text-balance!"
          >
            {tPwa("title")}
          </Text>

          <Text
            c="white"
            mt={14}
            className="opacity-75! text-sm! sm:text-base! leading-relaxed! max-w-[560px]!"
          >
            {tPwa("description")}
          </Text>

          {/* primary action - one per state, kept visually dominant */}
          <Box mt={28} className="w-full! sm:w-auto!">
            {canInstall ? (
              <Button
                size="lg"
                radius="xl"
                onClick={open}
                leftSection={<IconDownload size={19} />}
                className="w-full! sm:w-auto! sm:px-10! bg-white! text-hongbao-red-700! shadow-[0_12px_32px_-8px_rgba(0,0,0,0.45)]! transition-transform! duration-200! ease-out! hover:-translate-y-0.5! hover:bg-white!"
                styles={{
                  root: {
                    backgroundColor: "white",
                    color: "var(--mantine-color-hongbao-red-7)",
                  },
                  label: { fontWeight: 700 },
                }}
              >
                {tPwa("install")}
              </Button>
            ) : (
              // No native prompt on this browser (iOS Safari, or already
              // installed). Research is clear that spelling out the gesture is
              // the biggest lever here, so show the actual steps.
              // Stacked on mobile with a shared left edge so the step numbers
              // line up; inline row from `sm` where they fit side by side.
              <div className="mx-auto! w-fit! flex! flex-col! sm:flex-row! sm:flex-wrap! sm:justify-center! items-start! sm:items-center! gap-3! sm:gap-x-5! sm:gap-y-2! rounded-2xl! bg-white/10! ring-1! ring-white/20! backdrop-blur-sm! px-5! py-4!">
                {manualSteps.map((step, i) => (
                  <div key={step} className="flex! items-center! gap-2.5!">
                    <Box className="flex! items-center! justify-center! shrink-0! w-6! h-6! rounded-full! bg-white/20! text-white! text-[11px]! font-bold!">
                      {i + 1}
                    </Box>
                    <Text
                      size="sm"
                      c="white"
                      fw={600}
                      className="opacity-90! text-left!"
                    >
                      {t(`steps.${step}`)}
                    </Text>
                  </div>
                ))}
              </div>
            )}
          </Box>

          {/* proof sits next to the action it supports, not in a separate block */}
          <Group gap={10} justify="center" wrap="nowrap" mt={20}>
            <Group gap={2} wrap="nowrap">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon
                  key={i}
                  size={14}
                  weight="fill"
                  className="text-hongbao-gold-300!"
                />
              ))}
            </Group>
            <Text size="xs" c="white" fw={600} className="opacity-75!">
              {t("loved_by")}
            </Text>
          </Group>

          {/* Benefits as glass cards. Compact icon-beside-text rows on mobile
              so they don't dominate the fold; centred stacked cards from `sm`. */}
          <div className="mt-9! sm:mt-12! grid grid-cols-1 sm:grid-cols-3 gap-2.5! sm:gap-4! w-full max-w-[900px]">
            {benefits.map((b) => (
              <div
                key={b.key}
                className="flex! flex-row! sm:flex-col! items-center! gap-3! sm:gap-2.5! rounded-2xl! bg-white/[0.08]! ring-1! ring-white/15! backdrop-blur-sm! p-3.5! sm:p-6! transition-colors! duration-300! ease-out! hover:bg-white/[0.13]!"
              >
                <Box className="flex! items-center! justify-center! shrink-0! w-9! h-9! sm:w-11! sm:h-11! rounded-xl! bg-white/15! text-hongbao-gold-300!">
                  {b.icon}
                </Box>
                <div className="min-w-0! text-left! sm:text-center!">
                  <Text fw={700} c="white" size="sm" className="leading-snug!">
                    {t(`benefits.${b.key}.title`)}
                  </Text>
                  <Text
                    size="xs"
                    c="white"
                    mt={2}
                    className="opacity-70! leading-snug! sm:leading-relaxed!"
                  >
                    {t(`benefits.${b.key}.body`)}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </Stack>
      </Container>
    </Box>
  );
};

export default InstallAppSection;
