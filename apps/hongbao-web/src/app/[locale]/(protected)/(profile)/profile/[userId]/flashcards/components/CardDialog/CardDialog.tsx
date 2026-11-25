"use client";

import type { TCard } from "@/hooks/global-data-fetching/useAllCardList";
import { Modal, Progress } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  ArrowsClockwiseIcon,
  CaretLeftIcon,
  CaretRightIcon,
  CheckCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  FlameIcon,
  TrophyIcon,
  XCircleIcon,
  XIcon,
} from "@phosphor-icons/react";
import { useRef } from "react";
import CardFlipCard from "../CardFlipCard/CardFlipCard";

interface Props {
  card: TCard | null;
  index: number | null;
  total: number;
  flipped: boolean;
  showPinyin: boolean;
  onClose: () => void;
  onFlip: () => void;
  onPrev: () => void;
  onNext: () => void;
  onTogglePinyin: () => void;
}

const SWIPE_THRESHOLD = 56;

/** Self-assessment buttons, styled to match the Memo Space rating row. */
const RATINGS = [
  {
    key: "again",
    label: "Again",
    icon: <XCircleIcon size={16} weight="fill" />,
    className: "bg-red-50! text-red-700! hover:bg-red-100!",
  },
  {
    key: "hard",
    label: "Hard",
    icon: <FlameIcon size={16} weight="fill" />,
    className:
      "bg-hongbao-orange-50! text-hongbao-orange-700! hover:bg-hongbao-orange-100!",
  },
  {
    key: "good",
    label: "Good",
    icon: <CheckCircleIcon size={16} weight="fill" />,
    className:
      "bg-hongbao-gold-50! text-hongbao-gold-800! hover:bg-hongbao-gold-100!",
  },
  {
    key: "easy",
    label: "Easy",
    icon: <TrophyIcon size={16} weight="fill" />,
    className: "bg-green-50! text-green-700! hover:bg-green-100!",
  },
];

const CardDialog: React.FC<Props> = ({
  card,
  index,
  total,
  flipped,
  showPinyin,
  onClose,
  onFlip,
  onPrev,
  onNext,
  onTogglePinyin,
}) => {
  // Tailwind `sm` breakpoint - keep the fullscreen switch in step with the
  // flip card's own responsive layout.
  const isMobile = useMediaQuery("(max-width: 40em)");
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.changedTouches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    // horizontal swipe only - ignore vertical scrolling of the examples list
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy) * 1.5)
      return;
    if (dx < 0) onNext();
    else onPrev();
  };

  const position = index === null ? 0 : index + 1;
  const progress = total > 0 ? (position / total) * 100 : 0;
  const atStart = index === null || index === 0;
  const atEnd = index === null || index === total - 1;

  return (
    <Modal
      opened={card !== null}
      onClose={onClose}
      centered
      withCloseButton={false}
      padding={0}
      radius={isMobile ? 0 : 24}
      size={880}
      fullScreen={isMobile}
      overlayProps={{ backgroundOpacity: 0.55, blur: 4 }}
      transitionProps={{ transition: "pop", duration: 180 }}
      classNames={{ content: "overflow-hidden!" }}
    >
      {card && index !== null && (
        <div className="flex! h-full! flex-col! bg-hongbao-cream-50! sm:max-h-[90vh]!">
          {/* header */}
          <div className="flex! items-center! justify-between! gap-3! px-4! py-3! sm:px-5!">
            <span className="text-sm! font-bold! tabular-nums! text-gray-700!">
              {position}
              <span className="font-semibold! text-gray-400!"> / {total}</span>
            </span>

            <div className="flex! items-center! gap-2!">
              <button
                type="button"
                onClick={onTogglePinyin}
                aria-pressed={showPinyin}
                className="flex! cursor-pointer! items-center! gap-1.5! rounded-full! border! border-gray-200! bg-white! px-3! py-1.5! text-xs! font-semibold! text-gray-600! transition-colors! duration-150! hover:border-hongbao-red-200! hover:text-hongbao-red-600!"
              >
                {showPinyin ? (
                  <EyeSlashIcon size={14} />
                ) : (
                  <EyeIcon size={14} />
                )}
                {showPinyin ? "Hide" : "Show"} pinyin
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex! h-8! w-8! cursor-pointer! items-center! justify-center! rounded-full! text-gray-400! transition-colors! duration-150! hover:bg-gray-200! hover:text-gray-700!"
              >
                <XIcon size={16} weight="bold" />
              </button>
            </div>
          </div>

          <Progress
            value={progress}
            size={3}
            radius={0}
            color="hongbao-red"
            transitionDuration={250}
            className="bg-gray-200!"
          />

          {/* card */}
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="flex! min-h-0! flex-1! items-start! justify-center! overflow-x-hidden! overflow-y-auto! p-4! sm:p-6!"
          >
            <CardFlipCard
              key={index}
              card={card}
              flipped={flipped}
              showPinyin={showPinyin}
              onFlip={onFlip}
              onRevealPinyin={onTogglePinyin}
            />
          </div>

          {/* controls */}
          <div className="flex! flex-col! gap-2.5! border-t! border-gray-200! bg-white! px-4! py-3! sm:px-5!">
            {flipped && (
              <div className="grid! grid-cols-2! gap-2! sm:grid-cols-4!">
                {RATINGS.map((rating) => (
                  <button
                    key={rating.key}
                    type="button"
                    onClick={onNext}
                    className={`flex! cursor-pointer! flex-col! items-center! gap-1! rounded-2xl! py-2.5! transition-colors! duration-150! ${rating.className}`}
                  >
                    {rating.icon}
                    <span className="text-xs! font-bold!">{rating.label}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="flex! items-center! gap-3!">
              <button
                type="button"
                aria-label="Previous card"
                disabled={atStart}
                onClick={onPrev}
                className="flex! h-11! w-11! shrink-0! cursor-pointer! items-center! justify-center! rounded-full! border! border-gray-200! bg-white! text-gray-700! transition-colors! duration-150! hover:border-hongbao-red-300! hover:text-hongbao-red-600! disabled:cursor-not-allowed! disabled:opacity-30! disabled:hover:border-gray-200! disabled:hover:text-gray-700!"
              >
                <CaretLeftIcon size={18} weight="bold" />
              </button>

              <button
                type="button"
                onClick={onFlip}
                className="flex! h-11! flex-1! cursor-pointer! items-center! justify-center! gap-2! rounded-full! bg-hongbao-red-600! text-sm! font-semibold! text-white! transition-colors! duration-150! hover:bg-hongbao-red-700!"
              >
                <ArrowsClockwiseIcon size={16} weight="bold" />
                {flipped ? "Show word" : "Show meaning"}
              </button>

              <button
                type="button"
                aria-label="Next card"
                disabled={atEnd}
                onClick={onNext}
                className="flex! h-11! w-11! shrink-0! cursor-pointer! items-center! justify-center! rounded-full! border! border-gray-200! bg-white! text-gray-700! transition-colors! duration-150! hover:border-hongbao-red-300! hover:text-hongbao-red-600! disabled:cursor-not-allowed! disabled:opacity-30! disabled:hover:border-gray-200! disabled:hover:text-gray-700!"
              >
                <CaretRightIcon size={18} weight="bold" />
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default CardDialog;
