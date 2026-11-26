import { Box, Paper, Stack, Text } from "@mantine/core";
import React from "react";

export type StatusCardColor =
  "red" | "gold" | "orange" | "maroon" | "brown" | "cream";

interface Props {
  count?: number;
  title: string;
  icon: React.ElementType<{ className?: string }>;
  color?: StatusCardColor;
}

const accents: Record<
  StatusCardColor,
  { tile: string; glow: string; border: string; count: string; blob: string }
> = {
  red: {
    tile: "from-hongbao-red-500! to-hongbao-maroon-600!",
    glow: "hover:shadow-[0_20px_45px_-20px_rgba(245,34,45,0.55)]!",
    border: "hover:border-hongbao-red-200!",
    count: "text-hongbao-red-600! dark:text-night-red!",
    blob: "bg-hongbao-red-200/40!",
  },
  gold: {
    tile: "from-hongbao-gold-500! to-hongbao-orange-600!",
    glow: "hover:shadow-[0_20px_45px_-20px_rgba(230,185,60,0.6)]!",
    border: "hover:border-hongbao-gold-300!",
    count: "text-hongbao-gold-800! dark:text-night-gold!",
    blob: "bg-hongbao-gold-200/50!",
  },
  orange: {
    tile: "from-hongbao-orange-500! to-hongbao-red-600!",
    glow: "hover:shadow-[0_20px_45px_-20px_rgba(242,106,27,0.55)]!",
    border: "hover:border-hongbao-orange-200!",
    count: "text-hongbao-orange-600! dark:text-night-orange!",
    blob: "bg-hongbao-orange-200/40!",
  },
  maroon: {
    tile: "from-hongbao-maroon-500! to-hongbao-brown-700!",
    glow: "hover:shadow-[0_20px_45px_-20px_rgba(122,31,31,0.5)]!",
    border: "hover:border-hongbao-maroon-200!",
    count: "text-hongbao-maroon-600! dark:text-night-maroon!",
    blob: "bg-hongbao-maroon-200/40!",
  },
  brown: {
    tile: "from-hongbao-brown-500! to-hongbao-maroon-700!",
    glow: "hover:shadow-[0_20px_45px_-20px_rgba(115,61,34,0.5)]!",
    border: "hover:border-hongbao-brown-200!",
    count: "text-hongbao-brown-600! dark:text-night-brown!",
    blob: "bg-hongbao-brown-200/40!",
  },
  cream: {
    tile: "from-hongbao-cream-600! to-hongbao-brown-500!",
    glow: "hover:shadow-[0_20px_45px_-20px_rgba(191,133,94,0.55)]!",
    border: "hover:border-hongbao-cream-500!",
    count: "text-hongbao-cream-900! dark:text-night-brown!",
    blob: "bg-hongbao-cream-400/40!",
  },
};

const StatusCard: React.FC<Props> = ({
  count,
  title,
  icon: Icon,
  color = "red",
}) => {
  const accent = accents[color];

  return (
    <Paper
      p={{ base: 18, sm: 28, md: 32 }}
      bdrs={20}
      withBorder
      className={`group! relative! overflow-hidden! h-full! text-center! bg-surface! border-gray-200! transition-all! duration-300! ease-out! hover:-translate-y-1.5! ${accent.border} ${accent.glow}`}
    >
      {/* colour wash that blooms on hover */}
      <Box
        className={`pointer-events-none absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${accent.blob}`}
      />

      <Stack align="center" className="relative! gap-3! sm:gap-5!">
        <Box
          className={`flex! items-center! justify-center! shrink-0! w-12! h-12! sm:w-16! sm:h-16! rounded-2xl! bg-gradient-to-br! ${accent.tile} text-white! shadow-md! transition-transform! duration-300! ease-out! group-hover:scale-110!`}
        >
          <Icon className="w-[22px]! h-[22px]! sm:w-[30px]! sm:h-[30px]!" />
        </Box>

        {count ? (
          <Stack gap={2} align="center">
            <Text fw={800} className={`text-2xl! sm:text-3xl! ${accent.count}`}>
              {count}+
            </Text>
            <Text
              fw={600}
              c={"gray.7"}
              className="text-xs! sm:text-sm! leading-snug!"
            >
              {title}
            </Text>
          </Stack>
        ) : (
          <Text
            fw={700}
            c={"gray.8"}
            className="text-xs! sm:text-base! leading-snug!"
          >
            {title}
          </Text>
        )}
      </Stack>
    </Paper>
  );
};

export default StatusCard;
