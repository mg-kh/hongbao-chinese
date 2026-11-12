"use client";

import { Button, Text } from "@mantine/core";
import { SlidersHorizontalIcon } from "@phosphor-icons/react";
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react";
import type { ShopSort } from "../../useContainer";

interface Props {
  sort: ShopSort;
  setSort: (s: ShopSort) => void;
  total: number;
  activeFilterCount: number;
  onOpenFilters: () => void;
}

const TABS: { value: ShopSort; label: string }[] = [
  { value: "relevance", label: "Relevance" },
  { value: "top-sales", label: "Top Sales" },
];

const SortButton: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={`shrink-0! rounded-full! px-3.5! py-1.5! text-xs! font-bold! cursor-pointer! transition-colors! duration-200! ease-out! ${
      active
        ? "bg-hongbao-red-500! text-white!"
        : "bg-white! text-gray-600! ring-1! ring-gray-200! hover:text-hongbao-red-600!"
    }`}
  >
    {children}
  </button>
);

const SortTabs: React.FC<Props> = ({
  sort,
  setSort,
  total,
  activeFilterCount,
  onOpenFilters,
}) => {
  const priceActive = sort === "price-low" || sort === "price-high";

  const togglePrice = () =>
    setSort(sort === "price-low" ? "price-high" : "price-low");

  return (
    <div className="mb-5! flex! items-center! gap-2! rounded-2xl! bg-gray-50/80! p-2! ring-1! ring-gray-200! sm:bg-white!">
      <Text
        size="11px"
        fw={700}
        c="gray.5"
        className="hidden! shrink-0! pl-1.5! uppercase! tracking-[0.1em]! sm:block!"
      >
        Sort
      </Text>

      <div className="flex! flex-1! items-center! gap-2! overflow-x-auto! [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TABS.map((t) => (
          <SortButton
            key={t.value}
            active={sort === t.value}
            onClick={() => setSort(t.value)}
          >
            {t.label}
          </SortButton>
        ))}
        <button
          type="button"
          onClick={togglePrice}
          aria-pressed={priceActive}
          className={`flex! shrink-0! items-center! gap-1! rounded-full! px-3.5! py-1.5! text-xs! font-bold! cursor-pointer! transition-colors! duration-200! ease-out! ${
            priceActive
              ? "bg-hongbao-red-500! text-white!"
              : "bg-white! text-gray-600! ring-1! ring-gray-200! hover:text-hongbao-red-600!"
          }`}
        >
          Price
          {priceActive &&
            (sort === "price-low" ? (
              <IconArrowUp size={13} stroke={3} />
            ) : (
              <IconArrowDown size={13} stroke={3} />
            ))}
        </button>
      </div>

      <Text size="xs" fw={600} c="gray.6" className="hidden! shrink-0! px-1! md:block!">
        {total} {total === 1 ? "result" : "results"}
      </Text>

      <Button
        onClick={onOpenFilters}
        variant="default"
        radius="xl"
        size="xs"
        className="shrink-0! lg:hidden!"
        leftSection={<SlidersHorizontalIcon size={14} weight="bold" />}
      >
        Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
      </Button>
    </div>
  );
};

export default SortTabs;
