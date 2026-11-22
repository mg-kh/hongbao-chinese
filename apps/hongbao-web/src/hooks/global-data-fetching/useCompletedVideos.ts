import {
  TCompletedProgress,
  useCompletedProgress,
} from "./useCompletedProgress";

/**
 * Tracks which videos a user has finished watching, so the "complete" badge
 * in CourseNavigator lights up correctly. Backed by the `learning-progress/video/completed`
 * endpoint, which returns every completed video id for the current user.
 */
export type TCompletedVideos = TCompletedProgress;

export const completedVideosKey = (userId?: string) => [
  "video-completed",
  userId,
];

export const useCompletedVideos = () => {
  const { isCompleted, ...rest } = useCompletedProgress(
    "learning-progress/video/completed",
    completedVideosKey,
  );
  return { ...rest, isVideoCompleted: isCompleted };
};
