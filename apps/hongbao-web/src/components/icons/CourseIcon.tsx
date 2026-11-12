import * as React from "react";

const CourseIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    fill="none"
    {...props}
  >
    <path
      d="M128 96c0-6-20-32-78-32-6 0-10 4-10 10v112c0 6 4 10 10 10 58 0 78 20 78 20"
      stroke="currentColor"
      strokeWidth={14}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M128 96c0-6 20-32 78-32 6 0 10 4 10 10v112c0 6-4 10-10 10-58 0-78 20-78 20"
      stroke="currentColor"
      strokeWidth={14}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1={128}
      y1={96}
      x2={128}
      y2={206}
      stroke="currentColor"
      strokeWidth={14}
      strokeLinecap="round"
    />
    <path d="M112 46h32v40l-16-10-16 10Z" fill="currentColor" />
  </svg>
);

export default CourseIcon;
