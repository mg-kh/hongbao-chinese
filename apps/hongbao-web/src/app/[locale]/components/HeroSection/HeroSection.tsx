import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Stack,
  Text,
} from "@mantine/core";
import { IconArrowRight, IconSparkles } from "@tabler/icons-react";
import RubyButtonComponent from "@/components/Buttons/RubyButtonComponent/RubyButtonComponent";
import { Link } from "@/i18n/navigation";
import ToolsPreviewSection from "../ToolsPreviewSection/ToolsPreviewSection";

const HeroSection = () => {
  return (
    <Box
      bg={"#fff8f2"}
      className="relative overflow-hidden bg-[radial-gradient(circle_at_1px_1px,rgba(140,21,21,0.07)_1px,transparent_0)] bg-[length:28px_28px]"
    >
      <Box className="pointer-events-none absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full bg-hongbao-gold-200/50 blur-3xl" />
      <Box className="pointer-events-none absolute top-1/3 -left-40 w-[380px] h-[380px] rounded-full bg-hongbao-red-100/60 blur-3xl" />

      <Container size={"xl"} px={{ base: 16, sm: 24 }} className="relative">
        <Flex
          align="center"
          gap={{ base: 40, lg: 50 }}
          direction={{ base: "column", lg: "row" }}
          className="min-h-[calc(100vh-80px)]! py-16! lg:py-0!"
        >
          <Stack className="w-full lg:w-6/12 lg:shrink-0!" gap={20}>
            <Badge
              color="hongbao-red.0"
              c={"hongbao-red"}
              mb={5}
              size="lg"
              className="w-fit! shadow-sm!"
              leftSection={<IconSparkles size={15} />}
            >
              Trusted by 248,000+ learners worldwide
            </Badge>
            <Stack gap={10}>
              <Text
                fw={800}
                c={"hongbao-red"}
                className="text-4xl! sm:text-5xl! lg:text-[3.4rem]! leading-tight!"
              >
                Master Chinese.
              </Text>
              <Text
                fw={800}
                className="text-4xl! sm:text-5xl! lg:text-[3.4rem]! leading-tight!"
              >
                From HSK 1 to 5.
              </Text>
            </Stack>
            <Text size="lg" c={"gray.7"} className="max-w-[520px]!">
              The world's most complete Mandarin platform — structured HSK
              curriculum, AI-powered tone coaching, and adaptive lessons that
              take you from your very first character to full native fluency.
            </Text>
            <div className="grid! grid-cols-2! sm:flex! gap-3! sm:gap-4! pt-2! w-full! sm:w-auto!">
              <RubyButtonComponent
                size="xl"
                className="w-full! sm:w-auto! max-sm:h-auto! max-sm:px-3! max-sm:py-2! max-sm:text-sm!"
                styles={{
                  label: {
                    whiteSpace: "normal",
                    textAlign: "center",
                    lineHeight: 1.3,
                  },
                }}
              >
                သင်ခန်းစာများ
              </RubyButtonComponent>
              {/* Wrapped rather than `component={Link}` - this is a server
                  component, and a component passed as a prop can't cross the
                  server/client boundary. */}
              <Link
                href="/level-test"
                className="no-underline! w-full! sm:w-auto!"
              >
                <Button
                  size="xl"
                  variant="outline"
                  color="hongbao-red"
                  className="w-full! sm:w-auto! max-sm:h-auto! max-sm:px-3! max-sm:py-2! max-sm:text-sm! bg-white/70! backdrop-blur-sm! transition-colors! duration-200!"
                  styles={{
                    label: {
                      whiteSpace: "normal",
                      textAlign: "center",
                      lineHeight: 1.3,
                    },
                  }}
                  rightSection={
                    <IconArrowRight className="hidden! sm:inline-block!" />
                  }
                >
                  Level test စစ်ရန်
                </Button>
              </Link>
            </div>
          </Stack>
          <Box className="w-full lg:w-6/12 relative">
            <Box className="pointer-events-none absolute -inset-4 rounded-[32px] bg-gradient-to-tr from-hongbao-red-100/40 via-hongbao-gold-100/30 to-transparent blur-2xl" />
            <Box className="relative">
              <ToolsPreviewSection />
            </Box>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default HeroSection;
