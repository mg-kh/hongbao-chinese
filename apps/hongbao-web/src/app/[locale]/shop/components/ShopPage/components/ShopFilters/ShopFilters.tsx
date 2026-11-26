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
import { useTranslations } from "next-intl";
import type { ShopTypeFilter } from "@/app/[locale]/shop/components/ShopPage/useContainer";
import FilterOption from "@/app/[locale]/shop/components/ShopPage/components/ShopFilters/components/FilterOption/FilterOption";
import FilterSection from "@/app/[locale]/shop/components/ShopPage/components/ShopFilters/components/FilterSection/FilterSection";

const TYPE_OPTIONS: {
  value: ShopTypeFilter;
  /** Translation key under `Shop.Types`. */
  labelKey: "all_products" | "courses" | "mock_tests" | "flashcards";
  icon: React.ElementType;
}[] = [
  { value: "all", labelKey: "all_products", icon: SquaresFourIcon },
  { value: "course", labelKey: "courses", icon: CourseTypeIcon },
  { value: "mock-test", labelKey: "mock_tests", icon: MockTestTypeIcon },
  { value: "flashcard", labelKey: "flashcards", icon: FlashcardTypeIcon },
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
  const t = useTranslations("Shop.Filters");
  const tTypes = useTranslations("Shop.Types");
  const typeKey = TYPE_OPTIONS.find((o) => o.value === type)?.labelKey;
  const typeLabel = typeKey ? tTypes(typeKey) : undefined;
  const levelLabel =
    categoryOptions.find((o) => o.value === categoryId)?.label ??
    t("all_levels");

  return (
    <div className="flex! flex-col!">
      {/* header */}
      <div className="flex! items-center! justify-between! pb-3!">
        <div className="flex! items-center! gap-2!">
          <Text fw={800} size="md" className="text-gray-900!">
            {t("title")}
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
            className="text-xs! font-semibold! text-hongbao-red-600! dark:text-night-red! underline-offset-2! hover:underline! cursor-pointer!"
          >
            {t("clear_all")}
          </button>
        )}
      </div>

      {/* search within results */}
      <div className="pb-3.5!">
        <TextInput
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          placeholder={t("search_placeholder")}
          aria-label={t("search_placeholder")}
          radius="md"
          size="sm"
          leftSection={<MagnifyingGlassIcon size={15} />}
          rightSection={
            search ? (
              <UnstyledButton
                onClick={() => setSearch("")}
                aria-label={t("clear_search")}
                className="flex! text-gray-400! hover:text-gray-700!"
              >
                <XIcon size={14} weight="bold" />
              </UnstyledButton>
            ) : null
          }
        />
      </div>

      <FilterSection title={t("product_type")} summary={typeLabel}>
        <div role="radiogroup" className="flex! flex-col! gap-0.5!">
          {TYPE_OPTIONS.map((opt) => (
            <FilterOption
              key={opt.value}
              shape="radio"
              icon={opt.icon}
              active={type === opt.value}
              onClick={() => setType(opt.value)}
            >
              {tTypes(opt.labelKey)}
            </FilterOption>
          ))}
        </div>
      </FilterSection>

      {categoryOptions.length > 0 && (
        <FilterSection title={t("hsk_level")} summary={levelLabel}>
          <div role="radiogroup" className="flex! flex-col! gap-0.5!">
            <FilterOption
              shape="radio"
              active={!categoryId}
              onClick={() => categoryId && toggleCategory(categoryId)}
            >
              {t("all_levels")}
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

      <FilterSection
        title={t("deals")}
        summary={onSaleOnly ? t("on_sale") : undefined}
      >
        <FilterOption
          shape="checkbox"
          icon={TagIcon}
          active={onSaleOnly}
          onClick={() => setOnSaleOnly(!onSaleOnly)}
        >
          {t("on_sale")}
        </FilterOption>
      </FilterSection>
    </div>
  );
};

export default ShopFilters;
