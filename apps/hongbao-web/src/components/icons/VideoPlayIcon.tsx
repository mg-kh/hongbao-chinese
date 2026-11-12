import * as React from "react";

const VideoPlayIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    fill="none"
    {...props}
  >
    <rect
      x={32}
      y={56}
      width={192}
      height={144}
      rx={20}
      stroke="currentColor"
      strokeWidth={14}
      strokeLinejoin="round"
    />
    <path d="M110 98v60l52-30Z" fill="currentColor" stroke="currentColor" strokeWidth={10} strokeLinejoin="round" />
    <line
      x1={70}
      y1={56}
      x2={70}
      y2={40}
      stroke="currentColor"
      strokeWidth={14}
      strokeLinecap="round"
    />
    <line
      x1={186}
      y1={56}
      x2={186}
      y2={40}
      stroke="currentColor"
      strokeWidth={14}
      strokeLinecap="round"
    />
  </svg>
);

export default VideoPlayIcon;
