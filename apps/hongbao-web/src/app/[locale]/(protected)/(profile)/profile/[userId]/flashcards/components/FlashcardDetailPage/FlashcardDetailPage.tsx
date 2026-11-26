"use client";

import CustomBreadCrumb from "@/components/CustomBreadCrumb/CustomBreadCrumb";
import { Button, Center, Loader, Paper, Stack, Text } from "@mantine/core";
import Link from "next/link";
import CardDialog from "@/app/[locale]/(protected)/(profile)/profile/[userId]/flashcards/components/CardDialog/CardDialog";
import CardTile from "@/app/[locale]/(protected)/(profile)/profile/[userId]/flashcards/components/CardTile/CardTile";
import useContainer from "@/app/[locale]/(protected)/(profile)/profile/[userId]/flashcards/components/FlashcardDetailPage/useContainer";

const emptyClass =
  "border-dashed! border-gray-300! bg-gray-50/60! text-center!";

const FlashcardDetailPage = () => {
  const {
    userId,
    flashcard,
    cards,
    isLoading,
    isError,
    activeIndex,
    setActiveIndex,
  } = useContainer();

  return (
    <Stack gap={20} className="flex-1!">
      <CustomBreadCrumb
        title={flashcard?.name}
        links={[
          { label: "Profile", href: `/profile/${userId}`, isActive: true },
          {
            label: "Flashcards",
            href: `/profile/${userId}/flashcards`,
            isActive: true,
          },
          { label: flashcard?.name ?? "Cards", href: "", isActive: false },
        ]}
      />

      {isLoading ? (
        <Center py={60}>
          <Loader color="hongbao-red" />
        </Center>
      ) : isError || !flashcard ? (
        <Paper
          withBorder
          bdrs={20}
          p={{ base: 28, sm: 40 }}
          className={emptyClass}
        >
          <Stack gap={12} align="center">
            <Text c="gray.6">
              This flashcard isn&apos;t available. You may not be enrolled, or
              your access has expired.
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
      ) : cards.length === 0 ? (
        <Paper
          withBorder
          bdrs={20}
          p={{ base: 28, sm: 40 }}
          className={emptyClass}
        >
          <Text c="gray.6">No cards in this flashcard yet.</Text>
        </Paper>
      ) : (
        <div className="grid! grid-cols-[repeat(auto-fill,minmax(104px,1fr))]! gap-2! sm:grid-cols-[repeat(auto-fill,minmax(128px,1fr))]! sm:gap-3!">
          {cards.map((c, i) => (
            <CardTile key={c.id} card={c} onClick={() => setActiveIndex(i)} />
          ))}
        </div>
      )}

      <CardDialog
        cards={cards}
        userId={String(userId)}
        deckName={flashcard?.name}
        index={activeIndex}
        onIndexChange={setActiveIndex}
      />
    </Stack>
  );
};

export default FlashcardDetailPage;
