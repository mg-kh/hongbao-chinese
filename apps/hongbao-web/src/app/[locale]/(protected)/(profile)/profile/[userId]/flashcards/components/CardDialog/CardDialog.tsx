"use client";

import CardBack from "@/app/[locale]/(protected)/(profile)/profile/[userId]/flashcards/components/CardBack/CardBack";
import CardFront from "@/app/[locale]/(protected)/(profile)/profile/[userId]/flashcards/components/CardFront/CardFront";
import useContainer from "@/app/[locale]/(protected)/(profile)/profile/[userId]/flashcards/components/CardDialog/useContainer";
import { FlashcardTypeIcon } from "@/components/icons/productTypeIcons";
import type { TCard } from "@/hooks/global-data-fetching/useMyFlashcards";
import { cn } from "@/utils/cn";
import {
  ActionIcon,
  Badge,
  Button,
  Modal,
  Progress,
  Text,
  Tooltip,
} from "@mantine/core";
import {
  ArrowsClockwiseIcon,
  CaretLeftIcon,
  CaretRightIcon,
  CheckIcon,
  EyeIcon,
} from "@phosphor-icons/react";
import React from "react";

interface Props {
  cards: TCard[];
  userId: string;
  deckName?: string;
  /** Index of the open card; `null` closes the dialog. */
  index: number | null;
  onIndexChange: (index: number | null) => void;
}

/** Same quiet round control as the trailing caret on the course card. */
const navButton =
  "shrink-0! rounded-full! border! border-gray-100! bg-gray-50! text-gray-600! transition-colors! duration-200! hover:bg-hongbao-red-500! hover:text-white! hover:border-hongbao-red-500! data-[disabled]:bg-gray-50! data-[disabled]:text-gray-300! data-[disabled]:border-gray-100!";

const ratings = [
  {
    value: "learning",
    label: "Still learning",
    shortcut: "1",
    icon: ArrowsClockwiseIcon,
    idle: "border-hongbao-orange-100! bg-hongbao-orange-50! text-hongbao-orange-700! dark:text-night-orange! hover:border-hongbao-orange-200!",
    active: "border-hongbao-orange-500! bg-hongbao-orange-500! text-white!",
    badge: { label: "Still learning", color: "hongbao-orange" },
  },
  {
    value: "known",
    label: "Got it",
    shortcut: "2",
    icon: CheckIcon,
    idle: "border-green-100! bg-green-50! text-green-700! dark:text-night-green! hover:border-green-300!",
    active: "border-green-600! bg-green-600! text-white!",
    badge: { label: "Known", color: "green" },
  },
] as const;

/**
 * Card detail dialog in the same visual language as the profile course
 * cards: white surface, gray-100 hairlines, 12px radii, a tinted type tile,
 * small chips. Header (deck + position + rating chip), the card in a
 * scrolling body, and a bottom bar. Each card opens on its front (tap to
 * reveal); the bar shows "Show answer" until then, and the two self-ratings
 * after: prev · Still learning · Got it · next.
 */
