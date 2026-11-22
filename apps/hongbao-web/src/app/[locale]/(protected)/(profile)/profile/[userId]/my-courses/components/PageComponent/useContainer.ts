import useMyCourses from "@/hooks/global-data-fetching/useMyCourses";
import { CourseFilter } from "../../../types/my-courses.type";

const useContainer = () => {
  const {
    coursesRes,
    isLoading,
    isFetching,
    stats,
    page,
    setPage,
    totalPages,
    filter,
    setFilter,
  } = useMyCourses();

  /** Tab config lives here so the counts stay in sync with `stats`. */
  const filters: { value: CourseFilter; label: string; count: number }[] = [
    { value: "ALL", label: "All", count: stats.total },
    { value: "APPROVED", label: "In progress", count: stats.active },
    { value: "PENDING", label: "Pending", count: stats.pending },
    { value: "EXPIRED", label: "Expired", count: stats.expired },
  ];

  return {
    isLoading,
    isFetching,
    stats,
    page,
    setPage,
    totalPages,
    filter,
    setFilter,
    filters,
    /** Item count for the selected status tab. */
    activeCount: filters.find((f) => f.value === filter)?.count ?? 0,
    filteredCourses: coursesRes,
  };
};

export default useContainer;
