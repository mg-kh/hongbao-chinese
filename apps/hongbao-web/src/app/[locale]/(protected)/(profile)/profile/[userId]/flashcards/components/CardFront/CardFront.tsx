import SpeakButton from "@/app/[locale]/(protected)/(profile)/profile/[userId]/flashcards/components/SpeakButton/SpeakButton";
import ToneWord from "@/app/[locale]/(protected)/(profile)/profile/[userId]/flashcards/components/ToneWord/ToneWord";
import useContainer from "@/app/[locale]/(protected)/(profile)/profile/[userId]/flashcards/components/CardFront/useContainer";
import type { TCard } from "@/hooks/global-data-fetching/useMyFlashcards";
import { Badge, Paper } from "@mantine/core";
import { HandTapIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import React from "react";

interface Props {
  card: TCard;
  onReveal: () => void;
}

/**
 * Prompt side: just the characters, so the learner recalls the meaning before
 * seeing it. Tapping anywhere reveals the answer; the pinyin is blurred and
 * can be peeked on its own (its button stops the tap reaching the card), as
 * can the audio. Characters are NOT tone-colored here - that gives tones away.
 */
const CardFront: React.FC<Props> = ({ card, onReveal }) => {
  const { typeLabel, showPinyin, revealPinyin } = useContainer(card);
  const t = useTranslations("Profile.Flashcards.CardFront");

  return (
    <div className="flex! h-full! flex-col! p-3! [animation:fade-up_0.28s_ease-out_both] sm:p-5!">
      {/* a div, not a <button>: it holds the audio and pinyin buttons */}
      <Paper
        role="button"
        tabIndex={0}
        aria-label={t("reveal_answer")}
        onClick={onReveal}
        onKeyDown={(e) => {
          if (e.target !== e.currentTarget) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onReveal();
          }
        }}
        className="group! flex! min-h-0! flex-1! cursor-pointer! flex-col! rounded-xl! border! border-gray-100! bg-surface! transition-[border-color,box-shadow]! duration-200! hover:border-hongbao-red-200! hover:shadow-sm! focus-visible:outline-2! focus-visible:outline-offset-2! focus-visible:outline-hongbao-red-500!"
      >
        {/* top row: word type · audio */}
        <div className="flex! items-center! justify-between! gap-2! p-4! sm:p-5!">
          {typeLabel ? (
            <Badge
              size="xs"
              radius="sm"
              variant="light"
              color="hongbao-red"
              tt="lowercase"
            >
              {typeLabel}
            </Badge>
          ) : (
            <span />
          )}
          <SpeakButton text={card.cnWord} />
        </div>

        {/* the prompt */}
        <div className="flex! flex-1! flex-col! items-center! justify-center! gap-4! px-6!">
          <span
            lang="zh"
            className="text-center! text-[clamp(3.5rem,16vw,6rem)]! font-bold! leading-none! tracking-tight! text-gray-900!"
          >
            {card.cnWord}
          </span>
          {card.pinyin && (
            <ToneWord
              word={card.cnWord}
              pinyin={card.pinyin}
              show="pinyin"
              hidePinyin={!showPinyin}
              onRevealPinyin={revealPinyin}
              pinyinClassName="text-xl! font-medium! text-gray-500! sm:text-2xl!"
            />
          )}
          {card.pinyin && !showPinyin && (
            <span className="-mt-2! text-xs! text-gray-400!">
              {t("peek_pinyin")}
            </span>
          )}
        </div>

        {/* hint */}
        <div className="flex! items-center! justify-center! gap-1.5! p-5! text-gray-400! transition-colors! duration-200! group-hover:text-hongbao-red-500! dark:group-hover:text-night-red!">
          <HandTapIcon size={14} weight="fill" />
          <span className="text-[11px]! font-bold! uppercase! tracking-[0.12em]!">
            {t("tap_to_reveal")}
          </span>
        </div>
      </Paper>
    </div>
  );
};

export default CardFront;
