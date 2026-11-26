"use client";

import { Checkbox, Radio } from "@mantine/core";

interface Props {
  active: boolean;
  onClick: () => void;
  /** `radio` for single-choice groups, `checkbox` for toggles. */
  shape: "radio" | "checkbox";
  icon?: React.ElementType;
  children: React.ReactNode;
}

/** A full-width, clickable filter row: indicator, optional icon, label. */
const FilterOption: React.FC<Props> = ({
  active,
  onClick,
  shape,
  icon: Icon,
  children,
}) => {
  const Indicator = shape === "radio" ? Radio.Indicator : Checkbox.Indicator;

  return (
    <button
      type="button"
      role={shape}
      aria-checked={active}
      onClick={onClick}
      className={`flex! w-full! items-center! gap-2.5! rounded-lg! px-2! py-1.5! text-left! text-sm! cursor-pointer! transition-colors! duration-150! ${
        active ? "bg-hongbao-red-50!" : "hover:bg-gray-50!"
      }`}
    >
      <Indicator
        checked={active}
        color="hongbao-red"
        size="xs"
        radius={shape === "checkbox" ? 4 : undefined}
        aria-hidden
      />

      {Icon && (
        <Icon
          size={16}
          weight={active ? "fill" : "regular"}
          className={active ? "text-hongbao-red-600! dark:text-night-red!" : "text-gray-400!"}
        />
      )}

      <span
        className={`flex-1! truncate! ${
          active
            ? "font-semibold! text-hongbao-red-700! dark:text-night-red!"
            : "font-medium! text-gray-700!"
        }`}
      >
        {children}
      </span>
    </button>
  );
};

export default FilterOption;
