import { RichTextEditor, useRichTextEditorContext } from "@mantine/tiptap";
import { MegaphoneSimpleIcon } from "@phosphor-icons/react";
import { memo } from "react";

const AdvertisementControl: React.FC = () => {
  const { editor } = useRichTextEditorContext();

  return (
    <RichTextEditor.Control
      onClick={() => editor?.chain().focus().insertAdvertisement().run()}
      aria-label="Insert advertisement"
      title="Insert advertisement"
    >
      <MegaphoneSimpleIcon size={16} />
    </RichTextEditor.Control>
  );
};

export default memo(AdvertisementControl);
