import * as React from "react";

const LessonIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    fill="none"
    {...props}
  >
    <path
      d="M48 48c0-8 6-14 14-14h96l50 50v134c0 8-6 14-14 14H62c-8 0-14-6-14-14Z"
      stroke="currentColor"
      strokeWidth={14}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M158 34v42a8 8 0 0 0 8 8h42Z" fill="currentColor" />
    <line
      x1={80}
      y1={132}
      x2={176}
      y2={132}
      stroke="currentColor"
      strokeWidth={14}
      strokeLinecap="round"
    />
    <line
      x1={80}
      y1={166}
      x2={176}
      y2={166}
      stroke="currentColor"
      strokeWidth={14}
      strokeLinecap="round"
    />
    <line
      x1={80}
      y1={200}
      x2={140}
      y2={200}
      stroke="currentColor"
      strokeWidth={14}
      strokeLinecap="round"
    />
  </svg>
);

export default LessonIcon;
