import * as React from "react";
const HSK_MockTest_Icon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    fill="none"
    {...props}
  >
    <rect
      x={48}
      y={40}
      width={160}
      height={184}
      rx={12}
      stroke="currentColor"
      strokeWidth={16}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M92 40a12 12 0 0 1 12-12h48a12 12 0 0 1 12 12v12H92V40Z"
      fill="currentColor"
    />
    <text
      x={128}
      y={128}
      textAnchor="middle"
      fill="currentColor"
      fontFamily="'MiSans','PingFang SC','Microsoft YaHei',sans-serif"
      fontSize={72}
      fontWeight={700}
    >
      {"\u6C49"}
    </text>
    <line
      x1={96}
      y1={192}
      x2={96}
      y2={172}
      stroke="currentColor"
      strokeWidth={16}
      strokeLinecap="round"
    />
    <line
      x1={128}
      y1={192}
      x2={128}
      y2={158}
      stroke="currentColor"
      strokeWidth={16}
      strokeLinecap="round"
    />
    <line
      x1={160}
      y1={192}
      x2={160}
      y2={144}
      stroke="currentColor"
      strokeWidth={16}
      strokeLinecap="round"
    />
  </svg>
);
export default HSK_MockTest_Icon;
