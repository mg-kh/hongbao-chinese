import type { TFlashcard } from "@/hooks/global-data-fetching/useAllFlashcardList";
import { Paper, Text } from "@mantine/core";

interface Props {
  card: TFlashcard;
  onClick: () => void;
}

/** Small static preview shown in the grid - tap to open the full card in the dialog. */
const FlashcardTile: React.FC<Props> = ({ card, onClick }) => (
  <Paper
    withBorder
    bdrs={20}
    onClick={onClick}
    className="relative! aspect-[4/5]! flex! flex-col! items-center! justify-center! gap-2! p-4! text-center! border-hongbao-cream-300! bg-hongbao-cream-50! shadow-sm! cursor-pointer! transition-all! duration-200! ease-out! hover:-translate-y-1! hover:border-hongbao-red-200! hover:shadow-md!"
  >
    {card.category?.name && (
      <Text
        size="10px"
        fw={700}
        c="hongbao-red.6"
        className="absolute! top-3! uppercase! tracking-[0.12em]!"
      >
        {card.category.name}
      </Text>
    )}
    <Text className="text-3xl! sm:text-4xl! font-bold! text-gray-900!">
      {card.cnWord}
    </Text>
    <Text size="sm" c="gray.5">
      {card.pinyin}
    </Text>
  </Paper>
);

export default FlashcardTile;
