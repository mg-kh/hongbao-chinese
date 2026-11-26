import { FlashcardTypeIcon } from "@/components/icons/productTypeIcons";
import type { TMyFlashcard } from "@/hooks/global-data-fetching/useMyFlashcards";
import { pluralize } from "@/utils/pluralize";
import { Badge, Box, Paper, Text } from "@mantine/core";
import { CardsIcon } from "@phosphor-icons/react";
import Link from "next/link";

interface Props {
  flashcard: TMyFlashcard;
  href: string;
}

/**
 * One enrolled flashcard in the list - links to its detail page. Mirrors the
 * vertical layout of the my-courses CourseCard.
 */
const FlashcardTile: React.FC<Props> = ({ flashcard, href }) => (
  <Paper
    component={Link}
    href={href}
    p={10}
    bdrs={12}
    className="group! block! h-full! no-underline! border! border-gray-100! transition-all! duration-200! hover:border-hongbao-red-200! hover:shadow-sm!"
  >
    <div className="flex flex-col h-full gap-3">
      {/* media - type icon tile, same 16:9 shape as course covers */}
      <Box className="flex! items-center! justify-center! w-full! aspect-video! shrink-0! rounded-xl! bg-hongbao-orange-50! text-hongbao-orange-600! dark:text-night-orange!">
        <FlashcardTypeIcon size={40} weight="duotone" />
      </Box>

      <div className="min-w-0 flex-1 space-y-1.5">
        {/* type + category chips */}
        <div className="flex flex-wrap items-center gap-1">
          <Badge
            size="xs"
            radius="sm"
            variant="light"
            color="hongbao-orange"
            leftSection={<FlashcardTypeIcon size={10} weight="bold" />}
          >
            Flashcard
          </Badge>
          {flashcard.category?.name && (
            <Badge size="xs" radius="sm" variant="dot" color="hongbao-red">
              {flashcard.category.name}
            </Badge>
          )}
        </div>

        <Text
          size="sm"
          fw={700}
          lineClamp={2}
          c="var(--hb-text)"
          className="leading-snug!"
        >
          {flashcard.name}
        </Text>

        <div className="flex items-center gap-1 text-gray-500">
          <CardsIcon size={13} />
          <Text size="xs" c="gray.6" lineClamp={1}>
            {pluralize(flashcard.cardCount, "card")}
          </Text>
        </div>
      </div>
    </div>
  </Paper>
);

export default FlashcardTile;
