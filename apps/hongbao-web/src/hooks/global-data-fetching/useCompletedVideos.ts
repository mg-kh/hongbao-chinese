import useApiQuery from "@/hooks/fetching/useApiQuery";
import { useParams } from "next/navigation";

/**
 * Tracks which videos a user has finished watching, so the "complete" badge
 * in CourseNavigator lights up correctly. Backed by the `learning-progress/video/completed`
 * endpoint, which returns every completed video id for the current user.
 */
export type TCompletedVideos = {
  count: number;
  ids: string[];
};

export const completedVideosKey = (userId?: string) => [
  "video-completed",
  userId,
];

export const useCompletedVideos = () => {
  const { userId } = useParams();
  const uid = Array.isArray(userId) ? userId[0] : userId;

  const { data, isLoading } = useApiQuery<
    { data: TCompletedVideos },
    TCompletedVideos
  >({
    url: "learning-progress/video/completed",
    key: completedVideosKey(uid),
    enabled: !!uid,
    select: (res) => res?.data,
  });

  const completedIds = data?.ids || [];
  /** Prefer the server's own count - `ids` is only what it chose to send. */
  const completedCount = data?.count ?? completedIds.length;

  const isVideoCompleted = (videoId?: string) =>
    !!videoId && completedIds.includes(videoId);

  return { completedIds, completedCount, isVideoCompleted, isLoading };
};
