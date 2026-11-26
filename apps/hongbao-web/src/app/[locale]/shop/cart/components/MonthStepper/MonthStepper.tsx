"use client";

import { IconMinus, IconPlus } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import {
  SHOP_MAX_MONTHS,
  SHOP_MIN_MONTHS,
  clampMonths,
} from "../../../types/shop.type";

interface Props {
  value: number;
  onChange: (months: number) => void;
}

/** Shopee-style quantity stepper, repurposed for the 1-12 month access span. */
const MonthStepper: React.FC<Props> = ({ value, onChange }) => {
  const t = useTranslations("Cart.MonthStepper");
  const current = clampMonths(value);
  const atMin = current <= SHOP_MIN_MONTHS;
  const atMax = current >= SHOP_MAX_MONTHS;

  return (
    <div className="inline-flex! items-center! overflow-hidden! rounded-lg! border! border-gray-200!">
      <button
        type="button"
        onClick={() => onChange(current - 1)}
        disabled={atMin}
        aria-label={t("fewer")}
        className="flex! h-8! w-8! items-center! justify-center! text-gray-600! transition-colors! duration-150! hover:bg-gray-50! disabled:cursor-not-allowed! disabled:text-gray-300! cursor-pointer!"
      >
        <IconMinus size={14} stroke={2.5} />
      </button>
      <span className="min-w-[64px]! border-x! border-gray-200! px-2! py-1! text-center! text-xs! font-bold! text-gray-800! tabular-nums!">
        {t("months_short", { count: current })}
      </span>
      <button
        type="button"
        onClick={() => onChange(current + 1)}
        disabled={atMax}
        aria-label={t("more")}
        className="flex! h-8! w-8! items-center! justify-center! text-gray-600! transition-colors! duration-150! hover:bg-gray-50! disabled:cursor-not-allowed! disabled:text-gray-300! cursor-pointer!"
      >
        <IconPlus size={14} stroke={2.5} />
      </button>
    </div>
  );
};

export default MonthStepper;
