"use client";

import useColorSchemeToggle from "@/hooks/useColorSchemeToggle";
import { Tooltip, UnstyledButton } from "@mantine/core";
import { IconMoonStars, IconSun } from "@tabler/icons-react";
import React from "react";

interface Props {
  className?: string;
}

/**
 * Sliding sun / moon switch for the public site. The thumb position and the
 * visible icon are driven by the `dark:` variant, so the server markup is
 * correct before hydration and nothing jumps on load.
 */
const ColorSchemeToggle: React.FC<Props> = ({ className }) => {
  const { isDark, toggle } = useColorSchemeToggle();

  return (
    <Tooltip label={isDark ? "Light mode" : "Dark mode"} withArrow>
      <UnstyledButton
        onClick={toggle}
        role="switch"
        aria-checked={isDark}
        aria-label="Toggle dark mode"
        className={`relative! flex! items-center! justify-between! shrink-0! w-[72px]! h-10! px-[11px]! rounded-full! border! border-gray-200! bg-surface! transition-colors! duration-300! ease-out! hover:border-hongbao-red-200! dark:hover:border-night-gold/50! ${className ?? ""}`}
      >
        {/* track icons - the one under the thumb is hidden by it */}
        <IconSun size={15} stroke={1.8} className="text-gray-400!" />
        <IconMoonStars size={15} stroke={1.8} className="text-gray-400!" />

        {/* sliding thumb */}
        <span
          aria-hidden
          className="absolute! top-[3px]! left-[3px]! flex! items-center! justify-center! w-8! h-8! rounded-full! bg-hongbao-gold-100! text-hongbao-gold-800! shadow-sm! transition-all! duration-300! ease-out! dark:translate-x-8! dark:bg-hongbao-maroon-700! dark:text-night-gold!"
        >
          <IconSun size={17} stroke={2} className="dark:hidden!" />
          <IconMoonStars
            size={17}
            stroke={2}
            className="hidden! dark:block!"
          />
        </span>
      </UnstyledButton>
    </Tooltip>
  );
};

export default ColorSchemeToggle;
