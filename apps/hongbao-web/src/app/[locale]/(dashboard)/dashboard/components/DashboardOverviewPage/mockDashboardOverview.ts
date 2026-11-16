import { TDashboardOverviewRes } from "../../types/dashboardOverview.type";

/**
 * Stand-in for GET /dashboard/overview. Shaped exactly like
 * `TDashboardOverviewRes` so wiring the real endpoint later is a matter of
 * flipping `enabled: true` in useContainer.ts and deleting this file - no
 * consumer of the hook needs to change.
 */
export const MOCK_DASHBOARD_OVERVIEW: TDashboardOverviewRes = {
  stats: {
    totalStudents: { value: 3482, deltaPct: 8.2 },
    activeCourses: { value: 24, deltaPct: 4.3 },
    revenue: { value: 18_420_000, deltaPct: 12.6 },
    pendingPurchases: { value: 7, deltaPct: 0 },
  },
  courseCategoryBreakdown: [
    { category: "HSK Prep", count: 9, color: "hongbao-red.5" },
    { category: "Conversation", count: 6, color: "hongbao-gold.5" },
    { category: "Business Chinese", count: 4, color: "hongbao-maroon.5" },
    { category: "Kids Chinese", count: 3, color: "hongbao-orange.5" },
    { category: "Culture & Reading", count: 2, color: "hongbao-brown.4" },
  ],
  flashcardCategoryBreakdown: [
    { category: "HSK Prep", count: 420, color: "hongbao-red.5" },
    { category: "Conversation", count: 310, color: "hongbao-gold.5" },
    { category: "Business Chinese", count: 145, color: "hongbao-maroon.5" },
    { category: "Kids Chinese", count: 96, color: "hongbao-orange.5" },
    { category: "Culture & Reading", count: 58, color: "hongbao-brown.4" },
  ],
  mockTestCategoryBreakdown: [
    { category: "HSK Prep", count: 14, color: "hongbao-red.5" },
    { category: "Conversation", count: 8, color: "hongbao-gold.5" },
    { category: "Business Chinese", count: 5, color: "hongbao-maroon.5" },
    { category: "Kids Chinese", count: 3, color: "hongbao-orange.5" },
    { category: "Culture & Reading", count: 2, color: "hongbao-brown.4" },
  ],
  topCourses: [
    { id: "c1", title: "HSK 3 Intensive", enrollments: 428, fillPct: 100 },
    { id: "c2", title: "Everyday Conversation", enrollments: 356, fillPct: 83 },
    { id: "c3", title: "HSK 1 Foundations", enrollments: 312, fillPct: 73 },
    { id: "c4", title: "Business Chinese Essentials", enrollments: 198, fillPct: 46 },
    { id: "c5", title: "Chinese for Kids", enrollments: 164, fillPct: 38 },
  ],
};
