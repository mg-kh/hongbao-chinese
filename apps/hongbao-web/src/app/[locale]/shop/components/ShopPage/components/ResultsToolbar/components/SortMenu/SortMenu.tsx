"use client";

import {
  SHOP_SORT_OPTIONS,
  ShopSort,
} from "@/app/[locale]/shop/components/ShopPage/useContainer";
import { Menu, UnstyledButton } from "@mantine/core";
import {
  ArrowsDownUpIcon,
  CaretDownIcon,
  CheckIcon,
} from "@phosphor-icons/react";

interface Props {
  sort: ShopSort;
  setSort: (s: ShopSort) => void;
}

/** "Sort by: <current> ▾" trigger with a checkmarked option list. */
const SortMenu: React.FC<Props> = ({ sort, setSort }) => {
  const current = SHOP_SORT_OPTIONS.find((o) => o.value === sort);

  return (
    <Menu
      position="bottom-end"
      offset={6}
      radius="md"
      shadow="md"
      width={220}
      transitionProps={{ transition: "pop-top-right", duration: 150 }}
    >
      <Menu.Target>
        <UnstyledButton
          aria-label={`Sort products, currently ${current?.label}`}
          className="flex! items-center! gap-1.5! rounded-full! bg-surface! px-3! py-1.5! text-xs! ring-1! ring-gray-200! transition-colors! duration-150! hover:ring-hongbao-red-200! data-expanded:ring-hongbao-red-300!"
        >
          <ArrowsDownUpIcon size={14} className="text-gray-400!" />
          <span className="hidden! text-gray-500! sm:inline!">Sort by:</span>
          <span className="font-semibold! text-gray-900!">
            {current?.label}
          </span>
          <CaretDownIcon size={12} weight="bold" className="text-gray-400!" />
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Sort by</Menu.Label>
        {SHOP_SORT_OPTIONS.map((opt) => {
          const active = opt.value === sort;
          return (
            <Menu.Item
              key={opt.value}
              onClick={() => setSort(opt.value)}
              aria-current={active || undefined}
              rightSection={
                active ? (
                  <CheckIcon
                    size={14}
                    weight="bold"
                    className="text-hongbao-red-600! dark:text-night-red!"
                  />
                ) : null
              }
              className={
                active
                  ? "bg-hongbao-red-50! font-semibold! text-hongbao-red-700! dark:text-night-red!"
                  : "text-gray-700!"
              }
            >
              {opt.label}
            </Menu.Item>
          );
        })}
      </Menu.Dropdown>
    </Menu>
  );
};

export default SortMenu;
