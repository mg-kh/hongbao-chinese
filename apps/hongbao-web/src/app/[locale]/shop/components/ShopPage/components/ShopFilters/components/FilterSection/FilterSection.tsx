"use client";

import { Collapse, Text, UnstyledButton } from "@mantine/core";
import { CaretDownIcon } from "@phosphor-icons/react";
import useContainer from "@/app/[locale]/shop/components/ShopPage/components/ShopFilters/components/FilterSection/useContainer";

interface Props {
  title: string;
  /** Short summary of the current selection, shown while collapsed. */
  summary?: string;
  children: React.ReactNode;
}

/** Collapsible filter group: a title row with a caret, open by default. */
const FilterSection: React.FC<Props> = ({ title, summary, children }) => {
  const { opened, toggle } = useContainer();

  return (
    <div className="border-t! border-gray-100! py-3.5!">
      <UnstyledButton
        onClick={toggle}
        aria-expanded={opened}
        className="flex! w-full! items-center! justify-between! gap-2! py-0.5!"
      >
        <span className="min-w-0!">
          <Text fw={700} size="sm" className="text-gray-900!">
            {title}
          </Text>
          {!opened && summary && (
            <Text size="xs" c="gray.5" truncate>
              {summary}
            </Text>
          )}
        </span>
        <CaretDownIcon
          size={14}
          weight="bold"
          className={`shrink-0! text-gray-400! transition-transform! duration-200! ${
            opened ? "rotate-180!" : ""
          }`}
        />
      </UnstyledButton>
      <Collapse expanded={opened}>
        <div className="pt-2.5!">{children}</div>
      </Collapse>
    </div>
  );
};

export default FilterSection;
