import { ScrollArea } from "@mantine/core";
import type { NavLink, NavLinkGroup } from "../../types/sideBarMenu.type";
import LinkGroupBlock from "./components/LinkGroupBlock/LinkGroupBlock";

interface Props {
  title: string;
  linkGroups: NavLinkGroup[];
  isLinkActive: (link: NavLink) => boolean;
  onNavigate?: () => void;
}

const LinkPanel: React.FC<Props> = ({
  title,
  linkGroups,
  isLinkActive,
  onNavigate,
}) => {
  return (
    <div className="flex min-w-0 flex-1 flex-col bg-gray-50">
      <div className="flex h-15 shrink-0 grow-0 items-center border-b border-gray-200 bg-surface px-4 text-lg font-semibold text-hongbao-brown-800 dark:text-night-brown">
        {title}
      </div>

      <ScrollArea className="min-h-0 flex-1" type="scroll" scrollbarSize={6}>
        <div className="flex flex-col gap-1 py-4">
          {linkGroups.map((group, index) => (
            <LinkGroupBlock
              key={group.group || index}
              group={group}
              index={index}
              isLinkActive={isLinkActive}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default LinkPanel;
