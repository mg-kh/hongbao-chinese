import * as React from "react";

const QuizIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    fill="none"
    {...props}
  >
    <rect
      x={56}
      y={48}
      width={144}
      height={176}
      rx={16}
      stroke="currentColor"
      strokeWidth={14}
      strokeLinejoin="round"
    />
    <rect x={96} y={30} width={64} height={32} rx={10} fill="currentColor" />
    <path
      d="M88 132l24 24 48-48"
      stroke="currentColor"
      strokeWidth={16}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1={84}
      y1={192}
      x2={172}
      y2={192}
      stroke="currentColor"
      strokeWidth={14}
      strokeLinecap="round"
    />
  </svg>
);

export default QuizIcon;
