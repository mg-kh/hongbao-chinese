import MeaningRow from "@/app/[locale]/(protected)/(profile)/profile/[userId]/flashcards/components/MeaningRow/MeaningRow";
import SectionHeading from "@/app/[locale]/(protected)/(profile)/profile/[userId]/flashcards/components/SectionHeading/SectionHeading";
import ExampleSentence from "@/app/[locale]/(protected)/(profile)/profile/[userId]/flashcards/components/ExampleSentence/ExampleSentence";
import SpeakButton from "@/app/[locale]/(protected)/(profile)/profile/[userId]/flashcards/components/SpeakButton/SpeakButton";
import ToneWord from "@/app/[locale]/(protected)/(profile)/profile/[userId]/flashcards/components/ToneWord/ToneWord";
import { wordTypeLabel } from "@/app/[locale]/(protected)/(profile)/profile/[userId]/flashcards/wordType";
import HanziPractice from "@/components/HanziPractice/HanziPractice";
import type { TCard } from "@/hooks/global-data-fetching/useMyFlashcards";
import { Badge, Tabs, Text } from "@mantine/core";
import {
  BookOpenTextIcon,
  ChatTextIcon,
  ChatsCircleIcon,
  PencilSimpleLineIcon,
  PlayCircleIcon,
  StudentIcon,
  TranslateIcon,
} from "@phosphor-icons/react";
import React from "react";

/** White surface with a hairline border - the same frame as the course card. */
const sectionCard =
  "rounded-xl! border! border-gray-100! bg-white! p-4! sm:p-5!";

interface Props {
  card: TCard;
}

/**
 * Answer side, split into three labelled sections read top-down in order of
 * importance: Word (compare with your guess), Meaning (the answer, given the
 * most weight), and Practice (examples / stroke order / writing, in tabs).
 */
const CardBack: React.FC<Props> = ({ card }) => {
  const examples = card.exampleUsage ?? [];
  const typeLabel = wordTypeLabel(card.type);

  return (
    <div className="flex! h-full! flex-col! [animation:fade-up_0.28s_ease-out_both]">
      <div className="min-h-0! flex-1! space-y-3! overflow-y-auto! overscroll-contain! p-3! [scrollbar-width:thin]! sm:p-5!">
        {/* 1 - the word: compare it with what you recalled */}
        <section className={sectionCard}>
          <SectionHeading
            icon={<BookOpenTextIcon size={14} weight="bold" />}
            title="Word"
          />
          <div className="flex! items-center! gap-4!">
            <div className="flex! min-h-[88px]! min-w-[88px]! shrink-0! items-center! justify-center! rounded-xl! bg-hongbao-red-50/60! px-4! py-3! ring-1! ring-hongbao-red-100!">
              <ToneWord
                word={card.cnWord}
                pinyin={card.pinyin}
                colorHanzi
                show="hanzi"
                hanziClassName="text-5xl! font-bold! leading-none! sm:text-6xl!"
              />
            </div>
            <div className="flex! min-w-0! flex-col! gap-2!">
              <ToneWord
                word={card.cnWord}
                pinyin={card.pinyin}
                show="pinyin"
                pinyinClassName="text-2xl! font-semibold! leading-tight!"
              />
              <div className="flex! flex-wrap! items-center! gap-2!">
                <SpeakButton text={card.cnWord} />
                {typeLabel && (
                  <Badge
                    size="sm"
                    variant="light"
                    color="hongbao-red"
                    radius="sm"
                    tt="lowercase"
                  >
                    {typeLabel}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 2 - the meaning */}
        <section className={sectionCard}>
          <SectionHeading
            icon={<TranslateIcon size={14} weight="bold" />}
            title="Meaning"
          />
          <div className="divide-y! divide-gray-100!">
            <MeaningRow tag="EN" lang="en" meaning={card.meaningEn} />
            {card.meaningMm && (
              <MeaningRow tag="MM" lang="my" meaning={card.meaningMm} />
            )}
          </div>
        </section>

        {/* 3 - practice: examples, stroke order and writing */}
        <section className={sectionCard}>
          <SectionHeading
            icon={<StudentIcon size={14} weight="bold" />}
            title="Practice"
          />
          <Tabs
            defaultValue={examples.length > 0 ? "examples" : "watch"}
            variant="pills"
            radius="md"
            color="hongbao-red"
            keepMounted={false}
            classNames={{
              list: "flex! w-full! flex-nowrap! gap-1! rounded-lg! bg-gray-50! p-1! ring-1! ring-gray-100!",
              tab: "h-9! min-w-0! flex-1! px-2! sm:px-4! text-[13px]! font-semibold! text-gray-500! transition-colors! duration-150! data-active:bg-white! data-active:text-hongbao-red-600! data-active:shadow-sm! data-active:ring-1! data-active:ring-gray-100! not-data-active:hover:text-gray-900!",
              tabLabel: "min-w-0! flex-none! truncate!",
              tabSection: "me-1.5!",
              panel: "pt-4! pb-1!",
            }}
          >
            <Tabs.List>
              <Tabs.Tab
                value="examples"
                leftSection={<ChatTextIcon size={16} />}
              >
                Examples{examples.length > 0 ? ` · ${examples.length}` : ""}
              </Tabs.Tab>
              <Tabs.Tab
                value="watch"
                leftSection={<PlayCircleIcon size={16} />}
              >
                Strokes
              </Tabs.Tab>
              <Tabs.Tab
                value="write"
                leftSection={<PencilSimpleLineIcon size={16} />}
              >
                Write
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="examples">
              {examples.length > 0 ? (
                <ol className="divide-y! divide-gray-100!">
                  {examples.map((example, i) => (
                    <ExampleSentence
                      key={i}
                      number={i + 1}
                      example={example}
                      word={card.cnWord}
                    />
                  ))}
                </ol>
              ) : (
                <div className="flex! flex-col! items-center! gap-2! py-8! text-gray-400!">
                  <ChatsCircleIcon size={28} />
                  <Text className="text-sm! text-gray-500!">
                    No example sentences for this word yet.
                  </Text>
                </div>
              )}
            </Tabs.Panel>

            {(["watch", "write"] as const).map((mode) => (
              <Tabs.Panel key={mode} value={mode}>
                <div className="mx-auto! h-[320px]! max-w-[360px]!">
                  <HanziPractice
                    key={`${mode}-${card.cnWord}`}
                    text={card.cnWord}
                    mode={mode}
                  />
                </div>
              </Tabs.Panel>
            ))}
          </Tabs>
        </section>
      </div>
    </div>
  );
};

export default CardBack;
