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
  {
    tile: string;
    value: string;
    progress: string;
    /** Soft corner blob behind the watermark in the "graphic" layout. */
    blob: string;
    /** Faded oversized icon colour in the "graphic" layout. */
    mark: string;
  }
> = {
  brand: {
    tile: "bg-hongbao-red-50! text-hongbao-red-600! dark:text-night-red!",
    value: "text-hongbao-red-700! dark:text-night-red!",
    progress: "hongbao-red",
    blob: "bg-hongbao-red-50!",
    mark: "text-hongbao-red-200!",
  },
  neutral: {
    tile: "bg-gray-100! text-gray-400!",
    value: "text-gray-400!",
    progress: "gray",
    blob: "bg-gray-50!",
    mark: "text-gray-200!",
  },
  attention: {
    tile: "bg-hongbao-gold-50! text-hongbao-gold-700! dark:text-night-gold!",
    value: "text-hongbao-gold-800! dark:text-night-gold!",
    progress: "hongbao-gold",
    blob: "bg-hongbao-gold-50!",
    mark: "text-hongbao-gold-200!",
  },
  success: {
    tile: "bg-green-50! text-green-600! dark:text-night-green!",
    value: "text-green-700! dark:text-night-green!",
    progress: "green",
    blob: "bg-green-50!",
    mark: "text-green-200!",
  },
};

interface Props {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  caption?: string;
  tone: StatTone;
  progress?: number;
  /** "stacked" (default): icon above the number. "graphic": no icon chip -
   * the icon becomes a large faded watermark over a soft tone-coloured blob
   * bleeding off the bottom-right corner, so the number leads. */
  layout?: "stacked" | "graphic";
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
  layout = "stacked",
  className = "",
}) => {
  const t = statTones[tone];

  if (layout === "graphic") {
    return (
      <Paper
        withBorder
        bdrs={16}
        p={{ base: 14, sm: 16 }}
        className={`relative! overflow-hidden! bg-surface! border-gray-200! transition-all! duration-200! ease-out! hover:-translate-y-0.5! hover:shadow-md! group ${className}`}
      >
        {/* decorative background - hidden from screen readers */}
        <Box
          aria-hidden
          className={`pointer-events-none! absolute! -right-8! -bottom-10! w-28! h-28! rounded-full! ${t.blob}`}
        />
        <Box
          aria-hidden
          className={`pointer-events-none! absolute! -right-3! -bottom-4! w-[72px]! h-[72px]! -rotate-12! transition-transform! duration-300! ease-out! group-hover:-rotate-6! group-hover:scale-105! [&_svg]:w-full! [&_svg]:h-full! ${t.mark}`}
        >
          {icon}
        </Box>

        <div className="relative pr-10">
          <Text
            fw={800}
            className={`text-2xl! sm:text-3xl! leading-none! ${t.value}`}
          >
            {value}
          </Text>
          <Text
            fw={600}
            size="sm"
            c="gray.7"
            mt={6}
            lineClamp={1}
            className="leading-snug!"
          >
            {label}
          </Text>
          {caption ? (
            <Text
              size="xs"
              c="gray.5"
              mt={4}
              lineClamp={1}
              className="leading-snug!"
            >
              {caption}
            </Text>
          ) : null}
        </div>
      </Paper>
    );
  }

  return (
    <Paper
      withBorder
      bdrs={16}
      p={{ base: 14, sm: 16 }}
      className={`bg-surface! border-gray-200! transition-all! duration-200! ease-out! hover:-translate-y-0.5! hover:shadow-md! ${className}`}
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

      {caption ? (
        <Text size="xs" c="gray.5" mt={6} className="leading-snug!">
          {caption}
        </Text>
      ) : null}
    </Paper>
  );
};

export default StatTile;
