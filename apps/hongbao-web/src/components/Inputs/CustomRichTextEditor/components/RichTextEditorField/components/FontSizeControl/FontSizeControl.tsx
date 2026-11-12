import { Select } from "@mantine/core";
import { useRichTextEditorContext } from "@mantine/tiptap";
import { memo } from "react";

const FONT_SIZES = ["12px", "14px", "16px", "18px", "20px", "24px", "28px", "32px"];

const FontSizeControl: React.FC = () => {
  const { editor } = useRichTextEditorContext();

  const value = (editor?.getAttributes("textStyle").fontSize as string) || null;

  const handleChange = (next: string | null) => {
    if (next) {
      editor?.chain().focus().setFontSize(next).run();
    } else {
      editor?.chain().focus().unsetFontSize().run();
    }
  };

  return (
    <Select
      aria-label="Font size"
      placeholder="Size"
      size="xs"
      w={80}
      data={FONT_SIZES}
      value={value}
      onChange={handleChange}
      clearable
      comboboxProps={{ withinPortal: false }}
    />
  );
};

export default memo(FontSizeControl);
