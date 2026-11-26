"use client";

import useColorSchemeToggle from "@/hooks/useColorSchemeToggle";
import OptionLabel from "@/components/AppearanceSelector/components/OptionLabel/OptionLabel";
import { SegmentedControl, Stack, Text } from "@mantine/core";
import { IconDeviceDesktop, IconMoonStars, IconSun } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import React from "react";

/** Light / Dark / System choice for the public site and profile area. */
const AppearanceSelector: React.FC = () => {
  const { colorScheme, setScheme } = useColorSchemeToggle();
  const t = useTranslations("Shared.AppearanceSelector");

  return (
    <Stack gap={10}>
      <Stack gap={2}>
        <Text fw={700}>{t("title")}</Text>
        <Text size="sm" c="dimmed">
          {t("description")}
        </Text>
      </Stack>
      <SegmentedControl
        value={colorScheme}
        onChange={setScheme}
        radius="xl"
        size="sm"
        className="w-full! sm:w-fit!"
        data={[
          {
            value: "light",
            label: (
              <OptionLabel icon={<IconSun size={16} />} label={t("light")} />
            ),
          },
          {
            value: "dark",
            label: (
              <OptionLabel
                icon={<IconMoonStars size={16} />}
                label={t("dark")}
              />
            ),
          },
          {
            value: "auto",
            label: (
              <OptionLabel
                icon={<IconDeviceDesktop size={16} />}
                label={t("system")}
              />
            ),
          },
        ]}
      />
    </Stack>
  );
};

export default AppearanceSelector;
