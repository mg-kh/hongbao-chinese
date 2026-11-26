import { FlashcardTypeIcon } from "@/components/icons/productTypeIcons";
import type { TCard } from "@/hooks/global-data-fetching/useMyFlashcards";
import { Box, Paper, Text } from "@mantine/core";
import React from "react";

interface Props {
  card: TCard;
  onClick: () => void;
}

/**
 * Compact preview in the deck overview grid - tap to open the card in the
 * dialog. Same decorative corner as the profile's "graphic" stat tiles: a
 * soft blob with a faded, tilted card icon bleeding off the bottom-right.
 */
const CardTile: React.FC<Props> = ({ card, onClick }) => (
  <Paper
    component="button"
    type="button"
    onClick={onClick}
    withBorder
    radius="lg"
    className="group! relative! flex! min-w-0! flex-col! items-center! justify-center! gap-1! overflow-hidden! px-2! py-4! text-center! border-hongbao-cream-300! bg-surface! cursor-pointer! transition-[border-color,box-shadow,transform]! duration-150! ease-out! hover:-translate-y-0.5! hover:border-hongbao-red-200! hover:shadow-sm! focus-visible:outline-2! focus-visible:outline-offset-2! focus-visible:outline-hongbao-red-500!"
  >
    {/* decorative background - hidden from screen readers */}
    <Box
      aria-hidden
      className="pointer-events-none! absolute! -right-6! -bottom-7! h-16! w-16! rounded-full! bg-hongbao-red-50!"
    />
    <Box
      aria-hidden
      className="pointer-events-none! absolute! -right-2! -bottom-3! h-10! w-10! -rotate-12! text-hongbao-red-200! transition-transform! duration-300! ease-out! group-hover:-rotate-6! group-hover:scale-105! [&_svg]:h-full! [&_svg]:w-full!"
    >
      <FlashcardTypeIcon weight="fill" />
    </Box>

    <Text
      lang="zh"
      className="relative! w-full! truncate! text-xl! font-bold! leading-tight! text-gray-900! sm:text-2xl!"
    >
      {card.cnWord}
    </Text>
    {card.pinyin && (
      <Text className="relative! w-full! truncate! text-xs! text-gray-500!">
        {card.pinyin}
      </Text>
    )}
  </Paper>
);

export default CardTile;
