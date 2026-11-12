import { CloseButton } from "@mantine/core";
import { NodeViewWrapper, type ReactNodeViewProps } from "@tiptap/react";

const PdfView: React.FC<ReactNodeViewProps<HTMLDivElement>> = ({
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
    <NodeViewWrapper className="group relative inline-block">
      <a
        href={node.attrs.src}
        download={node.attrs.name}
        data-type="pdf-attachment"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="rte-pdf-chip-icon">📄</span>
        <span className="rte-pdf-chip-name">
          {node.attrs.name || "PDF file"}
        </span>
      </a>

      {editor.isEditable && (
        <CloseButton
          onClick={handleDelete}
          aria-label="Remove PDF"
          size="sm"
          className="absolute! -top-2! -right-2! rounded-full! border! bg-gray-100! opacity-0 pointer-events-none transition-opacity duration-150 group-hover:opacity-100 group-hover:pointer-events-auto [.ProseMirror[contenteditable=false]_&]:hidden!"
        />
      )}
    </NodeViewWrapper>
  );
};

export default PdfView;
