"use client";

import Image from "next/image";
import LinkPanel from "./components/LinkPanel/LinkPanel";
import SectionRail from "./components/SectionRail/SectionRail";
import useContainer from "./useContainer";

interface Props {
  /** Called when a nav link is selected (used to close the mobile drawer). */
  onNavigate?: () => void;
}

const SideBarMenu: React.FC<Props> = ({ onNavigate }) => {
  const {
    sections,
    activeId,
    setActiveId,
    activeSection,
    linkGroups,
    isLinkActive,
  } = useContainer();

  return (
    <nav className="flex h-full w-full overflow-hidden">
      <div className="flex shrink-0 grow-0 basis-16 flex-col items-center gap-1.5 border-r border-gray-200 bg-white py-2.5">
        <div className="mb-1 flex h-12.5 items-center justify-center">
          <Image
            src="/assets/logo.svg"
            width={34}
            height={34}
            alt="Hong Bao"
            priority
          />
        </div>

        <SectionRail
          sections={sections}
          activeId={activeId}
          onSelect={setActiveId}
        />
      </div>

      <LinkPanel
        title={activeSection.label}
        linkGroups={linkGroups}
        isLinkActive={isLinkActive}
        onNavigate={onNavigate}
      />
    </nav>
  );
};

export default SideBarMenu;
