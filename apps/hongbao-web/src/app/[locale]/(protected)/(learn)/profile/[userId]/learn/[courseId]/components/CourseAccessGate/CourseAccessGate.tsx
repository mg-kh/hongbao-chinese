"use client";

import { Box, Button, Center, Loader, Paper, Stack, Text } from "@mantine/core";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  HourglassHighIcon,
  LockSimpleIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import React from "react";
import useContainer from "./useContainer";

interface Props {
  children: React.ReactNode;
}

/**
 * Blocks the learn pages (navigator + content) when `learn/course-detail`
 * refuses access. Expired enrollments get a renew prompt.
 */
const CourseAccessGate: React.FC<Props> = ({ children }) => {
  const {
    isLoading,
    accessError,
    isExpired,
    isPending,
    expiredOn,
    myCoursesHref,
    renewHref,
  } = useContainer();

  if (isLoading) {
    return (
      <Center py={80} className="w-full!">
        <Loader color="hongbao-red" />
      </Center>
    );
  }

  if (!accessError) return <>{children}</>;

  const title = isExpired
    ? "သက်တမ်းကုန်သွားပါပြီ"
    : isPending
      ? "Waiting for admin approval"
      : "You don't have access to this course";

  const description = isExpired
    ? `Your access${expiredOn ? ` ended on ${expiredOn}` : " has ended"}. Renew to keep learning - your progress is saved.`
    : isPending
      ? "Your purchase is being reviewed. You can start learning once it's approved."
      : "Purchase this course to start learning.";

  return (
    <Center py={{ base: 40, sm: 80 }} className="w-full!">
      <Paper
        withBorder
        bdrs={20}
        p={{ base: 24, sm: 36 }}
        className="w-full! max-w-md! border-dashed! border-gray-300! bg-gray-50/70!"
      >
        <Stack align="center" gap={14} ta="center">
          <Box
            className={`flex! items-center! justify-center! w-14! h-14! rounded-2xl! ${
              isPending
                ? "bg-hongbao-orange-50! text-hongbao-orange-600! dark:text-night-orange!"
                : "bg-gray-100! text-gray-500!"
            }`}
          >
            {isPending ? (
              <HourglassHighIcon size={28} weight="fill" />
            ) : (
              <LockSimpleIcon size={28} weight="fill" />
            )}
          </Box>

          <Text fw={800} size="lg" c="gray.8">
            {title}
          </Text>
          <Text size="sm" c="gray.6" className="leading-relaxed!">
            {description}
          </Text>

          <Stack gap={8} w="100%" pt={6}>
            {!isPending && (
              <Button
                component={Link}
                href={renewHref}
                color="hongbao-red"
                radius="md"
                fullWidth
                rightSection={<ArrowRightIcon size={14} />}
              >
                {isExpired ? "သက်တမ်းတိုးရန်" : "Go to shop"}
              </Button>
            )}
            <Button
              component={Link}
              href={myCoursesHref}
              variant="subtle"
              color="gray"
              radius="md"
              fullWidth
              leftSection={<ArrowLeftIcon size={14} />}
            >
              Back to my courses
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Center>
  );
};

export default CourseAccessGate;
