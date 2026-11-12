import { Box, Paper, Progress, Text } from "@mantine/core";

/**
 * Tone is semantic, not decorative: it reflects the *state* of the number
 * rather than giving every tile its own colour. A wall of differently
 * coloured cards makes nothing stand out, so colour is reserved for
 * "there's something here", "this needs you", and "you're all clear".
 */
export type StatTone = "brand" | "neutral" | "attention" | "success";

const statTones: Record<
  StatTone,
  { tile: string; value: string; progress: string }
> = {
  brand: {
    tile: "bg-hongbao-red-50! text-hongbao-red-600!",
    value: "text-hongbao-red-700!",
    progress: "hongbao-red",
  },
  neutral: {
    tile: "bg-gray-100! text-gray-400!",
    value: "text-gray-400!",
    progress: "gray",
  },
  attention: {
    tile: "bg-hongbao-gold-50! text-hongbao-gold-700!",
    value: "text-hongbao-gold-800!",
    progress: "hongbao-gold",
  },
  success: {
    tile: "bg-green-50! text-green-600!",
    value: "text-green-700!",
    progress: "green",
  },
};

interface Props {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  caption: string;
  tone: StatTone;
  progress?: number;
  className?: string;
}

/** KPI tile: icon, headline value, plain-language label, and a caption that
 * reacts to the actual number. Optional progress bar for ratio stats. */
const StatTile: React.FC<Props> = ({
  icon,
  value,
  label,
  caption,
  tone,
  progress,
  className = "",
}) => {
  const t = statTones[tone];

  return (
    <Paper
      withBorder
      bdrs={16}
      p={{ base: 14, sm: 16 }}
      className={`bg-white! border-gray-200! transition-all! duration-200! ease-out! hover:-translate-y-0.5! hover:shadow-md! ${className}`}
    >
      <Box
        className={`flex! items-center! justify-center! w-8! h-8! rounded-lg! mb-3! ${t.tile}`}
      >
        {icon}
      </Box>

      <Text
        fw={800}
        className={`text-[1.65rem]! sm:text-3xl! leading-none! ${t.value}`}
      >
        {value}
      </Text>

      {/* Sentence-case and full width - a tracked-out micro-caps label runs
          out of room and truncates mid-word on narrow tiles. */}
      <Text fw={600} size="sm" c="gray.7" mt={8} className="leading-snug!">
        {label}
      </Text>

      {progress !== undefined ? (
        <Progress
          value={progress}
          size={4}
          radius="xl"
          color={t.progress}
          mt={10}
          className="bg-gray-100!"
        />
      ) : null}

      <Text size="xs" c="gray.5" mt={6} className="leading-snug!">
        {caption}
      </Text>
    </Paper>
  );
};

export default StatTile;
