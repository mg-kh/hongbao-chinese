"use client";

import CustomBreadCrumb from "@/components/CustomBreadCrumb/CustomBreadCrumb";
import { pluralize } from "@/utils/pluralize";
import { Button, Center, Loader, Paper, Stack, Text } from "@mantine/core";
import Link from "next/link";
import FlashcardTile from "../FlashcardTile/FlashcardTile";
import useContainer from "./useContainer";

const FlashcardsPage = () => {
  const { userId, flashcards, isLoading } = useContainer();

  return (
    <Stack gap={20} className="flex-1!">
      <CustomBreadCrumb
        title="Flashcards"
        links={[
          { label: "Profile", href: `/profile/${userId}`, isActive: true },
          {
            label: "Flashcards",
            href: `/profile/${userId}/flashcards`,
            isActive: false,
          },
        ]}
      />

      <Text size="sm" c="gray.6">
        Your enrolled flashcards. Pick one to start drilling.
      </Text>

      {isLoading ? (
        <Center py={60}>
          <Loader color="hongbao-red" />
        </Center>
      ) : flashcards.length === 0 ? (
        <Paper
          withBorder
          bdrs={20}
          p={{ base: 28, sm: 40 }}
          className="border-dashed! border-gray-300! bg-gray-50/60! text-center!"
        >
          <Stack gap={12} align="center">
            <Text c="gray.6">
              You haven&apos;t enrolled in any flashcards yet.
            </Text>
            <Button
              component={Link}
              href="/shop?type=flashcard"
              color="hongbao-red"
              radius="md"
            >
              Browse flashcards
            </Button>
          </Stack>
        </Paper>
      ) : (
        <>
          <Text size="xs" c="gray.5">
            {pluralize(flashcards.length, "flashcard")}
          </Text>
          <div className="grid! grid-cols-1! sm:grid-cols-2! lg:grid-cols-3! gap-3! sm:gap-4!">
            {flashcards.map((f) => (
              <FlashcardTile
                key={f.id}
                flashcard={f}
                href={`/profile/${userId}/flashcards/${f.id}`}
              />
            ))}
          </div>
        </>
      )}
    </Stack>
  );
};

export default FlashcardsPage;
