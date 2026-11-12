"use client";

import { Box, Switch, Text } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import type { ShopTypeFilter } from "../../useContainer";

const TYPE_OPTIONS: { value: ShopTypeFilter; label: string }[] = [
  { value: "all", label: "All products" },
  { value: "course", label: "Courses" },
  { value: "level-test", label: "Level Tests" },
];

interface Props {
  type: ShopTypeFilter;
  setType: (t: ShopTypeFilter) => void;
  categoryId: string | null;
  toggleCategory: (id: string) => void;
  onSaleOnly: boolean;
  setOnSaleOnly: (v: boolean) => void;
  activeFilterCount: number;
  clearFilters: () => void;
  typeCounts: Record<ShopTypeFilter, number>;
  /** HSK levels (categories) to filter by. */
  categoryOptions: { label: string; value: string }[];
}

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <Text
    size="11px"
    fw={700}
    c="gray.5"
    className="mb-2.5! uppercase! tracking-[0.12em]!"
  >
    {children}
  </Text>
);

const Chip: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={`rounded-full! border! px-3.5! py-1.5! text-xs! font-semibold! cursor-pointer! transition-colors! duration-200! ease-out! ${
      active
        ? "border-hongbao-red-500! bg-hongbao-red-500! text-white!"
        : "border-gray-200! bg-white! text-gray-600! hover:border-hongbao-red-200! hover:text-hongbao-red-600!"
    }`}
  >
    {children}
  </button>
);

const ShopFilters: React.FC<Props> = ({
  type,
  setType,
  categoryId,
  toggleCategory,
  onSaleOnly,
  setOnSaleOnly,
  activeFilterCount,
  clearFilters,
  typeCounts,
  categoryOptions,
}) => (
  <Box className="flex! flex-col! gap-6!">
    <div className="flex! items-center! justify-between!">
      <Text fw={700} size="sm" className="text-gray-900!">
        Filters
      </Text>
      {activeFilterCount > 0 && (
        <button
          type="button"
          onClick={clearFilters}
          className="flex! items-center! gap-1! text-xs! font-semibold! text-gray-500! hover:text-hongbao-red-600! transition-colors! duration-200! cursor-pointer!"
        >
          <IconX size={13} />
          Clear all
        </button>
      )}
    </div>

    {/* category */}
    <div>
      <SectionLabel>Category</SectionLabel>
      <div className="flex! flex-col! gap-0.5!">
        {TYPE_OPTIONS.map((opt) => {
          const active = type === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setType(opt.value)}
              aria-pressed={active}
              className={`flex! items-center! justify-between! rounded-lg! px-2.5! py-2! text-sm! cursor-pointer! transition-colors! duration-200! ${
                active
                  ? "bg-hongbao-red-50! font-bold! text-hongbao-red-700!"
                  : "font-medium! text-gray-600! hover:bg-gray-50!"
              }`}
            >
              {opt.label}
              <span className="text-xs! text-gray-400!">
                {typeCounts[opt.value]}
              </span>
            </button>
          );
        })}
      </div>
    </div>

    {/* HSK level */}
    {categoryOptions.length > 0 && (
      <div>
        <SectionLabel>HSK level</SectionLabel>
        <div className="flex! flex-wrap! gap-2!">
          {categoryOptions.map((opt) => (
            <Chip
              key={opt.value}
              active={categoryId === opt.value}
              onClick={() => toggleCategory(opt.value)}
            >
              {opt.label}
            </Chip>
          ))}
        </div>
      </div>
    )}

    {/* deals */}
    <div>
      <SectionLabel>Deals</SectionLabel>
      <Switch
        checked={onSaleOnly}
        onChange={(e) => setOnSaleOnly(e.currentTarget.checked)}
        color="hongbao-red"
        label={
          <Text size="sm" fw={500} c="gray.7">
            On sale only
          </Text>
        }
      />
    </div>
  </Box>
);

export default ShopFilters;
