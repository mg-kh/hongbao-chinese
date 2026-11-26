import useContainer from "@/components/HanziPractice/components/StrokeArrows/useContainer";
import React from "react";

interface Props {
  medians: number[][][];
  size: number;
  padding: number;
  /** Light core of the arrow - reads on the maroon / red / gold ink. */
  color?: string;
  /** Dark casing under the core - reads on the pale paper. */
  casingColor?: string;
}

/**
 * Overlay for the stroke-order writer: a dashed arrow along each stroke in
 * the direction it is written, with its order number at the start point.
 * Every mark is two-tone (light core on a dark casing, like map roads) so it
 * stays legible both over the maroon / red / gold strokes and the pale paper.
 * Purely visual - never intercepts pointer input meant for the writer.
 */
const StrokeArrows: React.FC<Props> = ({
  medians,
  size,
  padding,
  color = "#ffffff",
  casingColor = "#2a0a0a",
}) => {
  const { arrows, markerId, badgeRadius, lineWidth } = useContainer({
    medians,
    size,
    padding,
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden
      className="pointer-events-none! absolute! inset-0! [animation:fade-up_0.2s_ease-out_both]"
    >
      <defs>
        <marker
          id={markerId}
          viewBox="0 0 10 10"
          refX="7"
          refY="5"
          markerWidth="4"
          markerHeight="4"
          orient="auto-start-reverse"
          overflow="visible"
        >
          <path
            d="M0 0 L10 5 L0 10 z"
            fill={color}
            stroke={casingColor}
            strokeWidth={1.4}
            strokeLinejoin="round"
          />
        </marker>
      </defs>

      {arrows.map((arrow) => (
        <g key={`line-${arrow.number}`}>
          {/* casing - solid, wider, underneath */}
          <path
            d={arrow.d}
            fill="none"
            stroke={casingColor}
            strokeOpacity={0.7}
            strokeWidth={lineWidth + 2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* core - light dashes on top, carries the arrowhead */}
          <path
            d={arrow.d}
            fill="none"
            stroke={color}
            strokeWidth={lineWidth}
            strokeDasharray={`${lineWidth * 2.5} ${lineWidth * 1.8}`}
            strokeLinecap="round"
            strokeLinejoin="round"
            markerEnd={`url(#${markerId})`}
          />
        </g>
      ))}

      {/* badges last so they sit above every line */}
      {arrows.map((arrow) => (
        <g
          key={`badge-${arrow.number}`}
          transform={`translate(${arrow.start.x} ${arrow.start.y})`}
        >
          <circle
            r={badgeRadius}
            fill={casingColor}
            stroke={color}
            strokeWidth={1.5}
          />
          <text
            textAnchor="middle"
            dominantBaseline="central"
            fill={color}
            fontSize={badgeRadius * 1.15}
            fontWeight={700}
            className="tabular-nums!"
          >
            {arrow.number}
          </text>
        </g>
      ))}
    </svg>
  );
};

export default StrokeArrows;
