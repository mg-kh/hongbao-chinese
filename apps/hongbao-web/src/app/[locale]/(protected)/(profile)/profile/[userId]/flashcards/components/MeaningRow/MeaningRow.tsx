import { langTag } from "@/app/[locale]/(protected)/(profile)/profile/[userId]/flashcards/langTag";
import { splitSenses } from "@/app/[locale]/(protected)/(profile)/profile/[userId]/flashcards/senses";
import { Text } from "@mantine/core";
import React from "react";

interface Props {
  /** Language indicator shown in the left column, e.g. "EN" / "MM". */
  tag: string;
  meaning: string;
  /** BCP-47 language of the meaning text, for correct font shaping / screen readers. */
  lang?: string;
}

const meaningText = "text-[20px]! font-normal! leading-normal! text-gray-900!";

/**
 * One language's meaning: tag column + text. A gloss with several senses
 * ("to be; yes") becomes a numbered list so each sense can be scanned on its own.
 */
const MeaningRow: React.FC<Props> = ({ tag, meaning, lang }) => {
  const senses = splitSenses(meaning);

  return (
    <div className="flex! items-start! gap-3! py-3! first:pt-0! last:pb-0!">
      <span className={`mt-[0.45em]! ${langTag}`}>{tag}</span>
      {senses.length > 1 ? (
        <ol className="flex! min-w-0! flex-1! flex-col! gap-1!">
          {senses.map((sense, i) => (
            <li key={i} className="flex! items-baseline! gap-2!">
              <span className="w-4! shrink-0! text-sm! font-semibold! tabular-nums! text-gray-400!">
                {i + 1}.
              </span>
              <Text lang={lang} className={meaningText}>
                {sense}
              </Text>
            </li>
          ))}
        </ol>
      ) : (
        <Text lang={lang} className={`min-w-0! flex-1! ${meaningText}`}>
          {senses[0] ?? meaning}
        </Text>
      )}
    </div>
  );
};

export default MeaningRow;
