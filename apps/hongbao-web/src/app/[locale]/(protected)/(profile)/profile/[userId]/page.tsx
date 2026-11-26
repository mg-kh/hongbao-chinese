"use client";

import QuizIcon from "@/components/icons/QuizIcon";
import useMyFlashcards from "@/hooks/global-data-fetching/useMyFlashcards";
import { useCompletedQuizzes } from "@/hooks/global-data-fetching/useCompletedQuizzes";
import { useCompletedVideos } from "@/hooks/global-data-fetching/useCompletedVideos";
import useMyCourses from "@/hooks/global-data-fetching/useMyCourses";
import { Group, Stack, Text } from "@mantine/core";
import {
  CourseTypeIcon,
  FlashcardTypeIcon,
} from "@/components/icons/productTypeIcons";
import {
  BrainIcon,
  CalendarXIcon,
  CheckCircleIcon,
  ClockIcon,
  PlayCircleIcon,
} from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import StatTile from "./components/StatTile/StatTile";
import UserInfo from "./components/UserInfo/UserInfo";
import { loadLearnedIds } from "./flashcards/learned";
import { starterDeck as memoDeck } from "./memo-space/deck";
import { loadProgress as loadMemoProgress } from "./memo-space/srs";

/** Small heading that groups a row of related tiles. */
const StatGroupLabel: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <Text
    size="11px"
    fw={700}
    c="gray.5"
    className="uppercase! tracking-[0.12em]!"
  >
    {children}
  </Text>
);

const Profile = () => {
  const t = useTranslations("Profile.Overview");
  const { userId } = useParams();
  const uid = String(userId);
  const { completedCount } = useCompletedVideos();
  const { completedCount: answeredQuizCount } = useCompletedQuizzes();
  const { stats } = useMyCourses();
  const { cards } = useMyFlashcards();

  // Flashcards/Memo Space progress is tracked client-side (no backend
  // endpoint yet), so it's read from localStorage after mount - starts at 0
  // to stay hydration-safe, then fills in once the browser can read it.
  const [learnedIds, setLearnedIds] = useState<string[]>([]);
  const [dueCount, setDueCount] = useState(0);

  useEffect(() => {
    if (!userId) return;
    setLearnedIds(loadLearnedIds(uid));

    const progress = loadMemoProgress(uid);
    const now = Date.now();
    const due = memoDeck.filter(
      (c) => !progress[c.id] || progress[c.id].dueAt <= now,
    ).length;
    setDueCount(due);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const totalCards = cards.length;
  // only count cards from decks the user is still enrolled in.
  const learnedSet = new Set(learnedIds);
  const learnedCount = cards.filter((c) => learnedSet.has(c.id)).length;
  const learnedPct = totalCards
    ? Math.round((learnedCount / totalCards) * 100)
    : 0;

  return (
    <Stack gap={28} className="flex-1! pb-12! sm:pb-16!">
      {/* identity */}
      <UserInfo />

      {/* enrolment - the full course list lives on its own "My courses"
          page; these are the headline numbers for it. */}
      <Stack gap={10}>
        <Group justify="space-between" align="center" gap={8}>
          <StatGroupLabel>{t("my_courses")}</StatGroupLabel>
          <Text
            component={Link}
            href={`/profile/${userId}/my-courses`}
            size="xs"
            fw={600}
            c="var(--hb-accent-text)"
            className="no-underline! hover:underline!"
          >
            {t("view_all")}
          </Text>
        </Group>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatTile
            layout="graphic"
            icon={<CourseTypeIcon size={18} weight="fill" />}
            value={stats.total}
            label={t("enrolled")}
            tone={stats.total > 0 ? "brand" : "neutral"}
          />
          <StatTile
            layout="graphic"
            icon={<PlayCircleIcon size={18} weight="fill" />}
            value={stats.active}
            label={t("in_progress")}
            tone={stats.active > 0 ? "brand" : "neutral"}
          />
          <StatTile
            layout="graphic"
            icon={<ClockIcon size={18} weight="fill" />}
            value={stats.pending}
            label={t("pending_approval")}
            tone={stats.pending > 0 ? "attention" : "neutral"}
          />
          <StatTile
            layout="graphic"
            icon={<CalendarXIcon size={18} weight="fill" />}
            value={stats.expired}
            label={t("expired")}
            tone={stats.expired > 0 ? "attention" : "neutral"}
          />
        </div>
      </Stack>

      {/* activity */}
      <Stack gap={10}>
        <StatGroupLabel>{t("learning_activity")}</StatGroupLabel>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatTile
            icon={<CheckCircleIcon size={18} weight="fill" />}
            value={completedCount}
            label={t("videos_completed")}
            caption={
              completedCount > 0
                ? t("videos_caption")
                : t("videos_caption_empty")
            }
            tone={completedCount > 0 ? "success" : "neutral"}
          />
          <StatTile
            icon={<QuizIcon width={18} height={18} />}
            value={answeredQuizCount}
            label={t("quizzes_answered")}
            caption={
              answeredQuizCount > 0
                ? t("quizzes_caption")
                : t("quizzes_caption_empty")
            }
            tone={answeredQuizCount > 0 ? "success" : "neutral"}
          />
          <StatTile
            icon={<FlashcardTypeIcon size={18} weight="fill" />}
            value={`${learnedCount}/${totalCards}`}
            label={t("flashcards_learned")}
            caption={t("flashcards_caption", { pct: learnedPct })}
            progress={learnedPct}
            tone={learnedCount > 0 ? "brand" : "neutral"}
          />
          <StatTile
            icon={<BrainIcon size={18} weight="fill" />}
            value={dueCount}
            label={t("due_for_review")}
            caption={dueCount > 0 ? t("due_caption") : t("due_caption_empty")}
            tone={dueCount > 0 ? "attention" : "success"}
          />
        </div>
      </Stack>
    </Stack>
  );
};

export default Profile;
