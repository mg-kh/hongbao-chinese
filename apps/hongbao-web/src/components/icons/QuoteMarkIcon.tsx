import * as React from "react";

const QuoteMarkIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    fill="none"
    {...props}
  >
    <text
      x={128}
      y={210}
      textAnchor="middle"
      fill="currentColor"
      fontFamily="Georgia, 'Times New Roman', serif"
      fontSize={260}
      fontWeight={700}
    >
      {"“"}
    </text>
  </svg>
);

export default QuoteMarkIcon;
