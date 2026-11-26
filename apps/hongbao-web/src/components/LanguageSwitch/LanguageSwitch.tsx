"use client";

import { Menu, Text, UnstyledButton } from "@mantine/core";
import {
  IconCaretDownFilled,
  IconCheck,
  IconWorld,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import React from "react";
import useContainer from "./useContainer";

interface Props {
  className?: string;
}

// shown in their own language so they're recognisable whatever the current locale is
const nativeLabels: Record<string, string> = {
  mm: "မြန်မာ",
  en: "English",
};

/** MM / EN switch for the public site - pill button with a dropdown. */
const LanguageSwitch: React.FC<Props> = ({ className }) => {
  const t = useTranslations("LanguageSwitch");
  const { locale, options, isPending, handleChange } = useContainer();
  const current = options.find((o) => o.value === locale);

  return (
    <Menu
      shadow="lg"
      width={180}
      offset={8}
      radius={16}
      position="bottom-end"
      classNames={{
        dropdown: "p-1.5! border-gray-200!",
        item: "rounded-xl! py-2! px-2.5! transition-colors! duration-150! ease-out! hover:bg-hongbao-cream-50!",
      }}
    >
      <Menu.Target>
        <UnstyledButton
          aria-label={t("label")}
          disabled={isPending}
          className={`flex! items-center! gap-1.5! h-10! pl-3! pr-2.5! rounded-full! border! border-gray-200! bg-surface! text-gray-700! transition-colors! duration-200! ease-out! hover:border-hongbao-red-200! hover:bg-hongbao-cream-50! hover:text-hongbao-red-600! dark:hover:text-night-red! disabled:opacity-60! ${className ?? ""}`}
        >
          <IconWorld size={18} stroke={1.8} />
          <Text component="span" size="xs" fw={700} className="tracking-wide!">
            {current?.label}
          </Text>
          <IconCaretDownFilled size={10} className="opacity-50!" />
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        {options.map((o) => {
          const active = o.value === locale;
          return (
            <Menu.Item
              key={o.value}
              onClick={() => handleChange(o.value)}
              rightSection={
                active ? (
                  <IconCheck
                    size={15}
                    className="text-hongbao-red-600! dark:text-night-red!"
                  />
                ) : null
              }
            >
              <Text size="sm" fw={active ? 700 : 600} c="gray.8">
                {nativeLabels[o.value] ?? o.label}
              </Text>
            </Menu.Item>
          );
        })}
      </Menu.Dropdown>
    </Menu>
  );
};

export default LanguageSwitch;
