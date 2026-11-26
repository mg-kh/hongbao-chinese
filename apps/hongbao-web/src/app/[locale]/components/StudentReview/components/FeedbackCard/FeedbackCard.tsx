"use client";

import QuoteMarkIcon from "@/components/icons/QuoteMarkIcon";
import StarRow from "@/app/[locale]/components/StudentReview/components/StarRow/StarRow";
import { TPublicFeedback } from "@/app/[locale]/components/StudentReview/types/feedback.type";
import { Badge, Paper, Text } from "@mantine/core";
import { UserIcon } from "@phosphor-icons/react";
import React from "react";
import useContainer from "./useContainer";

interface Props {
  data: TPublicFeedback;
  /** Stagger index for the entrance animation. */
  index?: number;
}

/** Testimonial card, styled after the profile "My Courses" CourseCard. */
const FeedbackCard: React.FC<Props> = ({ data, index = 0 }) => {
  const { position } = useContainer(data);

  return (
    <Paper
      p={10}
      bdrs={12}
      style={{ animationDelay: `${index * 70}ms` }}
      className="group! block! h-full! border! border-gray-100! transition-all! duration-200! hover:border-hongbao-gold-300! hover:shadow-sm! [animation:fade-up_0.55s_ease-out_both]"
    >
      <div className="flex h-full flex-col gap-3">
        {/* tinted quote tile - takes the place of CourseCard's media tile */}
        <div className="flex! flex-1! flex-col! gap-2! rounded-xl! p-4! bg-hongbao-gold-50! text-hongbao-gold-700!">
          <QuoteMarkIcon width={18} height={18} />
          <Text size="sm" c="gray.7" lineClamp={5} className="leading-relaxed!">
            {data.content}
          </Text>
        </div>

        <div className="min-w-0 space-y-1.5 px-1 pb-1">
          {/* position chip */}
          <div className="flex flex-wrap items-center gap-1">
            <Badge
              size="xs"
              radius="sm"
              variant="light"
              color="hongbao-gold"
              leftSection={<UserIcon size={10} weight="bold" />}
            >
              {position}
            </Badge>
          </div>

          <Text
            size="sm"
            fw={700}
            c="dark.7"
            lineClamp={1}
            className="leading-snug!"
          >
            {data.name}
          </Text>

          <div className="flex items-center gap-1.5">
            <StarRow rating={data.rating} size={12} />
            <Text size="xs" c="gray.6">
              {data.rating.toFixed(1)}
            </Text>
          </div>
        </div>
      </div>
    </Paper>
  );
};

export default FeedbackCard;
