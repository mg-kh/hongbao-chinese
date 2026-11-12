import { Tooltip, UnstyledButton } from "@mantine/core";
import type { NavSection } from "../../types/sideBarMenu.type";

interface Props {
  sections: NavSection[];
  activeId: string;
  onSelect: (id: string) => void;
}

const SectionRail: React.FC<Props> = ({ sections, activeId, onSelect }) => {
  return (
    <>
      {sections.map((section) => {
        const Icon = section.icon;
        return (
          <Tooltip
            key={section.id}
            label={section.label}
            position="right"
            withArrow
            transitionProps={{ duration: 0 }}
          >
            <UnstyledButton
              className="flex! h-11! w-11! items-center! justify-center! rounded-lg! text-gray-600! transition-colors! duration-[120ms]! hover:bg-gray-100! data-[active]:bg-hongbao-red-50! data-[active]:text-hongbao-red-600! data-[active]:hover:bg-hongbao-red-50!"
              data-active={section.id === activeId || undefined}
              aria-label={section.label}
              onClick={() => onSelect(section.id)}
            >
              <Icon size={22} stroke={1.5} />
            </UnstyledButton>
          </Tooltip>
        );
      })}
    </>
  );
};

export default SectionRail;
