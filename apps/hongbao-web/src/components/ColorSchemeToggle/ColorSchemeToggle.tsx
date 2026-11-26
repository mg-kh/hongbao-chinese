"use client";

import useColorSchemeToggle from "@/hooks/useColorSchemeToggle";
import { ActionIcon, Tooltip } from "@mantine/core";
import { IconMoonStars, IconSun } from "@tabler/icons-react";
import React from "react";

interface Props {
  className?: string;
}

/**
 * Sun / moon switch for the public site. Both icons are rendered and the
 * visible one is picked with the `dark:` variant, so the server markup is
 * correct before hydration and there is no icon flash.
 */
const ColorSchemeToggle: React.FC<Props> = ({ className }) => {
  const { isDark, toggle } = useColorSchemeToggle();

  return (
    <Tooltip label={isDark ? "Light mode" : "Dark mode"} withArrow>
      <ActionIcon
        onClick={toggle}
        variant="default"
        size={40}
        radius="xl"
        aria-label="Toggle dark mode"
        className={`border-gray-200! bg-surface! text-gray-600! transition-colors! duration-200! hover:border-hongbao-red-200! hover:bg-hongbao-cream-50! hover:text-hongbao-red-600! dark:hover:text-night-gold! ${className ?? ""}`}
      >
        <IconMoonStars size={19} stroke={1.8} className="dark:hidden!" />
        <IconSun size={19} stroke={1.8} className="hidden! dark:block!" />
      </ActionIcon>
    </Tooltip>
  );
};

export default ColorSchemeToggle;
