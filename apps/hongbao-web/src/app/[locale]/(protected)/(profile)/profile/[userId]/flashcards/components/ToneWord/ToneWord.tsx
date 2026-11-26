import {
  segmentByTone,
  TONE_CLASS,
} from "@/app/[locale]/(protected)/(profile)/profile/[userId]/flashcards/pinyin";
import React from "react";

interface Props {
  word: string;
  pinyin: string;
  /** Color the characters by tone too (gives the tone away - keep off on the prompt side). */
  colorHanzi?: boolean;
  /** Blur the pinyin until tapped, so the learner can test their pronunciation first. */
  hidePinyin?: boolean;
  onRevealPinyin?: () => void;
  layout?: "stacked" | "inline";
  /** Render only one half - lets a parent place the characters and the pinyin separately. */
  show?: "both" | "hanzi" | "pinyin";
  hanziClassName?: string;
  pinyinClassName?: string;
}

/** Headword + pinyin, tone-colored per syllable when the pinyin can be paired with the characters. */
const ToneWord: React.FC<Props> = ({
  word,
  pinyin,
  colorHanzi = false,
  hidePinyin = false,
  onRevealPinyin,
  layout = "stacked",
  show = "both",
  hanziClassName = "",
  pinyinClassName = "",
}) => {
  const segments = segmentByTone(word, pinyin);

  const hanzi = (
    <span lang="zh" className={hanziClassName}>
      {segments && colorHanzi
        ? segments.map((s, i) => (
            <span key={i} className={TONE_CLASS[s.tone]}>
              {s.hanzi}
            </span>
          ))
        : word}
    </span>
  );

  const pinyinText = segments
    ? segments.map((s, i) => (
        <span key={i} className={TONE_CLASS[s.tone]}>
          {i > 0 && " "}
          {s.pinyin}
        </span>
      ))
    : pinyin;

  const pinyinNode = pinyin ? (
    hidePinyin ? (
      <button
        type="button"
        aria-label="Show pinyin"
        onClick={(e) => {
          e.stopPropagation();
          onRevealPinyin?.();
        }}
        className={`cursor-pointer! select-none! rounded-lg! px-2! blur-[7px]! transition-[filter]! duration-200! hover:blur-[4px]! ${pinyinClassName}`}
      >
        {pinyinText}
      </button>
    ) : (
      <span className={pinyinClassName}>{pinyinText}</span>
    )
  ) : null;

  if (show === "hanzi") return hanzi;
  if (show === "pinyin") return pinyinNode;

  return layout === "inline" ? (
    <span className="inline-flex! flex-wrap! items-baseline! gap-x-3! gap-y-1!">
      {hanzi}
      {pinyinNode}
    </span>
  ) : (
    <span className="flex! flex-col! items-center! gap-3!">
      {hanzi}
      {pinyinNode}
    </span>
  );
};

export default ToneWord;
