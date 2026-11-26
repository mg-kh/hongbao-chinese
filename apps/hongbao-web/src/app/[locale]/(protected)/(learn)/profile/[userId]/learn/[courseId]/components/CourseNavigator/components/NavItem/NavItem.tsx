import { Box, Group, Text } from "@mantine/core";
import {
  CheckCircleIcon,
  SealQuestionIcon,
  VideoIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import React, { memo } from "react";

interface Props {
  title?: string;
  href: string;
  type: "video" | "quiz";
  isCompleted?: boolean;
  isActive?: boolean;
  onNavigate?: () => void;
}

/** A single video/quiz row inside a lesson. Memoized: the navigator
 * re-renders on every route change, but only the old/new active rows and
 * newly completed rows actually change. */
const NavItem: React.FC<Props> = ({
  title,
  href,
  type,
  isCompleted,
  isActive,
  onNavigate,
}) => (
  <Link href={href} className="no-underline!" onClick={onNavigate}>
    <Group
      gap={10}
      wrap="nowrap"
      py={10}
      px={10}
      className={`rounded-xl! transition-colors! duration-200! ease-out! ${
        isActive
          ? "bg-hongbao-red-50! ring-1! ring-hongbao-red-200!"
          : "hover:bg-gray-50! active:bg-gray-100!"
      }`}
    >
      <Box
        className={`flex! items-center! justify-center! w-7! h-7! rounded-lg! shrink-0! ${
          isCompleted
            ? "bg-green-100! text-green-600! dark:text-night-green!"
            : isActive
              ? "bg-hongbao-red-100! text-hongbao-red-600! dark:text-night-red!"
              : "bg-gray-100! text-gray-500!"
        }`}
      >
        {isCompleted ? (
          <CheckCircleIcon size={15} weight="fill" />
        ) : type === "video" ? (
          <VideoIcon size={14} weight="fill" />
        ) : (
          <SealQuestionIcon size={14} weight="fill" />
        )}
      </Box>

      <Text
        size="sm"
        lineClamp={2}
        fw={isActive ? 700 : 500}
        c={
          isCompleted && !isActive
            ? "gray.6"
            : isActive
              ? "hongbao-red.7"
              : "gray.8"
        }
      >
        {title}
      </Text>
    </Group>
  </Link>
);

export default memo(NavItem);
