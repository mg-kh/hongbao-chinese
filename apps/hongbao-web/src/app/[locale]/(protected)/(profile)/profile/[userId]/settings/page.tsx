"use client";

import { Box, Paper, Stack, Text } from "@mantine/core";
import AppearanceSelector from "@/components/AppearanceSelector/AppearanceSelector";
import LanguageSelector from "@/components/LanguageSelector/LanguageSelector";
import { GearIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

/**
 * Profile settings. Appearance (light / dark / system) and language are live; the rest
 * is a placeholder until the real settings form is built.
 */
const SettingsPage = () => {
  const t = useTranslations("Profile.Settings");
  return (
    <Stack gap={16}>
      <Text size="xl" fw={"bold"} c={"hongbao-red"}>
        {t("title")}
      </Text>

      <Paper
        withBorder
        bdrs={20}
        p={{ base: 20, sm: 28 }}
        className="border-gray-200! bg-surface!"
      >
        <AppearanceSelector />
      </Paper>

      <Paper
        withBorder
        bdrs={20}
        p={{ base: 20, sm: 28 }}
        className="border-gray-200! bg-surface!"
      >
        <LanguageSelector />
      </Paper>

      <Paper
        withBorder
        bdrs={20}
        p={{ base: 28, sm: 40 }}
        className="border-dashed! border-gray-300! bg-gray-50/60!"
      >
        <Stack align="center" gap={12}>
          <Box className="flex! items-center! justify-center! w-14! h-14! rounded-2xl! bg-hongbao-red-50! text-hongbao-red-600! dark:text-night-red!">
            <GearIcon size={26} />
          </Box>
          <Text fw={600} ta="center">
            {t("coming_soon")}
          </Text>
          <Text size="sm" c="gray.6" ta="center" className="max-w-[420px]!">
            {t("coming_soon_description")}
          </Text>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default SettingsPage;
