import React from "react";

interface Props {
  size: number;
  color?: string;
}

/**
 * 米字格 practice grid behind the writer: dashed centre cross and diagonals,
 * kept very light so it guides proportion without competing with the ink
 * or the stroke-direction arrows. Purely decorative.
 */
const CharacterGrid: React.FC<Props> = ({
  size,
  color = "rgba(140,21,21,0.14)",
}) => {
  const mid = size / 2;
  const dash = `${Math.max(3, size * 0.018)} ${Math.max(3, size * 0.018)}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden
      className="pointer-events-none! absolute! inset-0!"
    >
      <g stroke={color} strokeWidth={1} strokeDasharray={dash} fill="none">
        {/* 田 - centre cross */}
        <line x1={mid} y1={0} x2={mid} y2={size} />
        <line x1={0} y1={mid} x2={size} y2={mid} />
        {/* 米 - diagonals */}
        <line x1={0} y1={0} x2={size} y2={size} />
        <line x1={size} y1={0} x2={0} y2={size} />
      </g>
    </svg>
  );
};

export default CharacterGrid;
