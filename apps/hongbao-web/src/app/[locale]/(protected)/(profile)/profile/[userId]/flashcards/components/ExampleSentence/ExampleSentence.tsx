import { langTag } from "@/app/[locale]/(protected)/(profile)/profile/[userId]/flashcards/langTag";
import SpeakButton from "@/app/[locale]/(protected)/(profile)/profile/[userId]/flashcards/components/SpeakButton/SpeakButton";
import { splitHighlight } from "@/app/[locale]/(protected)/(profile)/profile/[userId]/flashcards/highlight";
import type { TCardExampleUsage } from "@/hooks/global-data-fetching/useMyFlashcards";
import { Text } from "@mantine/core";
import React from "react";

interface Props {
  example: TCardExampleUsage;
  /** The card's word - highlighted wherever it appears in the sentence. */
  word: string;
  /** 1-based number shown beside the sentence. */
  number: number;
}

/** One numbered example: Chinese (studied word highlighted) → pinyin → tagged translations. */
const ExampleSentence: React.FC<Props> = ({ example, word, number }) => (
  <li className="flex! gap-3! py-4! first:pt-1! last:pb-1!">
    <span className="mt-0.5! flex! h-6! w-6! shrink-0! items-center! justify-center! rounded-full! bg-hongbao-red-50! text-xs! font-bold! text-hongbao-red-600! dark:text-night-red!">
      {number}
    </span>

    <div className="min-w-0! flex-1!">
      <div className="flex! items-start! justify-between! gap-3!">
        <Text
          lang="zh"
          className="text-[17px]! font-medium! leading-relaxed! text-gray-900!"
        >
          {splitHighlight(example.chinese, word).map((part, i) =>
            part.match ? (
              <mark
                key={i}
                className="rounded-md! bg-hongbao-gold-100! px-0.5! font-bold! text-hongbao-red-700! dark:text-night-red!"
              >
                {part.text}
              </mark>
            ) : (
              <React.Fragment key={i}>{part.text}</React.Fragment>
            ),
          )}
        </Text>
        <SpeakButton text={example.chinese} />
      </div>

      {example.pinyin && (
        <Text className="mt-0.5! text-sm! italic! leading-snug! text-gray-500!">
          {example.pinyin}
        </Text>
      )}

      {(example.meaningEn || example.meaningMm) && (
        <div className="mt-2.5! flex! flex-col! gap-1.5! border-l-2! border-gray-100! pl-3!">
          {example.meaningEn && (
            <div className="flex! items-start! gap-2!">
              <span className={`mt-0.5! ${langTag}`}>EN</span>
              <Text className="text-sm! leading-snug! text-gray-800!">
                {example.meaningEn}
              </Text>
            </div>
          )}
          {example.meaningMm && (
            <div className="flex! items-start! gap-2!">
              <span className={`mt-0.5! ${langTag}`}>MM</span>
              <Text
                lang="my"
                className="text-sm! leading-relaxed! text-gray-600!"
              >
                {example.meaningMm}
              </Text>
            </div>
          )}
        </div>
      )}
    </div>
  </li>
);

export default ExampleSentence;
