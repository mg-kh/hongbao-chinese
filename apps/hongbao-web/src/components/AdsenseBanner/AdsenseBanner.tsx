import { Card, Stack, Text } from "@mantine/core";
import { MegaphoneSimpleIcon } from "@phosphor-icons/react";

/**
 * Rendered wherever a published `advertisement` node (from CustomRichTextEditor)
 * appears in content. Kept script-free for now - swap the placeholder body for
 * the real AdSense embed here once ad slots are configured, without touching
 * the editor or content-parsing code that reference this component.
 */
const AdsenseBanner: React.FC = () => {
  return (
    <Card withBorder radius="md" padding="lg" bg="var(--mantine-color-gray-0)">
      <Stack align="center" gap={4}>
        <MegaphoneSimpleIcon size={28} color="var(--mantine-color-dimmed)" />
        <Text fw={600} size="sm">
          Advertisement
        </Text>
        <Text size="xs" c="dimmed">
          Google AdSense will appear here
        </Text>
      </Stack>
    </Card>
  );
};

export default AdsenseBanner;
