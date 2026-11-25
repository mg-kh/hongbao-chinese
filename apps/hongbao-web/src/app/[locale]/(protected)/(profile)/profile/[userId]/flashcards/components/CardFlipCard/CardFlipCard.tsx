import HanziPractice from "@/components/HanziPractice/HanziPractice";
import type { TCard } from "@/hooks/global-data-fetching/useAllCardList";
import { Text } from "@mantine/core";
import { HandTapIcon } from "@phosphor-icons/react";
import SpeakButton from "../SpeakButton/SpeakButton";

interface Props {
  card: TCard;
  flipped: boolean;
  showPinyin: boolean;
  onFlip: () => void;
  onRevealPinyin: () => void;
}

/** Human-readable labels for the short word-type codes coming from the API. */
const wordTypeLabels: Record<string, string> = {
  n: "noun",
  v: "verb",
  adj: "adjective",
  adv: "adverb",
  pron: "pronoun",
  num: "numeral",
  m: "measure word",
  prep: "preposition",
  conj: "conjunction",
  part: "particle",
  interj: "interjection",
};

/** Big study card shown inside the dialog - front holds the prompt, the meaning
 * and examples are revealed on top of it with a cross-fade (no 3D flip, so the
 * back's scroll area works on mobile). */
const CardFlipCard: React.FC<Props> = ({
  card,
  flipped,
  showPinyin,
  onFlip,
  onRevealPinyin,
}) => {
  const examples = card.exampleUsage ?? [];
  const typeLabel = card.type
    ? (wordTypeLabels[card.type.toLowerCase()] ?? card.type)
    : null;

  return (
    <div className="mx-auto! my-auto! w-full! max-w-[420px]! sm:max-w-none!">
      <div className="relative! h-[62vh]! max-h-[540px]! min-h-[360px]! w-full! sm:h-auto! sm:max-h-none! sm:min-h-0! sm:aspect-[16/10]!">
        <div className="relative! h-full! w-full!">
          {/* ---------------- FRONT (prompt) ---------------- */}
          <div
            role="button"
            tabIndex={-1}
            aria-label="Reveal the meaning"
            aria-hidden={flipped}
            onClick={onFlip}
            className={`absolute! inset-0! flex! cursor-pointer! flex-col! overflow-hidden! rounded-[28px]! bg-hongbao-cream-50! transition-opacity! duration-300! ease-out! ${
              flipped ? "pointer-events-none! opacity-0!" : "opacity-100!"
            }`}
          >
            {/* metadata zone */}
            <div className="flex! items-start! justify-between! gap-2! px-5! pt-5!">
              <div className="flex! flex-wrap! items-center! gap-1.5!">
                {card.flashcard?.category?.name && (
                  <span className="inline-flex! items-center! rounded-full! bg-hongbao-red-50! px-2.5! py-1! text-[11px]! font-bold! uppercase! tracking-[0.08em]! text-hongbao-red-600!">
                    {card.flashcard.category.name}
                  </span>
                )}
                {typeLabel && (
                  <span className="inline-flex! items-center! rounded-full! bg-gray-100! px-2.5! py-1! text-[11px]! font-semibold! lowercase! tracking-wide! text-gray-500!">
                    {typeLabel}
                  </span>
                )}
              </div>
              <SpeakButton text={card.cnWord} />
            </div>

            {/* prompt zone */}
            <div className="flex! flex-1! flex-col! items-center! justify-center! gap-3! px-6! py-3!">
              <Text
                lang="zh"
                className="text-center! text-[clamp(2.75rem,13vw,5rem)]! font-bold! leading-none! tracking-tight! text-gray-900!"
              >
                {card.cnWord}
              </Text>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!showPinyin) onRevealPinyin();
                }}
                aria-label={showPinyin ? undefined : "Reveal pinyin"}
                className={`rounded-lg! px-2! py-0.5! text-lg! font-medium! text-gray-500! transition-all! duration-200! sm:text-xl! ${
                  showPinyin
                    ? "cursor-default!"
                    : "cursor-help! select-none! blur-[6px]! hover:blur-[3px]!"
                }`}
              >
                {card.pinyin || " "}
              </button>
            </div>

            {/* hint zone */}
            <div className="flex! items-center! justify-center! gap-1.5! px-5! pb-5! text-gray-400!">
              <HandTapIcon size={13} weight="fill" />
              <span className="text-[11px]! font-semibold! uppercase! tracking-[0.12em]!">
                Tap to reveal
              </span>
            </div>
          </div>

          {/* ---------------- BACK (meaning + examples, revealed) ---------------- */}
          <div
            aria-hidden={!flipped}
            className={`absolute! inset-0! flex! flex-col! overflow-hidden! rounded-[28px]! bg-gradient-to-br! from-hongbao-gold-50! to-hongbao-cream-100! text-hongbao-brown-800! transition-[opacity,transform]! duration-300! ease-out! sm:flex-row! ${
              flipped
                ? "translate-y-0! opacity-100!"
                : "pointer-events-none! translate-y-2! opacity-0!"
            }`}
          >
            {/* practice column - stroke animation + write-to-test canvas */}
            <div className="flex! shrink-0! basis-[54%]! flex-col! border-b! border-hongbao-brown-900/10! bg-white/45! p-4! sm:basis-[44%]! sm:border-r! sm:border-b-0! sm:p-5!">
              <HanziPractice
                key={`practice-${card.cnWord}`}
                text={card.cnWord}
                active={flipped}
              />
            </div>

            {/* meaning + examples column */}
            <div className="flex! min-h-0! min-w-0! flex-1! flex-col!">
              <div className="shrink-0! border-b! border-hongbao-brown-900/10! px-4! pt-4! pb-3! sm:px-5!">
                <div className="flex! items-baseline! gap-2!">
                  <Text
                    lang="zh"
                    className="text-lg! font-bold! text-hongbao-brown-800!"
                  >
                    {card.cnWord}
                  </Text>
                  {card.pinyin && (
                    <span className="text-sm! text-hongbao-brown-800/60!">
                      {card.pinyin}
                    </span>
                  )}
                </div>
                {/* the answer to memorise - warm saturated accent draws the eye
                 * and aids recall (color-as-retrieval-cue) */}
                <Text className="mt-1! text-[clamp(1.25rem,4.5vw,1.875rem)]! font-bold! leading-tight! text-hongbao-red-600!">
                  {card.meaningEn}
                </Text>
                {card.meaningMm && (
                  <Text className="mt-1! text-sm! leading-snug! text-hongbao-brown-800/70!">
                    {card.meaningMm}
                  </Text>
                )}
              </div>

              {examples.length > 0 ? (
                <div className="min-h-0! flex-1! overflow-y-auto! overscroll-contain! p-3! sm:p-4! [scrollbar-width:thin]!">
                  <p className="mb-2! px-1! text-[11px]! font-bold! uppercase! tracking-[0.12em]! text-hongbao-brown-800/50!">
                    {examples.length === 1
                      ? "Example"
                      : `Examples · ${examples.length}`}
                  </p>
                  <div className="flex! flex-col! gap-2!">
                    {examples.map((example, i) => (
                      <div
                        key={i}
                        className="rounded-2xl! border! border-hongbao-brown-900/8! bg-white/60! p-3! text-left!"
                      >
                        <div className="flex! items-start! justify-between! gap-2!">
                          <Text
                            lang="zh"
                            className="text-sm! font-semibold! leading-snug! text-hongbao-brown-800!"
                          >
                            {example.chinese}
                          </Text>
                          <SpeakButton text={example.chinese} />
                        </div>
                        {example.pinyin && (
                          <Text className="mt-1! text-xs! text-hongbao-brown-800/60!">
                            {example.pinyin}
                          </Text>
                        )}
                        <Text className="mt-2! text-xs! leading-snug! text-hongbao-brown-800/90!">
                          {example.meaningEn}
                        </Text>
                        {example.meaningMm && (
                          <Text className="mt-0.5! text-xs! leading-snug! text-hongbao-brown-800/70!">
                            {example.meaningMm}
                          </Text>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex! flex-1! items-center! justify-center! p-6!">
                  <span className="text-center! text-xs! text-hongbao-brown-800/50!">
                    No example sentences yet.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardFlipCard;
