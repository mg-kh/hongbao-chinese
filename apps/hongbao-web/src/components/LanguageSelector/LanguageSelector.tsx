"use client";

import useContainer from "@/components/LanguageSwitch/useContainer";
import { SegmentedControl, Stack, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import React from "react";

// shown in their own language so they're recognisable whatever the current locale is
const nativeLabels: Record<string, string> = {
  mm: "မြန်မာ",
  en: "English",
};

/** Settings-page language choice (MM / EN). */
const LanguageSelector: React.FC = () => {
  const t = useTranslations("Shared.LanguageSelector");
  const { locale, options, isPending, handleChange } = useContainer();

  return (
    <Stack gap={10}>
      <Stack gap={2}>
        <Text fw={700}>{t("title")}</Text>
        <Text size="sm" c="dimmed">
          {t("description")}
        </Text>
      </Stack>
      <SegmentedControl
        aria-label={t("title")}
        value={locale}
        onChange={handleChange}
        disabled={isPending}
        radius="xl"
        size="sm"
        className="w-full! sm:w-fit!"
        data={options.map((o) => ({
          value: o.value,
          label: nativeLabels[o.value] ?? o.label,
        }))}
      />
    </Stack>
  );
};

export default LanguageSelector;
