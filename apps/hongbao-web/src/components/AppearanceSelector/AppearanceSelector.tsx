"use client";

import useColorSchemeToggle from "@/hooks/useColorSchemeToggle";
import OptionLabel from "@/components/AppearanceSelector/components/OptionLabel/OptionLabel";
import { SegmentedControl, Stack, Text } from "@mantine/core";
import { IconDeviceDesktop, IconMoonStars, IconSun } from "@tabler/icons-react";
import React from "react";

/** Light / Dark / System choice for the public site and profile area. */
const AppearanceSelector: React.FC = () => {
  const { colorScheme, setScheme } = useColorSchemeToggle();

  return (
    <Stack gap={10}>
      <Stack gap={2}>
        <Text fw={700}>Appearance</Text>
        <Text size="sm" c="dimmed">
          Dark mode is easier on the eyes at night. System follows your
          device setting.
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
            label: <OptionLabel icon={<IconSun size={16} />} label="Light" />,
          },
          {
            value: "dark",
            label: (
              <OptionLabel icon={<IconMoonStars size={16} />} label="Dark" />
            ),
          },
          {
            value: "auto",
            label: (
              <OptionLabel
                icon={<IconDeviceDesktop size={16} />}
                label="System"
              />
            ),
          },
        ]}
      />
    </Stack>
  );
};

export default AppearanceSelector;
