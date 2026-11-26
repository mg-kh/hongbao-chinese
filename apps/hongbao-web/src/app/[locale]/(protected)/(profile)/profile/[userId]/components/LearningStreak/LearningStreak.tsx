import { ActionIcon, Skeleton, Text, Tooltip } from "@mantine/core";
import { useTranslations } from "next-intl";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import React, { memo } from "react";
import useContainer, { TIntensity } from "./useContainer";

/** Monday-first, matching the grid rows. */
const DAY_LABELS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

/** Fill per intensity level: more completions that day, deeper red. */
const LEVEL_COLORS: Record<TIntensity, string> = {
  0: "bg-gray-100",
  1: "bg-hongbao-red-100",
  2: "bg-hongbao-red-300",
  3: "bg-hongbao-red-500",
  4: "bg-hongbao-red-700",
};
const LEVELS: TIntensity[] = [0, 1, 2, 3, 4];

/**
 * Daily learning calendar: one pill per day, shaded by how many videos and
 * quizzes the user completed that day - deeper red means more.
 */
const LearningStreak: React.FC = () => {
  const t = useTranslations("Profile.LearningStreak");
  const {
    year,
    isCurrentYear,
    canGoPrev,
    canGoNext,
    goPrev,
    goNext,
    activeDays,
    scrollRef,
    gridStyle,
    scrollAreaStyle,
    cells,
    monthLabels,
    currentStreak,
    isLoading,
  } = useContainer();

  return (
    <section aria-label={t("aria_section")} className="flex flex-col min-w-0">
      <div className="min-w-0 flex flex-col">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 mb-3">
          <div className="flex items-center gap-1.5">
            <Text fw={700} size="sm" c="gray.8">
              {t("title")}
            </Text>
            <div className="flex items-center gap-0.5">
              <ActionIcon
                variant="transparent"
                color="gray"
                size="sm"
                className="bg-transparent! hover:text-gray-800! data-disabled:text-gray-300!"
                onClick={goPrev}
                disabled={!canGoPrev}
                aria-label={t("previous_year")}
              >
                <CaretLeftIcon size={14} />
              </ActionIcon>
              <Text
                size="sm"
                fw={600}
                c="gray.6"
                aria-live="polite"
                className="tabular-nums! min-w-[2.5rem]! text-center!"
              >
                {year}
              </Text>
              <ActionIcon
                variant="transparent"
                color="gray"
                size="sm"
                className="bg-transparent! hover:text-gray-800! data-disabled:text-gray-300!"
                onClick={goNext}
                disabled={!canGoNext}
                aria-label={t("next_year")}
              >
                <CaretRightIcon size={14} />
              </ActionIcon>
            </div>
          </div>
          <Text size="xs" c="gray.5">
            {!isCurrentYear
              ? isLoading
                ? "\u00a0"
                : t("active_days", { count: activeDays, year })
              : currentStreak > 0
                ? t("keep_going")
                : t("start_streak")}
          </Text>
        </div>

        {isLoading ? (
          <Skeleton height={150} radius="md" />
        ) : (
          <div className="flex gap-2 w-full">
            {/* weekday labels - stay put while the grid scrolls */}
            <div className="flex flex-col gap-[3px] pt-[18px] pb-1 shrink-0 w-7">
              {DAY_LABELS.map((label, i) => (
                <div
                  key={i}
                  className="flex-1 flex items-center text-[10px] leading-none text-gray-400"
                >
                  {t(`days.${label}`)}
                </div>
              ))}
            </div>

            {/* full 12 months: stretches to fit, scrolls when too narrow */}
            <div
              ref={scrollRef}
              className="flex-1 min-w-0 overflow-x-auto pb-1"
            >
              <div style={scrollAreaStyle}>
                {/* month labels */}
                <div className="grid h-[14px] mb-1" style={gridStyle}>
                  {monthLabels.map((label, i) => (
                    <div
                      key={i}
                      className="text-[10px] leading-none text-gray-400 whitespace-nowrap"
                    >
                      {label}
                    </div>
                  ))}
                </div>

                {/* day cells: columns are weeks, rows are Mon..Sun */}
                {/* Tooltip.Group: after the first hover, moving across
                    cells swaps the tooltip instantly instead of re-waiting */}
                <Tooltip.Group openDelay={80} closeDelay={60}>
                  <div
                    className="grid grid-flow-col grid-rows-7"
                    style={gridStyle}
                  >
                    {cells.map((cell) =>
                      cell.isOutside ? (
                        <div key={cell.key} className="aspect-square" />
                      ) : (
                        <Tooltip
                          key={cell.key}
                          withArrow
                          radius="md"
                          position="top"
                          transitionProps={{ duration: 0 }}
                          label={
                            <div className="text-center leading-tight">
                              <div className="font-semibold">
                                {cell.summary}
                              </div>
                              <div className="text-[11px] opacity-70">
                                {cell.dateLabel}
                              </div>
                            </div>
                          }
                        >
                          <div
                            role="img"
                            aria-label={cell.label}
                            className={`aspect-square rounded-[28%] transition-shadow hover:ring-2 hover:ring-gray-400/60 ${
                              cell.isFuture
                                ? "border border-dashed border-gray-200"
                                : LEVEL_COLORS[cell.level]
                            }`}
                          />
                        </Tooltip>
                      ),
                    )}
                  </div>
                </Tooltip.Group>
              </div>
            </div>
          </div>
        )}

        {/* intensity scale */}
        <div
          className="flex items-center justify-end gap-1.5 mt-3"
          aria-label={t("aria_scale")}
        >
          <Text size="xs" c="gray.5" mr={2}>
            {t("less")}
          </Text>
          {LEVELS.map((level) => (
            <div
              key={level}
              className={`w-2.5 h-2.5 rounded-[28%] ${LEVEL_COLORS[level]}`}
            />
          ))}
          <Text size="xs" c="gray.5" ml={2}>
            {t("more")}
          </Text>
        </div>
      </div>
    </section>
  );
};

// Takes no props, so memo stops parent re-renders (the profile page and
// header card both update state after mount) from re-rendering ~370 cells.
export default memo(LearningStreak);
