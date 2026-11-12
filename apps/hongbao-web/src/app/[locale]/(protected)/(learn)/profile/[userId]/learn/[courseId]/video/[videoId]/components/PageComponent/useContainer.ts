import useApiQuery from "@/hooks/fetching/useApiQuery";
import useMutationQuery from "@/hooks/fetching/useMutationQuery";
import useCourseDetail from "@/hooks/global-data-fetching/useCourseDetail";
import { useParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { completedVideosKey } from "@/hooks/global-data-fetching/useCompletedVideos";
import { TVideo } from "./types/video.type";

type FlatItem = { type: "video" | "quiz"; id: string; title?: string };

/** Video is considered "watched" once playback passes this fraction. */
const COMPLETE_THRESHOLD = 0.9;

const useContainer = () => {
  const { videoId, courseId, userId } = useParams();
  const { data: video, isLoading } = useApiQuery<{ data: TVideo }, TVideo>({
    url: `video/${videoId}`,
    select: (data) => data?.data,
  });

  const { courseDetail } = useCourseDetail();

  // ---------- completion tracking ----------
  const [playerDuration, setPlayerDuration] = useState<number | null>(null);
  const [showCompleteOverlay, setShowCompleteOverlay] = useState(false);
  const hasTriggeredRef = useRef(false);

  const { mutate: markVideoComplete } = useMutationQuery({
    url: `video/${videoId}/complete`,
    invalidateKeys: [
      ["course-detail", courseId],
      completedVideosKey(Array.isArray(userId) ? userId[0] : userId),
    ],
  });

  const triggerComplete = () => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;
    markVideoComplete({});
    setShowCompleteOverlay(true);
  };

  const handleTimeUpdate = (detail: { currentTime: number }) => {
    const duration = video?.duration || playerDuration;
    if (!duration) return;
    if (detail.currentTime / duration >= COMPLETE_THRESHOLD) {
      triggerComplete();
    }
  };

  const handleDurationChange = (duration: number) => {
    if (duration > 0) setPlayerDuration(duration);
  };

  const handleEnded = () => {
    triggerComplete();
  };

  const closeCompleteOverlay = () => setShowCompleteOverlay(false);

  // ---------- prev / next ----------
  /** Flattened, in-order list of every video/quiz in the course - mirrors
   * the order rendered in CourseNavigator so prev/next stays in sync with
   * the sidebar. */
  const flatItems = useMemo<FlatItem[]>(() => {
    const items: FlatItem[] = [];

    courseDetail?.lessons?.forEach((lesson) => {
      lesson?.subLessons?.forEach((sub) => {
        sub?.videos?.forEach((v) =>
          items.push({ type: "video", id: v.id, title: v.title }),
        );
        sub?.quizzes?.forEach((q) =>
          items.push({ type: "quiz", id: q.id, title: q.title }),
        );
      });
      lesson?.quizzes?.forEach((q) =>
        items.push({ type: "quiz", id: q.id, title: q.title }),
      );
    });
    courseDetail?.quizzes?.forEach((q) =>
      items.push({ type: "quiz", id: q.id, title: q.title }),
    );

    return items;
  }, [courseDetail]);

  const currentIndex = useMemo(
    () =>
      flatItems.findIndex(
        (item) => item.type === "video" && item.id === videoId,
      ),
    [flatItems, videoId],
  );

  const prevItem = currentIndex > 0 ? flatItems[currentIndex - 1] : undefined;
  const nextItem =
    currentIndex >= 0 && currentIndex < flatItems.length - 1
      ? flatItems[currentIndex + 1]
      : undefined;

  const itemHref = (item?: FlatItem) => {
    if (!item) return undefined;
    return item.type === "video"
      ? `/profile/${userId}/learn/${courseId}/video/${item.id}`
      : `/profile/${userId}/learn/${courseId}/quiz/${item.id}`;
  };

  return {
    video,
    isLoading,
    courseTitle: courseDetail?.title,
    courseHref: `/profile/${userId}/learn/${courseId}`,
    prevHref: itemHref(prevItem),
    nextHref: itemHref(nextItem),
    nextItem,
    showCompleteOverlay,
    closeCompleteOverlay,
    handleTimeUpdate,
    handleDurationChange,
    handleEnded,
  };
};

export default useContainer;
