"use client";

import FeedbackCard from "@/app/[locale]/components/StudentReview/components/FeedbackCard/FeedbackCard";
import StarRow from "@/app/[locale]/components/StudentReview/components/StarRow/StarRow";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import {
  Avatar,
  Box,
  Container,
  Divider,
  Group,
  Space,
  Text,
} from "@mantine/core";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import useContainer from "./useContainer";

const StudentReview = () => {
  const t = useTranslations("Home.StudentReview");
  const {
    page,
    setPage,
    feedbacks,
    isEmpty,
    averageRating,
    totalPages,
    visibleFeedbacks,
  } = useContainer();

  if (isEmpty) return null;

  return (
    <Box>
      {/* full-bleed backdrop - spans the viewport edge to edge, distinct from
          the plain-white bands around it, giving the white testimonial cards
          a tinted backdrop to pop against */}
      <Box className="relative! overflow-hidden! bg-gradient-to-b! from-hongbao-cream-50! via-[#fffaf5]! dark:via-surface! to-surface!">
        <Box className="pointer-events-none absolute inset-0 opacity-90! bg-[radial-gradient(circle_at_1px_1px,rgba(140,21,21,0.055)_1px,transparent_0)]! bg-[length:28px_28px]!" />
        <Box className="pointer-events-none absolute top-0 left-[10%] w-[420px] h-[420px] rounded-full bg-hongbao-gold-200/25 blur-[110px]!" />
        <Box className="pointer-events-none absolute top-1/3 right-[4%] w-[360px] h-[360px] rounded-full bg-hongbao-orange-200/20 blur-[110px]!" />
        <Box className="pointer-events-none absolute bottom-0 left-[22%] w-[420px] h-[420px] rounded-full bg-hongbao-red-100/30 blur-[110px]!" />

        <Container size={"xl"} px={{ base: 16, sm: 24 }} className="relative!">
          <Box className="py-14! sm:py-20! md:py-24!">
            <SectionTitle
              eyebrow={t("eyebrow")}
              title={t("title")}
              subtitle={t("subtitle")}
              align="center"
            />

            <Space h={28} />

            {/* trust bar */}
            <div className="flex! justify-center!">
              <div className="flex! flex-col! sm:flex-row! items-center! gap-3! sm:gap-4! max-w-full! rounded-2xl! sm:rounded-full! border! border-gray-200! bg-surface! px-5! sm:px-6! py-4! sm:py-3! shadow-sm!">
                <div className="flex! shrink-0!">
                  {feedbacks.slice(0, 5).map((item, index) => (
                    <Avatar
                      key={item.id}
                      src="./assets/logo-head.svg"
                      size={34}
                      radius="xl"
                      bg="var(--hb-tint-red)"
                      p={5}
                      className={`ring-2! ring-surface! ${index === 0 ? "" : "-ml-2.5!"}`}
                      style={{ zIndex: 5 - index }}
                    />
                  ))}
                </div>
                <Divider
                  orientation="vertical"
                  className="hidden! sm:block!"
                  color="gray.2"
                />
                {/* rating stacks above the label on mobile so the sentence never
                    breaks mid-phrase inside the pill */}
                <div className="flex! flex-col! sm:flex-row! items-center! gap-1! sm:gap-2! min-w-0!">
                  <Group gap={8} wrap="nowrap">
                    <StarRow rating={averageRating} size={15} />
                    <Text size="sm" fw={800} c="gray.8">
                      {averageRating.toFixed(1)}
                    </Text>
                  </Group>
                  <Text
                    size="sm"
                    c="gray.5"
                    ta="center"
                    className="text-balance!"
                  >
                    <span className="hidden! sm:inline!">· </span>
                    {t("loved_by", { count: feedbacks.length })}
                  </Text>
                </div>
              </div>
            </div>

            <Space h={48} />

            <div
              key={page}
              className="grid grid-cols-1! sm:grid-cols-2! lg:grid-cols-3! gap-3! sm:gap-4!"
            >
              {visibleFeedbacks.map((item, index) => (
                <FeedbackCard key={item.id} data={item} index={index} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex! items-center! justify-center! gap-5! pt-12!">
                <button
                  type="button"
                  aria-label={t("previous_aria")}
                  disabled={page === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  className="flex! items-center! justify-center! w-11! h-11! rounded-full! border! border-gray-300! bg-surface! text-gray-700! transition-all! duration-200! ease-out! hover:border-hongbao-red-300! hover:text-hongbao-red-600! dark:hover:text-night-red! hover:-translate-x-0.5! disabled:opacity-40! disabled:hover:border-gray-300! disabled:hover:text-gray-700! disabled:hover:translate-x-0! disabled:cursor-not-allowed! cursor-pointer!"
                >
                  <CaretLeftIcon size={16} weight="bold" />
                </button>

                <div className="flex! items-center! gap-2!">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={t("go_to_page_aria", { page: i + 1 })}
                      aria-current={i === page}
                      onClick={() => setPage(i)}
                      className={`h-2! rounded-full! transition-all! duration-300! ease-out! cursor-pointer! ${
                        i === page
                          ? "w-6! bg-hongbao-red-500!"
                          : "w-2! bg-gray-300! hover:bg-gray-400!"
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  aria-label={t("next_aria")}
                  disabled={page === totalPages - 1}
                  onClick={() =>
                    setPage((p) => Math.min(totalPages - 1, p + 1))
                  }
                  className="flex! items-center! justify-center! w-11! h-11! rounded-full! border! border-gray-300! bg-surface! text-gray-700! transition-all! duration-200! ease-out! hover:border-hongbao-red-300! hover:text-hongbao-red-600! dark:hover:text-night-red! hover:translate-x-0.5! disabled:opacity-40! disabled:hover:border-gray-300! disabled:hover:text-gray-700! disabled:hover:translate-x-0! disabled:cursor-not-allowed! cursor-pointer!"
                >
                  <CaretRightIcon size={16} weight="bold" />
                </button>
              </div>
            )}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default StudentReview;
