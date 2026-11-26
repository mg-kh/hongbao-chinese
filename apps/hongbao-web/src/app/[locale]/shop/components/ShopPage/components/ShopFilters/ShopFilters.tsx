"use client";

import { TextInput, Text, UnstyledButton } from "@mantine/core";
import {
  CourseTypeIcon,
  FlashcardTypeIcon,
  MockTestTypeIcon,
} from "@/components/icons/productTypeIcons";
import {
  MagnifyingGlassIcon,
  SquaresFourIcon,
  TagIcon,
  XIcon,
} from "@phosphor-icons/react";
import type { ShopTypeFilter } from "@/app/[locale]/shop/components/ShopPage/useContainer";
import FilterOption from "@/app/[locale]/shop/components/ShopPage/components/ShopFilters/components/FilterOption/FilterOption";
import FilterSection from "@/app/[locale]/shop/components/ShopPage/components/ShopFilters/components/FilterSection/FilterSection";

const TYPE_OPTIONS: {
  value: ShopTypeFilter;
  label: string;
  icon: React.ElementType;
}[] = [
  { value: "all", label: "All products", icon: SquaresFourIcon },
  { value: "course", label: "Courses", icon: CourseTypeIcon },
  { value: "mock-test", label: "Mock Tests", icon: MockTestTypeIcon },
  { value: "flashcard", label: "Flashcards", icon: FlashcardTypeIcon },
];

interface Props {
  search: string;
  setSearch: (v: string) => void;
  type: ShopTypeFilter;
  setType: (t: ShopTypeFilter) => void;
  categoryId: string | null;
  toggleCategory: (id: string) => void;
  onSaleOnly: boolean;
  setOnSaleOnly: (v: boolean) => void;
  activeFilterCount: number;
  clearFilters: () => void;
  /** HSK levels (categories) to filter by. */
  categoryOptions: { label: string; value: string }[];
}

const ShopFilters: React.FC<Props> = ({
  search,
  setSearch,
  type,
  setType,
  categoryId,
  toggleCategory,
  onSaleOnly,
  setOnSaleOnly,
  activeFilterCount,
  clearFilters,
  categoryOptions,
}) => {
  const typeLabel = TYPE_OPTIONS.find((o) => o.value === type)?.label;
  const levelLabel =
    categoryOptions.find((o) => o.value === categoryId)?.label ?? "All levels";

  return (
    <div className="flex! flex-col!">
      {/* header */}
      <div className="flex! items-center! justify-between! pb-3!">
        <div className="flex! items-center! gap-2!">
          <Text fw={800} size="md" className="text-gray-900!">
            Filters
          </Text>
          {activeFilterCount > 0 && (
            <span className="flex! h-5! min-w-5! items-center! justify-center! rounded-full! bg-hongbao-red-500! px-1.5! text-[11px]! font-bold! text-white!">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs! font-semibold! text-hongbao-red-600! underline-offset-2! hover:underline! cursor-pointer!"
          >
            Clear all
          </button>
        )}
      </div>

      {/* search within results */}
      <div className="pb-3.5!">
        <TextInput
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          placeholder="Search products"
          aria-label="Search products"
          radius="md"
          size="sm"
          leftSection={<MagnifyingGlassIcon size={15} />}
          rightSection={
            search ? (
              <UnstyledButton
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="flex! text-gray-400! hover:text-gray-700!"
              >
                <XIcon size={14} weight="bold" />
              </UnstyledButton>
            ) : null
          }
        />
      </div>

      <FilterSection title="Product type" summary={typeLabel}>
        <div role="radiogroup" className="flex! flex-col! gap-0.5!">
          {TYPE_OPTIONS.map((opt) => (
            <FilterOption
              key={opt.value}
              shape="radio"
              icon={opt.icon}
              active={type === opt.value}
              onClick={() => setType(opt.value)}
            >
              {opt.label}
            </FilterOption>
          ))}
        </div>
      </FilterSection>

      {categoryOptions.length > 0 && (
        <FilterSection title="HSK level" summary={levelLabel}>
          <div role="radiogroup" className="flex! flex-col! gap-0.5!">
            <FilterOption
              shape="radio"
              active={!categoryId}
              onClick={() => categoryId && toggleCategory(categoryId)}
            >
              All levels
            </FilterOption>
            {categoryOptions.map((opt) => (
              <FilterOption
                key={opt.value}
                shape="radio"
                active={categoryId === opt.value}
                onClick={() => toggleCategory(opt.value)}
              >
                {opt.label}
              </FilterOption>
            ))}
          </div>
        </FilterSection>
      )}

      <FilterSection title="Deals" summary={onSaleOnly ? "On sale" : undefined}>
        <FilterOption
          shape="checkbox"
          icon={TagIcon}
          active={onSaleOnly}
          onClick={() => setOnSaleOnly(!onSaleOnly)}
        >
          On sale
        </FilterOption>
      </FilterSection>
    </div>
  );
};

export default ShopFilters;
