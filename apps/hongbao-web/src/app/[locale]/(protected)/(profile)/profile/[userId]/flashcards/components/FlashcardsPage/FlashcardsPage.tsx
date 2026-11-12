"use client";

import { Center, Loader, Paper, Select, Stack, Text } from "@mantine/core";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import Link from "next/link";
import FlashcardDialog from "../FlashcardDialog/FlashcardDialog";
import FlashcardTile from "../FlashcardTile/FlashcardTile";
import useContainer from "./useContainer";

const FlashcardsPage = () => {
  const {
    userId,
    isLoading,
    cards,
    category,
    handleCategoryChange,
    categorySelectData,
    activeCard,
    activeIndex,
    flipped,
    showPinyin,
    openAt,
    closeDialog,
    goPrev,
    goNext,
    toggleFlip,
    toggleShowPinyin,
  } = useContainer();

  return (
    <Stack gap={20} className="flex-1!">
      <Link
        href={`/profile/${userId}`}
        className="flex! items-center! gap-1.5! w-fit! no-underline! text-gray-500! hover:text-hongbao-red-600! transition-colors! duration-200!"
      >
        <ArrowLeftIcon size={14} weight="bold" />
        <Text size="xs" fw={600}>
          Back to profile
        </Text>
      </Link>

      <Stack gap={4}>
        <Text size="xl" fw={"bold"} c={"hongbao-red"}>
          Flashcards
        </Text>
        <Text size="sm" c="gray.6">
          Tap a card to open it. Drill vocabulary by category.
        </Text>
      </Stack>

      <div className="flex! flex-col! sm:flex-row! sm:items-center! sm:justify-between! gap-3!">
        <Text size="xs" c="gray.5">
          {cards.length} card{cards.length === 1 ? "" : "s"}
        </Text>

        <Select
          value={category}
          onChange={handleCategoryChange}
          data={categorySelectData}
          allowDeselect={false}
          radius="md"
          color="hongbao-red"
          className="w-full! sm:w-[200px]!"
          aria-label="Filter by category"
        />
      </div>

      {isLoading ? (
        <Center py={60}>
          <Loader color="hongbao-red" />
        </Center>
      ) : cards.length === 0 ? (
        <Paper
          withBorder
          bdrs={20}
          p={{ base: 28, sm: 40 }}
          className="border-dashed! border-gray-300! bg-gray-50/60! text-center!"
        >
          <Text c="gray.6">No cards in this category yet.</Text>
        </Paper>
      ) : (
        <div className="grid! grid-cols-2! sm:grid-cols-3! lg:grid-cols-4! gap-3! sm:gap-4!">
          {cards.map((c, i) => (
            <FlashcardTile key={c.id} card={c} onClick={() => openAt(i)} />
          ))}
        </div>
      )}

      <FlashcardDialog
        card={activeCard}
        index={activeIndex}
        total={cards.length}
        flipped={flipped}
        showPinyin={showPinyin}
        onClose={closeDialog}
        onFlip={toggleFlip}
        onPrev={goPrev}
        onNext={goNext}
        onTogglePinyin={toggleShowPinyin}
      />
    </Stack>
  );
};

export default FlashcardsPage;
