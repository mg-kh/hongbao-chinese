import { REVENUE } from "@/constants/DashboardRoutes";
import { currencyFormatter } from "@/utils/currencyFormatter";
import { SimpleGrid } from "@mantine/core";
import { IconBooks, IconClockHour4, IconCoin, IconUsers } from "@tabler/icons-react";
import { TDashboardStats } from "../../../../types/dashboardOverview.type";
import StatCard from "../../../StatCard/StatCard";

interface Props {
  stats: TDashboardStats;
  isLoading?: boolean;
}

const StatsGrid: React.FC<Props> = ({ stats, isLoading }) => {
  return (
    <SimpleGrid cols={{ base: 1, xs: 2, lg: 3, xl: 6 }} spacing="md">
      <StatCard
        label="Total Students"
        value={stats.totalStudents.value.toLocaleString()}
        deltaPct={stats.totalStudents.deltaPct}
        icon={IconUsers}
        color="hongbao-maroon"
        isLoading={isLoading}
      />
      <StatCard
        label="Active Courses"
        value={stats.activeCourses.value.toLocaleString()}
        deltaPct={stats.activeCourses.deltaPct}
        icon={IconBooks}
        color="hongbao-gold"
        isLoading={isLoading}
      />
      <StatCard
        label="Revenue"
        value={currencyFormatter({ value: stats.revenue.value })}
        deltaPct={stats.revenue.deltaPct}
        icon={IconCoin}
        color="hongbao-red"
        isLoading={isLoading}
        href={REVENUE}
      />
      <StatCard
        label="Pending Purchases"
        value={stats.pendingPurchases.value.toLocaleString()}
        deltaPct={stats.pendingPurchases.deltaPct}
        icon={IconClockHour4}
        color="yellow"
        isLoading={isLoading}
      />
    </SimpleGrid>
  );
};

export default StatsGrid;