const CardDialog: React.FC<Props> = (props) => {
  const {
    isMobile,
    isOpen,
    card,
    position,
    total,
    progress,
    prevCard,
    nextCard,
    rating,
    revealed,
    reveal,
    close,
    goPrev,
    goNext,
    rate,
  } = useContainer(props);

  const ratingBadge = ratings.find((r) => r.value === rating)?.badge;

  return (
    <Modal.Root
      opened={isOpen}
      onClose={close}
      centered
      size={680}
      padding={0}
      radius={isMobile ? 0 : 16}
      fullScreen={isMobile}
      trapFocus
      returnFocus
      closeOnEscape
      transitionProps={{ transition: "pop", duration: 180 }}
      // Styled through `classNames` / `styles` on purpose: a className or
      // style on <Modal.Content> is ALSO applied by Mantine to the
      // full-viewport `.mantine-Modal-inner` wrapper, which would paint
      // over the overlay and break centering.
      classNames={{
        content:
          "flex! flex-col! overflow-hidden! border! border-gray-100! bg-gray-50! shadow-xl!",
      }}
      styles={{
        // fill the inner on desktop - Mantine's own max height (viewport
        // minus its y-offset gutters), so the dialog doesn't jump in size
        // between short and long cards. Mobile is already fullScreen.
        content: isMobile
          ? undefined
          : ({
              "--modal-content-height":
                "calc(100dvh - var(--modal-y-offset) * 2)",
            } as React.CSSProperties),
      }}
    >
      <Modal.Overlay />
      <Modal.Content>
        {/* header - mirrors the course card row: type tile · chips + title */}
        <Modal.Header className="flex! min-h-0! items-center! gap-3! border-b! border-gray-100! bg-surface! px-4! py-3! sm:px-5!">
          <span className="flex! h-10! w-10! shrink-0! items-center! justify-center! rounded-xl! bg-hongbao-orange-50! text-hongbao-orange-600! dark:text-night-orange!">
            <FlashcardTypeIcon size={20} weight="duotone" />
          </span>

          <Modal.Title className="min-w-0! flex-1! space-y-0.5!">
            <span className="flex! flex-wrap! items-center! gap-1!">
              <Badge
                size="xs"
                radius="sm"
                variant="light"
                color="hongbao-orange"
                className="tabular-nums!"
              >
                Card {position} / {total}
              </Badge>
              {ratingBadge && (
                <Badge
                  size="xs"
                  radius="sm"
                  variant="dot"
                  color={ratingBadge.color}
                >
                  {ratingBadge.label}
                </Badge>
              )}
            </span>
            <Text
              size="sm"
              fw={700}
              c="var(--hb-text)"
              lineClamp={1}
              className="leading-snug!"
            >
              {props.deckName ?? "Flashcards"}
            </Text>
          </Modal.Title>

          <Modal.CloseButton
            size={32}
            radius="xl"
            aria-label="Close card"
            className="ms-0! shrink-0! bg-gray-50! text-gray-500! hover:bg-gray-100! hover:text-gray-800!"
          />
        </Modal.Header>

        <Progress
          value={progress}
          size={3}
          radius={0}
          color="hongbao-red"
          transitionDuration={250}
          aria-label={`Card ${position} of ${total}`}
          className="shrink-0! bg-gray-100!"
        />

        <Modal.Body className="flex! min-h-0! flex-1! flex-col!">
          {/* the card - front until revealed, then the answer (CardBack is the
           * only scroll area). Takes initial focus
           * so keyboard shortcuts work straight away with no stray ring */}
          <div
            data-autofocus
            tabIndex={-1}
            className="flex! min-h-0! flex-1! flex-col! outline-none! *:min-h-0! *:flex-1!"
          >
            {card &&
              (revealed ? (
                <CardBack key={card.id} card={card} />
              ) : (
                <CardFront key={card.id} card={card} onReveal={reveal} />
              ))}
          </div>

          {/* bottom bar: prev · (show answer | rating) · next */}
          <nav
            aria-label="Card navigation"
            className="flex! shrink-0! items-center! gap-2! border-t! border-gray-100! bg-surface! px-4! pt-3! pb-[calc(0.75rem+env(safe-area-inset-bottom))]! sm:gap-3! sm:px-5! sm:pb-3!"
          >
            <Tooltip
              label={prevCard ? `Previous: ${prevCard.cnWord}` : "First card"}
              withArrow
            >
              <ActionIcon
                size={44}
                aria-label="Previous card"
                aria-keyshortcuts="ArrowLeft"
                disabled={!prevCard}
                onClick={goPrev}
                className={navButton}
              >
                <CaretLeftIcon size={16} weight="bold" />
              </ActionIcon>
            </Tooltip>

            {!revealed ? (
              <Button
                h={44}
                radius="md"
                color="hongbao-red"
                aria-keyshortcuts="Space"
                onClick={reveal}
                leftSection={<EyeIcon size={16} weight="bold" />}
                className="min-w-0! flex-1! text-sm! font-semibold! transition-transform! duration-150! active:scale-[0.98]!"
              >
                Show answer
              </Button>
            ) : (
              <div className="grid min-w-0 flex-1 grid-cols-2 gap-2 [animation:fade-up_0.2s_ease-out_both]">
                {ratings.map((b) => {
                  const selected = rating === b.value;
                  const Icon = selected ? CheckIcon : b.icon;
                  return (
                    <Button
                      key={b.value}
                      h={44}
                      radius="md"
                      aria-pressed={selected}
                      aria-keyshortcuts={b.shortcut}
                      onClick={() => rate(b.value)}
                      leftSection={<Icon size={16} weight="bold" />}
                      classNames={{
                        section: "hidden! sm:flex!",
                        label: "truncate!",
                      }}
                      className={cn(
                        "min-w-0! border! px-3! text-sm! font-semibold! transition-[background-color,border-color,color,transform]! duration-150! active:scale-[0.98]!",
                        selected ? b.active : b.idle,
                      )}
                    >
                      {b.label}
                    </Button>
                  );
                })}
              </div>
            )}

            <Tooltip
              label={nextCard ? `Next: ${nextCard.cnWord}` : "Last card"}
              withArrow
            >
              <ActionIcon
                size={44}
                aria-label="Next card"
                aria-keyshortcuts="ArrowRight"
                disabled={!nextCard}
                onClick={goNext}
                className={navButton}
              >
                <CaretRightIcon size={16} weight="bold" />
              </ActionIcon>
            </Tooltip>
          </nav>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export default CardDialog;
