import React from "react";

interface Props {
  icon: React.ReactNode;
  title: string;
  /** Optional right-aligned extra, e.g. a count or an action. */
  aside?: React.ReactNode;
}

/** Small labelled divider that opens each block on the card's answer side. */
const SectionHeading: React.FC<Props> = ({ icon, title, aside }) => (
  <div className="mb-3! flex! items-center! gap-2!">
    <span className="flex! h-6! w-6! shrink-0! items-center! justify-center! rounded-lg! bg-hongbao-red-50! text-hongbao-red-600!">
      {icon}
    </span>
    <span className="text-[11px]! font-bold! uppercase! tracking-[0.12em]! text-gray-500!">
      {title}
    </span>
    <span className="flex-1!" />
    {aside}
  </div>
);

export default SectionHeading;
