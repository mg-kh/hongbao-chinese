import useProfile from "@/hooks/global-data-fetching/useProfile";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export type TRole = "ADMIN" | "TEACHER" | "STAFF" | "STUDENT";

const useContainer = () => {
  const { data: user, isLoading } = useProfile();
  const { userId } = useParams();

  const role = (user?.role as TRole) || "STUDENT";

  const joinedLabel = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : null;

  // Date.now() is impure, so the "days learning" count is computed after
  // mount rather than during render.
  const [daysSinceJoin, setDaysSinceJoin] = useState<number | null>(null);
  useEffect(() => {
    if (!user?.createdAt) return;
    const joined = new Date(user.createdAt).getTime();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDaysSinceJoin(
      Math.max(0, Math.floor((Date.now() - joined) / (1000 * 60 * 60 * 24))),
    );
  }, [user?.createdAt]);

  return {
    user,
    isLoading,
    role,
    joinedLabel,
    daysSinceJoin,
    settingsHref: `/profile/${userId}/settings`,
  };
};

export default useContainer;
