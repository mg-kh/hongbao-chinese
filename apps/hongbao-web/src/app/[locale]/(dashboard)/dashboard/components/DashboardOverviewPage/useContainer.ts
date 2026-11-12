import useApiQuery from "@/hooks/fetching/useApiQuery";
import { TDashboardOverviewRes } from "../../types/dashboardOverview.type";
import { MOCK_DASHBOARD_OVERVIEW } from "./mockDashboardOverview";

const useContainer = () => {
  // TODO(api): backend endpoint isn't built yet. Flip `enabled` to `true`
  // once GET /dashboard/overview ships, then drop the `?? MOCK_DASHBOARD_OVERVIEW`
  // fallback below - the response shape already matches TDashboardOverviewRes
  // so nothing else in this page needs to change.
  const { data, isLoading, isFetching } = useApiQuery<TDashboardOverviewRes>({
    url: "dashboard/overview",
    key: "dashboard-overview",
    enabled: false,
  });

  const overview = data ?? MOCK_DASHBOARD_OVERVIEW;

  return {
    overview,
    isLoading,
    isFetching,
  };
};

export default useContainer;
