import { useId, useMemo } from "react";

/** makemeahanzi data lives in a fixed box: x 0..1024, y -124..900 (y up). */
const BOUNDS = { minX: 0, minY: -124, width: 1024, height: 1024 };

interface Params {
  /** Stroke centre-lines from hanzi-writer's character data, in data space. */
  medians: number[][][];
  /** Rendered writer size in px (square). */
  size: number;
  /** Same padding passed to `HanziWriter.create`. */
  padding: number;
}

export interface TStrokeArrow {
  /** SVG path along the stroke's centre-line, in screen px. */
  d: string;
  /** Where the stroke starts - the numbered badge sits here. */
  start: { x: number; y: number };
  number: number;
}

/**
 * Projects each stroke's median into the writer's screen space using the same
 * maths as hanzi-writer's Positioner, so the arrows sit exactly on the strokes.
 */
const useContainer = ({ medians, size, padding }: Params) => {
  const markerId = `stroke-arrow-${useId().replace(/:/g, "")}`;

  const arrows = useMemo<TStrokeArrow[]>(() => {
    const effective = size - 2 * padding;
    const scale = Math.min(
      effective / BOUNDS.width,
      effective / BOUNDS.height,
    );
    const xOffset =
      -BOUNDS.minX * scale + padding + (effective - scale * BOUNDS.width) / 2;
    const yOffset =
      -BOUNDS.minY * scale + padding + (effective - scale * BOUNDS.height) / 2;

    const project = ([x, y]: number[]) => ({
      x: x * scale + xOffset,
      y: size - yOffset - y * scale,
    });

    return medians
      .filter((median) => median.length >= 2)
      .map((median, i) => {
        const points = median.map(project);
        const d = points
          .map(
            (p, j) => `${j === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`,
          )
          .join(" ");
        return { d, start: points[0], number: i + 1 };
      });
  }, [medians, size, padding]);

  // scale the marks with the box so they read the same at 120px and 360px
  const badgeRadius = Math.max(7, size * 0.03);
  const lineWidth = Math.max(2, size * 0.009);

  return { arrows, markerId, badgeRadius, lineWidth };
};

export default useContainer;
