import { Link } from "@/i18n/navigation";
import { cn } from "@/utils/cn";
import type { NavLink, NavLinkGroup } from "../../../../types/sideBarMenu.type";

interface Props {
  group: NavLinkGroup;
  /** position within the panel, used only for inter-group spacing */
  index: number;
  isLinkActive: (link: NavLink) => boolean;
  onNavigate?: () => void;
}

const LinkGroupBlock: React.FC<Props> = ({
  group,
  index,
  isLinkActive,
  onNavigate,
}) => {
  const isLabeled = Boolean(group.group);

  return (
    <div
      className={cn(
        "flex flex-col gap-0.5",
        // labeled groups are nudged in so the label bar lines up with the links
        isLabeled && "pl-1.5",
        // each following labeled group is split off with a divider line
        index > 0 &&
          (isLabeled
            ? "mt-4 border-t border-gray-200 pt-4"
            : "mt-2.5"),
      )}
    >
      {isLabeled && (
        <div className="mb-1 flex items-center gap-1.5 px-4 text-[11px] font-bold uppercase tracking-[0.06em] text-hongbao-red-600 before:h-3 before:w-[3px] before:rounded-[2px] before:bg-hongbao-red-600 before:content-['']">
          {group.group}
        </div>
      )}
      {group.links.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          className="mr-4 flex h-10.5 items-center gap-2.5 rounded-r-lg px-4 text-sm font-medium text-gray-600 no-underline transition-colors duration-[120ms] hover:bg-gray-100 hover:text-hongbao-brown-800 data-[active]:bg-hongbao-red-600 data-[active]:text-white data-[active]:hover:bg-hongbao-red-600"
          data-active={isLinkActive(link) || undefined}
          onClick={onNavigate}
        >
          <span>{link.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default LinkGroupBlock;
