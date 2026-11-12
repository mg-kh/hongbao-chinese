"use client";

import { Box, Paper, Stack, Text } from "@mantine/core";
import { GearIcon } from "@phosphor-icons/react";

/**
 * Placeholder so the Settings entry in MobileBottomNav resolves to a real
 * route - replace the body with the actual settings form when it is built.
 */
const SettingsPage = () => {
  return (
    <Stack gap={16}>
      <Text size="xl" fw={"bold"} c={"hongbao-red"}>
        Settings
      </Text>

      <Paper
        withBorder
        bdrs={20}
        p={{ base: 28, sm: 40 }}
        className="border-dashed! border-gray-300! bg-gray-50/60!"
      >
        <Stack align="center" gap={12}>
          <Box className="flex! items-center! justify-center! w-14! h-14! rounded-2xl! bg-hongbao-red-50! text-hongbao-red-600!">
            <GearIcon size={26} />
          </Box>
          <Text fw={600} ta="center">
            Settings coming soon
          </Text>
          <Text size="sm" c="gray.6" ta="center" className="max-w-[420px]!">
            Account preferences and notification controls will live here.
          </Text>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default SettingsPage;
