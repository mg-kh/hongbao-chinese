import { RichTextEditor, useRichTextEditorContext } from "@mantine/tiptap";
import { ImageIcon } from "@phosphor-icons/react";
import { memo } from "react";

const ImageControl: React.FC = () => {
  const { editor } = useRichTextEditorContext();

  return (
    <RichTextEditor.Control
      onClick={() => editor?.chain().focus().insertImagePlaceholder().run()}
      aria-label="Insert image"
      title="Insert image"
    >
      <ImageIcon size={16} />
    </RichTextEditor.Control>
  );
};

export default memo(ImageControl);
