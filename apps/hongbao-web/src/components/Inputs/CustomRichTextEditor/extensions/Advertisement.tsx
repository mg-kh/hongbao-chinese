import { Card, Stack, Text } from "@mantine/core";
import { mergeAttributes, Node } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer, type ReactNodeViewProps } from "@tiptap/react";
import { MegaphoneSimpleIcon } from "@phosphor-icons/react";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    advertisement: {
      insertAdvertisement: () => ReturnType;
    };
  }
}

const AdvertisementView: React.FC<ReactNodeViewProps<HTMLDivElement>> = ({ selected }) => {
  return (
    <NodeViewWrapper data-type="advertisement" data-drag-handle draggable="true">
      <Card
        withBorder
        radius="md"
        padding="lg"
        bg="var(--mantine-color-gray-0)"
        style={{
          borderStyle: "dashed",
          cursor: "grab",
          outline: selected ? "2px solid var(--mantine-color-blue-5)" : undefined,
        }}
      >
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
    </NodeViewWrapper>
  );
};

const Advertisement = Node.create({
  name: "advertisement",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  parseHTML() {
    return [{ tag: 'div[data-type="advertisement"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-type": "advertisement" })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(AdvertisementView);
  },

  addCommands() {
    return {
      // Inserts after the current selection end rather than replacing it -
      // see createMediaPlaceholder.tsx for why (a NodeSelection left behind
      // by a previously inserted atom would otherwise get silently deleted).
      insertAdvertisement:
        () =>
        ({ state, commands }) =>
          commands.insertContentAt(state.selection.to, { type: this.name }),
    };
  },
});

export default Advertisement;
