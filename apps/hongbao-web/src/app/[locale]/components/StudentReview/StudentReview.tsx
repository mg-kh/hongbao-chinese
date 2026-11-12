"use client";

import QuoteMarkIcon from "@/components/icons/QuoteMarkIcon";
import {
  Avatar,
  Box,
  Container,
  Divider,
  Group,
  Space,
  Stack,
  Text,
} from "@mantine/core";
import { CaretLeftIcon, CaretRightIcon, StarIcon } from "@phosphor-icons/react";
import { useState } from "react";
import SectionTitle from "../../../../components/SectionTitle/SectionTitle";

const PAGE_SIZE = 6;

const feedbacks = [
  {
    id: 1,
    name: "Alice Chen",
    role: "Student",
    content: "This platform helped me pass HSK4 in just 3 months!",
  },
  {
    id: 2,
    name: "Kevin",
    role: "Frontend Dev",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero dolorem praesentium in cupiditate. Cumque vitae sint illum accusamus excepturi minus.",
  },
  {
    id: 3,
    name: "Maria Lopez",
    role: "Teacher",
    content: "Great structured lessons and quizzes.",
  },
  {
    id: 4,
    name: "John Tan",
    role: "Designer",
    content: "The UX feels smooth and intuitive.",
  },
  {
    id: 5,
    name: "Aung Aung",
    role: "Student",
    content: "I love the pronunciation practice feature!",
  },
];

type Accent = "red" | "gold" | "orange" | "maroon" | "brown";

/** Same gradient pairing used by StatusCard's icon tiles, for cross-section consistency. */
const accents: Record<
  Accent,
  { tile: string; border: string; ring: string; glow: string }
> = {
  red: {
    tile: "from-hongbao-red-500! to-hongbao-maroon-600!",
    border: "hover:border-hongbao-red-200!",
    ring: "ring-hongbao-red-100!",
    glow: "hover:shadow-[0_24px_50px_-20px_rgba(245,34,45,0.3)]!",
  },
  gold: {
    tile: "from-hongbao-gold-500! to-hongbao-orange-600!",
    border: "hover:border-hongbao-gold-300!",
    ring: "ring-hongbao-gold-100!",
    glow: "hover:shadow-[0_24px_50px_-20px_rgba(230,185,60,0.35)]!",
  },
  orange: {
    tile: "from-hongbao-orange-500! to-hongbao-red-600!",
    border: "hover:border-hongbao-orange-200!",
    ring: "ring-hongbao-orange-100!",
    glow: "hover:shadow-[0_24px_50px_-20px_rgba(242,106,27,0.3)]!",
  },
  maroon: {
    tile: "from-hongbao-maroon-500! to-hongbao-brown-700!",
    border: "hover:border-hongbao-maroon-200!",
    ring: "ring-hongbao-maroon-100!",
    glow: "hover:shadow-[0_24px_50px_-20px_rgba(122,31,31,0.3)]!",
  },
  brown: {
    tile: "from-hongbao-brown-500! to-hongbao-maroon-700!",
    border: "hover:border-hongbao-brown-200!",
    ring: "ring-hongbao-brown-100!",
    glow: "hover:shadow-[0_24px_50px_-20px_rgba(115,61,34,0.3)]!",
  },
};

const accentOrder: Accent[] = ["red", "gold", "orange", "maroon", "brown"];

/**
 * Assigns a card colour from the feedback's own id, so any newly added
 * feedback gets one automatically with no colour to define per item.
 *
 * Deliberately a hash of the id rather than Math.random(): a real random call
 * would produce different colours on the server and the client and break
 * hydration, and would also re-roll the whole grid on every re-render (paging,
 * state changes). Hashing keeps the spread effectively random-looking while
 * staying stable for a given feedback.
 */
const getAccent = (seed: string | number): Accent => {
  const key = String(seed);
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) | 0;
  }
  return accentOrder[Math.abs(hash) % accentOrder.length];
};

