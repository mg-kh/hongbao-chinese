import { RichTextEditor, useRichTextEditorContext } from "@mantine/tiptap";
import { FilePdfIcon } from "@phosphor-icons/react";
import { memo } from "react";

const PdfControl: React.FC = () => {
  const { editor } = useRichTextEditorContext();

  return (
    <RichTextEditor.Control
      onClick={() => editor?.chain().focus().insertPdfPlaceholder().run()}
      aria-label="Insert PDF"
      title="Insert PDF"
    >
      <FilePdfIcon size={16} />
    </RichTextEditor.Control>
  );
};

export default memo(PdfControl);
