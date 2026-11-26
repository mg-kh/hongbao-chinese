/** "18.4M" / "250K" for tight spaces (axis ticks, bar labels). */
export const formatCompactAmount = (value: number) => {
  const abs = Math.abs(value);
  if (abs >= 1_000_000)
    return `${(value / 1_000_000).toFixed(abs % 1_000_000 === 0 ? 0 : 1)}M`;
  if (abs >= 1_000)
    return `${(value / 1_000).toFixed(abs % 1_000 === 0 ? 0 : 1)}K`;
  return `${value}`;
};
