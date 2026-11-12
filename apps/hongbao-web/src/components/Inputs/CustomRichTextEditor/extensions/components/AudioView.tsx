import { CloseButton } from "@mantine/core";
import { NodeViewWrapper, type ReactNodeViewProps } from "@tiptap/react";

const AudioView: React.FC<ReactNodeViewProps<HTMLDivElement>> = ({
  node,
  editor,
  getPos,
}) => {
  const handleDelete = () => {
    const pos = getPos();
    if (pos === undefined) return;
    editor
      .chain()
      .focus()
      .deleteRange({ from: pos, to: pos + 1 })
      .run();
  };

  return (
    // The audio element is styled `display: block; width: 100%` globally (see
    // globals.css) - an `inline-block` wrapper here would shrink-to-fit around
    // that 100%-wide child, a circular size dependency CSS leaves undefined
    // and that browsers commonly resolve by collapsing the box to 0 width.
    <NodeViewWrapper className="group relative block">
      <audio src={node.attrs.src} controls data-type="audio" />

      {editor.isEditable && (
        <CloseButton
          onClick={handleDelete}
          aria-label="Remove audio"
          size="sm"
          className="absolute! -top-2! -right-2! rounded-full! border! bg-gray-100! opacity-0 pointer-events-none transition-opacity duration-150 group-hover:opacity-100 group-hover:pointer-events-auto [.ProseMirror[contenteditable=false]_&]:hidden!"
        />
      )}
    </NodeViewWrapper>
  );
};

export default AudioView;
