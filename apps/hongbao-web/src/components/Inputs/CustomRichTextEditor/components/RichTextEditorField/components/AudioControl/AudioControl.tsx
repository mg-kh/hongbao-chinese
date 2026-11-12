import { RichTextEditor, useRichTextEditorContext } from "@mantine/tiptap";
import { MusicNotesIcon } from "@phosphor-icons/react";
import { memo } from "react";

const AudioControl: React.FC = () => {
  const { editor } = useRichTextEditorContext();

  return (
    <RichTextEditor.Control
      onClick={() => editor?.chain().focus().insertAudioPlaceholder().run()}
      aria-label="Insert audio"
      title="Insert audio"
    >
      <MusicNotesIcon size={16} />
    </RichTextEditor.Control>
  );
};

export default memo(AudioControl);
