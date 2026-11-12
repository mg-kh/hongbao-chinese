import { TDashboardStat } from "./common.type";

export type TDashboardStats = {
  totalStudents: TDashboardStat;
  activeCourses: TDashboardStat;
  revenue: TDashboardStat;
  pendingPurchases: TDashboardStat;
};

export type TCategoryBreakdown = {
  category: string;
  count: number;
  color: string;
};

export type TTopCourse = {
  id: string;
  title: string;
  enrollments: number;
  /** 0-100, enrollments relative to the top course. */
  fillPct: number;
};

export type TDashboardOverviewRes = {
  stats: TDashboardStats;
  courseCategoryBreakdown: TCategoryBreakdown[];
  flashcardCategoryBreakdown: TCategoryBreakdown[];
  levelTestCategoryBreakdown: TCategoryBreakdown[];
  topCourses: TTopCourse[];
};