/** Row of 5 filled stars - the rating is always presented at full marks. */
const StarRow: React.FC<{ size?: number }> = ({ size = 13 }) => (
  <div className="flex! gap-0.5!">
    {Array.from({ length: 5 }).map((_, i) => (
      <StarIcon
        key={i}
        size={size}
        weight="fill"
        className="text-hongbao-gold-500!"
      />
    ))}
  </div>
);

const StudentReview = () => {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(feedbacks.length / PAGE_SIZE);
  const visibleFeedbacks = feedbacks.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE,
  );

  return (
    <Box>
      {/* full-bleed backdrop - spans the viewport edge to edge, distinct from
          the plain-white bands around it, giving the white testimonial cards
          a tinted backdrop to pop against */}
      <Box className="relative! overflow-hidden! bg-gradient-to-b! from-hongbao-cream-50! via-[#fffaf5]! to-white!">
        <Box className="pointer-events-none absolute inset-0 opacity-90! bg-[radial-gradient(circle_at_1px_1px,rgba(140,21,21,0.055)_1px,transparent_0)]! bg-[length:28px_28px]!" />
        <Box className="pointer-events-none absolute top-0 left-[10%] w-[420px] h-[420px] rounded-full bg-hongbao-gold-200/25 blur-[110px]!" />
        <Box className="pointer-events-none absolute top-1/3 right-[4%] w-[360px] h-[360px] rounded-full bg-hongbao-orange-200/20 blur-[110px]!" />
        <Box className="pointer-events-none absolute bottom-0 left-[22%] w-[420px] h-[420px] rounded-full bg-hongbao-red-100/30 blur-[110px]!" />

        <Container
          size={"xl"}
          px={{ base: 16, sm: 24 }}
          className="relative!"
        >
          <Box className="py-14! sm:py-20! md:py-24!">
            <SectionTitle
              eyebrow="Testimonials"
              title="Our Student Feedbacks"
              subtitle="Real stories from learners who went from their first character to real confidence with Hong Bao."
              align="center"
            />

            <Space h={28} />

            {/* trust bar */}
            <div className="flex! justify-center!">
              <div className="flex! flex-col! sm:flex-row! items-center! gap-3! sm:gap-4! max-w-full! rounded-2xl! sm:rounded-full! border! border-gray-200! bg-white! px-5! sm:px-6! py-4! sm:py-3! shadow-sm!">
                <div className="flex! shrink-0!">
                  {feedbacks.slice(0, 5).map((item, index) => (
                    <Avatar
                      key={item.id}
                      src="./assets/logo-head.svg"
                      size={34}
                      radius="xl"
                      bg={"hongbao-red.0"}
                      p={5}
                      className={`ring-2! ring-white! ${index === 0 ? "" : "-ml-2.5!"}`}
                      style={{ zIndex: 5 - index }}
                    />
                  ))}
                </div>
                <Divider
                  orientation="vertical"
                  className="hidden! sm:block!"
                  color="gray.2"
                />
                {/* rating stacks above the label on mobile so the sentence never
                    breaks mid-phrase inside the pill */}
                <div className="flex! flex-col! sm:flex-row! items-center! gap-1! sm:gap-2! min-w-0!">
                  <Group gap={8} wrap="nowrap">
                    <StarRow size={15} />
                    <Text size="sm" fw={800} c="gray.8">
                      4.9
                    </Text>
                  </Group>
                  <Text size="sm" c="gray.5" ta="center" className="text-balance!">
                    <span className="hidden! sm:inline!">· </span>Loved by
                    248,000+ learners
                  </Text>
                </div>
              </div>
            </div>

            <Space h={48} />

            <div
              key={page}
              className="grid grid-cols-1! sm:grid-cols-2! lg:grid-cols-3! gap-5! sm:gap-6!"
            >
              {visibleFeedbacks.map((item, localIndex) => {
                const accent = accents[getAccent(item.id)];

                return (
                  <Box
                    key={item.id}
                    style={{ animationDelay: `${localIndex * 70}ms` }}
                    className={`group relative! flex! flex-col! h-full! overflow-hidden! rounded-3xl! border! border-gray-200! bg-white! p-6! sm:p-7! shadow-sm! ${accent.border} ${accent.glow} transition-all! duration-300! ease-out! hover:-translate-y-1.5! [animation:fade-up_0.55s_ease-out_both]`}
                  >
                    {/* accent top edge */}
                    <Box
                      className={`absolute! inset-x-0! top-0! h-1! bg-gradient-to-r! ${accent.tile}`}
                    />

                    <Group justify="space-between" align="flex-start" mb={18}>
                      <StarRow />
                      <div
                        className={`flex! items-center! justify-center! shrink-0! w-9! h-9! rounded-xl! bg-gradient-to-br! ${accent.tile} text-white! shadow-sm! transition-transform! duration-300! ease-out! group-hover:scale-110! group-hover:rotate-6!`}
                      >
                        <QuoteMarkIcon
                          width={16}
                          height={16}
                          className="text-white!"
                        />
                      </div>
                    </Group>

                    <Text
                      c={"gray.7"}
                      className="flex-1! leading-relaxed! text-[15px]!"
                      lineClamp={5}
                    >
                      {item?.content}
                    </Text>

                    <Divider my={18} color="gray.1" />

                    <Group gap={12} wrap="nowrap">
                      <Avatar
                        variant="filled"
                        radius="xl"
                        src="./assets/logo-head.svg"
                        size={44}
                        p={8}
                        className={`bg-hongbao-red-50! ring-2! ring-offset-2! ${accent.ring}`}
                      />
                      <Stack gap={0} className="min-w-0!">
                        <Text fw={700} size="sm" lineClamp={1}>
                          {item.name}
                        </Text>
                        <Text size="xs" c={"gray.5"} lineClamp={1}>
                          {item.role}
                        </Text>
                      </Stack>
                    </Group>
                  </Box>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex! items-center! justify-center! gap-5! pt-12!">
                <button
                  type="button"
                  aria-label="Previous feedbacks"
                  disabled={page === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  className="flex! items-center! justify-center! w-11! h-11! rounded-full! border! border-gray-300! bg-white! text-gray-700! transition-all! duration-200! ease-out! hover:border-hongbao-red-300! hover:text-hongbao-red-600! hover:-translate-x-0.5! disabled:opacity-40! disabled:hover:border-gray-300! disabled:hover:text-gray-700! disabled:hover:translate-x-0! disabled:cursor-not-allowed! cursor-pointer!"
                >
                  <CaretLeftIcon size={16} weight="bold" />
                </button>

                <div className="flex! items-center! gap-2!">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Go to page ${i + 1}`}
                      aria-current={i === page}
                      onClick={() => setPage(i)}
                      className={`h-2! rounded-full! transition-all! duration-300! ease-out! cursor-pointer! ${
                        i === page
                          ? "w-6! bg-hongbao-red-500!"
                          : "w-2! bg-gray-300! hover:bg-gray-400!"
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  aria-label="Next feedbacks"
                  disabled={page === totalPages - 1}
                  onClick={() =>
                    setPage((p) => Math.min(totalPages - 1, p + 1))
                  }
                  className="flex! items-center! justify-center! w-11! h-11! rounded-full! border! border-gray-300! bg-white! text-gray-700! transition-all! duration-200! ease-out! hover:border-hongbao-red-300! hover:text-hongbao-red-600! hover:translate-x-0.5! disabled:opacity-40! disabled:hover:border-gray-300! disabled:hover:text-gray-700! disabled:hover:translate-x-0! disabled:cursor-not-allowed! cursor-pointer!"
                >
                  <CaretRightIcon size={16} weight="bold" />
                </button>
              </div>
            )}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default StudentReview;
