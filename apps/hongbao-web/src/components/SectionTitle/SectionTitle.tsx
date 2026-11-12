import { Box, Stack, Text, Title } from "@mantine/core";

interface Props {
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  align?: "left" | "center";
}

const SectionTitle: React.FC<Props> = ({
  title,
  subtitle,
  eyebrow,
  align = "left",
}) => {
  const isCenter = align === "center";

  return (
    <Stack
      gap={14}
      align={isCenter ? "center" : undefined}
      className={isCenter ? "text-center!" : undefined}
    >
      {eyebrow && (
        <Text
          fw={700}
          size="xs"
          c="hongbao-red.6"
          className="uppercase! tracking-[0.18em]!"
        >
          {eyebrow}
        </Text>
      )}
      <Box className="h-[3px]! w-12! rounded-full! bg-gradient-to-r! from-hongbao-red-500! to-hongbao-gold-500!" />
      <Title
        order={1}
        c="hongbao-red.7"
        className="text-[1.85rem]! sm:text-[2.25rem]! font-extrabold! tracking-tight! leading-[1.15]!"
      >
        {title}
      </Title>
      {subtitle && (
        <Text
          size="md"
          c="gray.6"
          className={`max-w-[560px]! leading-relaxed! ${isCenter ? "mx-auto!" : ""}`}
        >
          {subtitle}
        </Text>
      )}
    </Stack>
  );
};

export default SectionTitle;
