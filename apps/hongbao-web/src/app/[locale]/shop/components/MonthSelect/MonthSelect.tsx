"use client";

import { Select } from "@mantine/core";
import { clampMonths, MONTH_OPTIONS } from "../../types/shop.type";

interface Props {
  value: number;
  onChange: (months: number) => void;
  size?: "xs" | "sm" | "md";
  label?: string;
  className?: string;
}

/** Access-duration picker (1-12 months), shared by the product card and cart. */
const MonthSelect: React.FC<Props> = ({
  value,
  onChange,
  size = "sm",
  label,
  className,
}) => (
  <Select
    label={label}
    data={MONTH_OPTIONS}
    value={String(clampMonths(value))}
    onChange={(v) => v && onChange(clampMonths(Number(v)))}
    allowDeselect={false}
    checkIconPosition="right"
    radius="md"
    size={size}
    comboboxProps={{ withinPortal: true }}
    className={className}
    classNames={{ input: "font-medium!" }}
  />
);

export default MonthSelect;
