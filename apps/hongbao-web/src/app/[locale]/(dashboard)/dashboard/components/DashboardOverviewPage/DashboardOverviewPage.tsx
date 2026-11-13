"use client";

import CustomBreadCrumb from "@/components/CustomBreadCrumb/CustomBreadCrumb";
import { SimpleGrid, Stack } from "@mantine/core";
import CategoryBreakdownChart from "./components/CategoryBreakdownChart/CategoryBreakdownChart";
import PendingApprovalBanner from "./components/PendingApprovalBanner/PendingApprovalBanner";
import StatsGrid from "./components/StatsGrid/StatsGrid";
import TopCoursesList from "./components/TopCoursesList/TopCoursesList";
import useContainer from "./useContainer";

const DashboardOverviewPage = () => {
  const { overview, isLoading } = useContainer();

  return (
    <Stack p={10} gap="lg">
      <CustomBreadCrumb title="Dashboard" />

      <PendingApprovalBanner pendingCount={overview.stats.pendingPurchases.value} />

      <StatsGrid stats={overview.stats} isLoading={isLoading} />

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
        <CategoryBreakdownChart
          title="Courses by Category"
          unitLabel="published courses"
          data={overview.courseCategoryBreakdown}
          isLoading={isLoading}
        />
        <CategoryBreakdownChart
          title="Flashcards by Category"
          unitLabel="flashcards"
          data={overview.flashcardCategoryBreakdown}
          isLoading={isLoading}
        />
        <CategoryBreakdownChart
          title="Mock Tests by Category"
          unitLabel="mock tests"
          data={overview.mockTestCategoryBreakdown}
          isLoading={isLoading}
        />
      </SimpleGrid>

      <TopCoursesList data={overview.topCourses} isLoading={isLoading} />
    </Stack>
  );
};

export default DashboardOverviewPage;
