import { FlashcardTypeIcon } from "@/components/icons/productTypeIcons";
import type { TMyFlashcard } from "@/hooks/global-data-fetching/useMyFlashcards";
import { pluralize } from "@/utils/pluralize";
import { Paper, Text } from "@mantine/core";
import { CaretRightIcon } from "@phosphor-icons/react";
import Link from "next/link";

interface Props {
  flashcard: TMyFlashcard;
  href: string;
}

/** One enrolled flashcard in the list - links to its detail page. */
const FlashcardTile: React.FC<Props> = ({ flashcard, href }) => (
  <Paper
    component={Link}
    href={href}
    withBorder
    bdrs={20}
    p={16}
    className="flex! items-center! gap-3! no-underline! border-hongbao-cream-300! bg-hongbao-cream-50! shadow-sm! transition-all! duration-200! ease-out! hover:-translate-y-0.5! hover:border-hongbao-red-200! hover:shadow-md!"
  >
    <div className="flex! size-11! shrink-0! items-center! justify-center! rounded-xl! bg-hongbao-orange-50! text-hongbao-orange-600!">
      <FlashcardTypeIcon size={22} weight="fill" />
    </div>
    <div className="min-w-0! flex-1!">
      {flashcard.category?.name && (
        <Text
          size="10px"
          fw={700}
          c="hongbao-red.6"
          className="uppercase! tracking-[0.12em]!"
        >
          {flashcard.category.name}
        </Text>
      )}
      <Text fw={700} c="gray.9" truncate>
        {flashcard.name}
      </Text>
      <Text size="xs" c="gray.5">
        {pluralize(flashcard.cardCount, "card")}
      </Text>
    </div>
    <CaretRightIcon size={16} className="shrink-0! text-gray-400!" />
  </Paper>
);

export default FlashcardTile;
