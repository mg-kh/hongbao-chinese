import { learningActivityKey } from "@/hooks/global-data-fetching/useLearningActivity";
import useApiQuery from "@/hooks/fetching/useApiQuery";
import useMutationQuery from "@/hooks/fetching/useMutationQuery";
import { addCompletedToCache } from "@/hooks/global-data-fetching/useCompletedProgress";
import {
  completedVideosKey,
  useCompletedVideos,
} from "@/hooks/global-data-fetching/useCompletedVideos";
import useLearnCourseDetail from "@/hooks/global-data-fetching/useLearnCourseDetail";
import { flattenCourseItems, TCourseItem } from "@/utils/flattenCourseItems";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TVideo } from "./types/video.type";

/** Video is considered "watched" once playback passes this fraction. */
const COMPLETE_THRESHOLD = 0.9;

/** Lesson content rarely changes; keep it cached so prev/next back-and-forth
 * doesn't refetch the same video. */
const VIDEO_STALE_TIME = 5 * 60 * 1000;

const selectVideo = (data: { data: TVideo }) => data?.data;

const useContainer = () => {
  const { videoId, courseId, userId } = useParams<{
    videoId: string;
    courseId: string;
    userId: string;
  }>();
  const queryClient = useQueryClient();

  const { data: video, isLoading } = useApiQuery<{ data: TVideo }, TVideo>({
    url: `learning-progress/video/${videoId}`,
    enabled: !!videoId,
    select: selectVideo,
    staleTime: VIDEO_STALE_TIME,
  });

  const { courseDetail } = useLearnCourseDetail();

  // ---------- completion tracking ----------
  const [playerDuration, setPlayerDuration] = useState<number | null>(null);
  const [showCompleteOverlay, setShowCompleteOverlay] = useState(false);
  const hasTriggeredRef = useRef(false);

  const { isVideoCompleted } = useCompletedVideos();
  const isCompleted = isVideoCompleted(videoId);

  // The course detail carries no completion state, so only the completed
  // list changes - patched in place rather than refetched.
  const { mutate: markVideoComplete, isPending: isMarkingComplete } =
    useMutationQuery({
      url: `learning-progress/video/${videoId}/complete`,
      onSuccess: () => {
        addCompletedToCache(queryClient, completedVideosKey(userId), videoId);
        // Marked stale; refetched next time the profile streak mounts.
        queryClient.invalidateQueries({
          queryKey: learningActivityKey(userId),
        });
      },
    });

  // Refs let the player callbacks below stay referentially stable while
  // still reading the latest values (timeupdate fires several times a second).
  const duration = video?.duration || playerDuration;
  const latest = useRef({ duration, isCompleted, markVideoComplete });
  useEffect(() => {
    latest.current = { duration, isCompleted, markVideoComplete };
  }, [duration, isCompleted, markVideoComplete]);

  const triggerComplete = useCallback(() => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;
    // Rewatching an already-completed video still shows the checkpoint, but
    // doesn't hit the API again.
    if (!latest.current.isCompleted) latest.current.markVideoComplete({});
    setShowCompleteOverlay(true);
  }, []);

  const handleTimeUpdate = useCallback(
    (detail: { currentTime: number }) => {
      const { duration } = latest.current;
      if (!duration || hasTriggeredRef.current) return;
      if (detail.currentTime / duration >= COMPLETE_THRESHOLD) {
        triggerComplete();
      }
    },
    [triggerComplete],
  );

  const handleDurationChange = useCallback((duration: number) => {
    if (duration > 0) setPlayerDuration(duration);
  }, []);

  const closeCompleteOverlay = useCallback(
    () => setShowCompleteOverlay(false),
    [],
  );

  /** Manual "Mark as complete" - skips the in-player overlay. */
  const handleMarkComplete = () => {
    if (isCompleted || isMarkingComplete) return;
    hasTriggeredRef.current = true;
    markVideoComplete({});
  };

  // ---------- prev / next ----------
  const { prevItem, nextItem } = useMemo(() => {
    const items = flattenCourseItems(courseDetail);
    const i = items.findIndex(
      (item) => item.type === "video" && item.id === videoId,
    );
    return {
      prevItem: i > 0 ? items[i - 1] : undefined,
      nextItem: i >= 0 ? items[i + 1] : undefined,
    };
  }, [courseDetail, videoId]);

  const itemHref = (item?: TCourseItem) =>
    item
      ? `/profile/${userId}/learn/${courseId}/${item.type}/${item.id}`
      : undefined;

  return {
    video,
    isLoading,
    courseTitle: courseDetail?.title,
    courseHref: `/profile/${userId}/learn/${courseId}`,
    myCoursesHref: `/profile/${userId}/my-courses`,
    prevHref: itemHref(prevItem),
    nextHref: itemHref(nextItem),
    nextItem,
    showCompleteOverlay,
    closeCompleteOverlay,
    handleTimeUpdate,
    handleDurationChange,
    handleEnded: triggerComplete,
    isCompleted,
    isMarkingComplete,
    handleMarkComplete,
  };
};

export default useContainer;
