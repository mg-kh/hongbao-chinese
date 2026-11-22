"use client";

import { pluralize } from "@/utils/pluralize";
import { Box, Paper, Progress, Stack, Text } from "@mantine/core";
import {
  ArrowLeftIcon,
  ArrowsClockwiseIcon,
  CheckCircleIcon,
  FlameIcon,
  TrophyIcon,
  XCircleIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { starterDeck } from "./deck";
import {
  type CardProgress,
  type Rating,
  formatInterval,
  initialProgress,
  loadProgress,
  nextInterval,
  saveProgress,
  schedule,
} from "./srs";

type RatingButton = {
  rating: Rating;
  label: string;
  icon: React.ReactNode;
  color: string;
  className: string;
};

const ratingButtons: RatingButton[] = [
  {
    rating: "again",
    label: "Again",
    icon: <XCircleIcon size={16} weight="fill" />,
    color: "red",
    className: "bg-red-50! text-red-700! hover:bg-red-100!",
  },
  {
    rating: "hard",
    label: "Hard",
    icon: <FlameIcon size={16} weight="fill" />,
    color: "orange",
    className:
      "bg-hongbao-orange-50! text-hongbao-orange-700! hover:bg-hongbao-orange-100!",
  },
  {
    rating: "good",
    label: "Good",
    icon: <CheckCircleIcon size={16} weight="fill" />,
    color: "gold",
    className:
      "bg-hongbao-gold-50! text-hongbao-gold-800! hover:bg-hongbao-gold-100!",
  },
  {
    rating: "easy",
    label: "Easy",
    icon: <TrophyIcon size={16} weight="fill" />,
    color: "green",
    className: "bg-green-50! text-green-700! hover:bg-green-100!",
  },
];

const emptyStats: Record<Rating, number> = {
  again: 0,
  hard: 0,
  good: 0,
  easy: 0,
};

type Session = {
  hydrated: boolean;
  progressMap: Record<string, CardProgress>;
  queue: string[];
  totalDue: number;
};

const SpacedRepetitionPage = () => {
  const { userId } = useParams();
  const uid = String(userId);

  const [session, setSession] = useState<Session>({
    hydrated: false,
    progressMap: {},
    queue: [],
    totalDue: 0,
  });
  const { hydrated, progressMap, queue, totalDue } = session;
  const [flipped, setFlipped] = useState(false);
  const [stats, setStats] = useState(emptyStats);
  const cardById = useMemo(
    () => Object.fromEntries(starterDeck.map((c) => [c.id, c])),
    [],
  );

  // Hydrate from localStorage once on mount, in a single state write, so the
  // server-rendered pass and first client paint stay in sync (see `!hydrated`
  // guard in the JSX below) before this syncs in the device's saved review
  // progress - a legitimate "sync with an external system" effect.
  useEffect(() => {
    const stored = loadProgress(uid);
    const now = Date.now();
    const due = starterDeck
      .filter((c) => !stored[c.id] || stored[c.id].dueAt <= now)
      .map((c) => c.id);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSession({
      hydrated: true,
      progressMap: stored,
      queue: due,
      totalDue: due.length,
    });
  }, [uid]);

  const currentCard = queue.length ? cardById[queue[0]] : null;
  const currentProgress = currentCard
    ? (progressMap[currentCard.id] ?? initialProgress())
    : null;

  const completedCount = totalDue - new Set(queue).size;

  const handleFlip = () => setFlipped((f) => !f);

  const handleRate = (rating: Rating) => {
    if (!currentCard || !currentProgress) return;

    const updated = schedule(currentProgress, rating);
    const newMap = { ...progressMap, [currentCard.id]: updated };
    saveProgress(uid, newMap);
    setStats((s) => ({ ...s, [rating]: s[rating] + 1 }));
    setFlipped(false);

    setSession((s) => {
      const [current, ...rest] = s.queue;
      const nextQueue =
        rating === "again"
          ? [
              ...rest.slice(0, Math.min(rest.length, 3)),
              current,
              ...rest.slice(Math.min(rest.length, 3)),
            ]
          : rest;
      return { ...s, progressMap: newMap, queue: nextQueue };
    });
  };

  const handlePracticeAgain = () => {
    const all = starterDeck.map((c) => c.id);
    setSession((s) => ({ ...s, queue: all, totalDue: all.length }));
    setStats(emptyStats);
    setFlipped(false);
  };

  // keyboard shortcuts: space/enter to flip, 1-4 to rate once flipped
  const handleRateRef = useRef(handleRate);
  useEffect(() => {
    handleRateRef.current = handleRate;
  });
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!currentCard) return;
      if (!flipped && (e.code === "Space" || e.code === "Enter")) {
        e.preventDefault();
        setFlipped(true);
        return;
      }
      if (flipped) {
        const idx = ["1", "2", "3", "4"].indexOf(e.key);
        if (idx !== -1) {
          e.preventDefault();
          handleRateRef.current(ratingButtons[idx].rating);
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [flipped, currentCard]);

  const reviewedThisSession =
    stats.again + stats.hard + stats.good + stats.easy;
  const percent = totalDue > 0 ? (completedCount / totalDue) * 100 : 0;

  return (
    <Stack gap={20} className="flex-1!">
      <Link
        href={`/profile/${uid}`}
        className="flex! items-center! gap-1.5! w-fit! no-underline! text-gray-500! hover:text-hongbao-red-600! transition-colors! duration-200!"
      >
        <ArrowLeftIcon size={14} weight="bold" />
        <Text size="xs" fw={600}>
          Back to profile
        </Text>
      </Link>

      <Stack gap={4}>
        <Text size="xl" fw={"bold"} c={"hongbao-red"}>
          Memo Space
        </Text>
        <Text size="sm" c="gray.6">
          Flip each card, then rate how well you knew it. Practicing the HSK 1
          starter deck.
        </Text>
      </Stack>

      {!hydrated ? null : currentCard && currentProgress ? (
        <Stack gap={20} align="center" className="w-full!">
          {/* progress */}
          <Stack gap={6} className="w-full! max-w-md!">
            <div className="flex! items-center! justify-between!">
              <Text size="xs" c="gray.6" fw={600}>
                {completedCount} of {totalDue} reviewed
              </Text>
              {reviewedThisSession > 0 && (
                <Text size="xs" c="gray.5">
                  {stats.again} again · {stats.good + stats.easy} good+
                </Text>
              )}
            </div>
            <Progress value={percent} size="sm" radius="xl" color="hongbao-red" />
          </Stack>

          {/* flip card */}
          <div
            className="relative! w-full! max-w-md! aspect-[4/3]! [perspective:1400px]! cursor-pointer!"
            onClick={!flipped ? handleFlip : undefined}
          >
            <div
              className="relative! w-full! h-full! transition-transform! duration-500! ease-out! [transform-style:preserve-3d]!"
              style={{ transform: flipped ? "rotateY(180deg)" : "none" }}
            >
              {/* front */}
              <Paper
                withBorder
                bdrs={28}
                className="absolute! inset-0! [backface-visibility:hidden]! flex! flex-col! items-center! justify-center! gap-4! border-gray-200! bg-white! shadow-sm!"
              >
                <Text className="text-6xl! sm:text-7xl! font-bold! text-gray-900!">
                  {currentCard.hanzi}
                </Text>
                <Text size="xl" c="gray.5">
                  {currentCard.pinyin}
                </Text>
                <Text
                  size="xs"
                  c="gray.4"
                  className="absolute! bottom-5! uppercase! tracking-[0.14em]!"
                >
                  Tap to reveal
                </Text>
              </Paper>

              {/* back */}
              <Paper
                bdrs={28}
                className="absolute! inset-0! [backface-visibility:hidden]! [transform:rotateY(180deg)]! flex! flex-col! items-center! justify-center! gap-3! p-8! text-center! bg-gradient-to-br! from-hongbao-red-600! to-hongbao-maroon-700! text-white! shadow-md!"
              >
                <Text size="sm" c="white" className="opacity-70!">
                  {currentCard.hanzi} · {currentCard.pinyin}
                </Text>
                <Text c="white" className="text-3xl! sm:text-4xl! font-bold!">
                  {currentCard.meaning}
                </Text>
                {currentCard.example && (
                  <Stack gap={2} className="mt-2! max-w-[85%]!">
                    <Text size="sm" c="white" className="opacity-90!">
                      {currentCard.example}
                    </Text>
                    <Text size="xs" c="white" className="opacity-70!">
                      {currentCard.exampleMeaning}
                    </Text>
                  </Stack>
                )}
              </Paper>
            </div>
          </div>

          {/* actions */}
          {!flipped ? (
            <Text size="xs" c="gray.4">
              Press space to flip
            </Text>
          ) : (
            <div className="grid! grid-cols-2! sm:grid-cols-4! gap-2.5! w-full! max-w-md!">
              {ratingButtons.map((btn, i) => (
                <button
                  key={btn.rating}
                  type="button"
                  onClick={() => handleRate(btn.rating)}
                  className={`flex! flex-col! items-center! gap-1! rounded-2xl! py-3! transition-colors! duration-150! ease-out! cursor-pointer! ${btn.className}`}
                >
                  {btn.icon}
                  <Text size="xs" fw={700}>
                    {btn.label}
                  </Text>
                  <Text size="10px" className="opacity-60!">
                    {formatInterval(nextInterval(currentProgress, btn.rating))}
                    {` · ${i + 1}`}
                  </Text>
                </button>
              ))}
            </div>
          )}
        </Stack>
      ) : (
        <Paper
          withBorder
          bdrs={24}
          p={{ base: 32, sm: 48 }}
          className="border-gray-200! bg-white! text-center!"
        >
          <Stack align="center" gap={10}>
            <Box className="flex! items-center! justify-center! w-16! h-16! rounded-2xl! bg-hongbao-gold-50! text-hongbao-gold-600!">
              <TrophyIcon size={30} weight="fill" />
            </Box>
            <Text fw={700} size="lg">
              All caught up!
            </Text>
            <Text size="sm" c="gray.6" className="max-w-[360px]!">
              {reviewedThisSession > 0
                ? `You reviewed ${pluralize(reviewedThisSession, "card")} this session.`
                : "Nothing is due right now - come back later."}
            </Text>
            <button
              type="button"
              onClick={handlePracticeAgain}
              className="flex! items-center! gap-1.5! mt-3! px-5! py-2.5! rounded-full! bg-hongbao-red-600! text-white! text-sm! font-semibold! cursor-pointer! transition-colors! duration-200! hover:bg-hongbao-red-700!"
            >
              <ArrowsClockwiseIcon size={15} weight="bold" />
              Practice again
            </button>
          </Stack>
        </Paper>
      )}
    </Stack>
  );
};

export default SpacedRepetitionPage;
