export type TDashboardStat = {
  value: number;
  /** Percentage change vs the previous period. Positive = up, negative = down. */
  deltaPct: number;
};
