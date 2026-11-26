"use client";

import SortMenu from "@/app/[locale]/shop/components/ShopPage/components/ResultsToolbar/components/SortMenu/SortMenu";
import {
  ShopSort,
  TAppliedFilter,
} from "@/app/[locale]/shop/components/ShopPage/useContainer";
import { Button, Pill, Text } from "@mantine/core";
import { SlidersHorizontalIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

interface Props {
  total: number;
  sort: ShopSort;
  setSort: (s: ShopSort) => void;
  appliedFilters: TAppliedFilter[];
  clearFilters: () => void;
  /** Opens the mobile filter sheet (button hidden on lg+). */
  openDrawer: () => void;
}

/** Above the product grid: result count, sort, and removable applied-filter chips. */
const ResultsToolbar: React.FC<Props> = ({
  total,
  sort,
  setSort,
  appliedFilters,
  clearFilters,
  openDrawer,
}) => {
  const t = useTranslations("Shop.ResultsToolbar");

  return (
    <div className="mb-4! flex! flex-col! gap-3!">
      <div className="flex! items-center! justify-between! gap-2!">
        <Text size="sm" fw={600} className="text-gray-700!">
          {t("results", { count: total })}
        </Text>

        <div className="flex! items-center! gap-2!">
          <Button
            onClick={openDrawer}
            variant="default"
            radius="xl"
            size="xs"
            className="lg:hidden!"
            leftSection={<SlidersHorizontalIcon size={14} weight="bold" />}
          >
            {t("filters")}
            {appliedFilters.length > 0 ? ` (${appliedFilters.length})` : ""}
          </Button>
          <SortMenu sort={sort} setSort={setSort} />
        </div>
      </div>

      {appliedFilters.length > 0 && (
        <div className="flex! flex-wrap! items-center! gap-2!">
          {appliedFilters.map((f) => (
            <Pill
              key={f.key}
              withRemoveButton
              onRemove={f.remove}
              removeButtonProps={{
                "aria-label": t("remove_filter", { label: f.label }),
              }}
              size="md"
              className="bg-hongbao-red-50! font-semibold! text-hongbao-red-700! dark:text-night-red!"
            >
              {f.label}
            </Pill>
          ))}
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs! font-semibold! text-gray-500! underline-offset-2! hover:text-hongbao-red-600! dark:hover:text-night-red! hover:underline! cursor-pointer!"
          >
            {t("clear_all")}
          </button>
        </div>
      )}
    </div>
  );
};

export default ResultsToolbar;
