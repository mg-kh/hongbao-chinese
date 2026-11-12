import * as React from "react";

const SpaceRepeatIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    fill="none"
    {...props}
  >
    <path
      d="M164 66A72 72 0 1 1 90 62"
      stroke="currentColor"
      strokeWidth={14}
      strokeLinecap="round"
    />
    <path d="M136 40l30 24-33 16Z" fill="currentColor" />
    <rect
      x={98}
      y={104}
      width={60}
      height={44}
      rx={8}
      stroke="currentColor"
      strokeWidth={12}
    />
    <line
      x1={110}
      y1={126}
      x2={146}
      y2={126}
      stroke="currentColor"
      strokeWidth={10}
      strokeLinecap="round"
    />
  </svg>
);

export default SpaceRepeatIcon;
