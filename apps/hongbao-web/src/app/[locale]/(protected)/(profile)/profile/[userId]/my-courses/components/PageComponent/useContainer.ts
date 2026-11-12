import useMyCourses from "@/hooks/global-data-fetching/useMyCourses";
import { useMemo, useState } from "react";

/** Status buckets the list can be narrowed to. */
export type CourseFilter = "ALL" | "APPROVED" | "PENDING" | "EXPIRED";

const useContainer = () => {
  const [filter, setFilter] = useState<CourseFilter>("ALL");
  const {
    coursesRes,
    isLoading,
    isFetching,
    stats,
    page,
    setPage,
    totalPages,
  } = useMyCourses();

  const filteredCourses = useMemo(() => {
    const list = coursesRes || [];
    if (filter === "ALL") return list;
    return list.filter((c) => c?.status === filter);
  }, [coursesRes, filter]);

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
    filteredCourses,
  };
};

export default useContainer;
