import RubyButtonComponent from "@/components/Buttons/RubyButtonComponent/RubyButtonComponent";
import {
  Badge,
  Box,
  Button,
  Container,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import { IconArrowRight, IconFlame, IconStarFilled } from "@tabler/icons-react";

const BeginYourJourneyBanner = () => {
  return (
    <Box
      bg={"#23192c"}
      className="relative! overflow-hidden! py-20! md:py-32! lg:py-[150px]! bg-[linear-gradient(120deg,#23192c,#3a1a2e,#4a1620,#2b1424,#23192c)]! bg-[length:300%_300%]! motion-safe:animate-[journey-gradient-pan_16s_ease-in-out_infinite]!"
    >
      <Box className="pointer-events-none absolute inset-0 opacity-60! bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)]! bg-[length:26px_26px]!" />
      <Box className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-hongbao-red-600/25 blur-3xl" />
      <Box className="pointer-events-none absolute -bottom-24 -right-24 w-[320px] h-[320px] rounded-full bg-hongbao-gold-500/15 blur-3xl" />

      <Container size={"sm"} px={{ base: 20, sm: 24 }} className="relative!">
        <Stack
          align="center"
          gap={20}
          className="text-center! gap-5! sm:gap-[26px]!"
        >
          <Badge
            color="hongbao-red.0"
            c={"hongbao-red"}
            leftSection={<IconFlame size={16} />}
            size="md"
            className="shadow-[0_8px_20px_-8px_rgba(0,0,0,0.35)]! max-w-full!"
            styles={{
              root: { height: "auto", paddingTop: 8, paddingBottom: 8 },
              label: {
                whiteSpace: "normal",
                overflow: "visible",
                textOverflow: "unset",
                lineHeight: 1.3,
              },
            }}
          >
            Start today — basic lessons are free
          </Badge>

          <Text
            fw={"bold"}
            c={"white"}
            className="text-[2.25rem]! sm:text-[3.25rem]! lg:text-[3.75rem]! leading-[1.12]! tracking-tight! text-balance!"
          >
            Your Chinese journey begins right now
          </Text>

          <Text
            size="lg"
            c={"gray.4"}
            className="max-w-[500px]! leading-relaxed!"
          >
            Join thousands of learners mastering Mandarin with structured HSK
            courses, AI-powered tone coaching, and lessons that fit your
            schedule.
          </Text>

          <Group
            gap={12}
            wrap="nowrap"
            className="w-full! flex-col! sm:flex-row! sm:w-auto! pt-2!"
          >
            <RubyButtonComponent size="xl" className="w-full! sm:w-auto!">
              Start with basics
            </RubyButtonComponent>
            <Button
              size="xl"
              variant="outline"
              color="white"
              className="w-full! sm:w-auto! transition-colors! duration-200! hover:bg-white/10!"
              rightSection={<IconArrowRight size={18} />}
            >
              View all courses
            </Button>
          </Group>

          <Text size="xs" c="gray.5" className="opacity-80!">
            No card required to start — upgrade anytime as you progress.
          </Text>

          <Group gap={10} wrap="nowrap" mt={4}>
            <Group gap={2} wrap="nowrap">
              {Array.from({ length: 5 }).map((_, i) => (
                <IconStarFilled
                  key={i}
                  size={14}
                  className="text-hongbao-gold-300!"
                />
              ))}
            </Group>
            <Text size="xs" fw={600} c="gray.4">
              Loved by 248,000+ learners worldwide
            </Text>
          </Group>
        </Stack>
      </Container>
    </Box>
  );
};

export default BeginYourJourneyBanner;
