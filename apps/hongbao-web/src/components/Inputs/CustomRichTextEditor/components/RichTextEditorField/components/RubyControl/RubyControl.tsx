import { Button, Group, Popover, TextInput } from "@mantine/core";
import { RichTextEditor, useRichTextEditorContext } from "@mantine/tiptap";
import { memo, useState } from "react";

import RubyIcon from "./RubyIcon";

const RubyControl: React.FC = () => {
  const { editor } = useRichTextEditorContext();
  const [opened, setOpened] = useState(false);
  const [value, setValue] = useState("");

  const isActive = editor?.isActive("ruby") ?? false;

  const handleOpen = () => {
    setValue((editor?.getAttributes("ruby").rt as string) || "");
    setOpened(true);
  };

  const handleSave = () => {
    if (value.trim()) {
      editor?.chain().focus().setRuby(value.trim()).run();
    } else {
      editor?.chain().focus().unsetRuby().run();
    }
    setOpened(false);
  };

  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      withArrow
      trapFocus
      withinPortal={false}
    >
      <Popover.Target>
        <RichTextEditor.Control
          onClick={handleOpen}
          active={isActive}
          aria-label="Ruby text (pinyin)"
          title="Ruby text (pinyin)"
        >
          <RubyIcon size={16} />
        </RichTextEditor.Control>
      </Popover.Target>

      <Popover.Dropdown>
        <Group gap={4}>
          <TextInput
            placeholder="e.g. hàn"
            value={value}
            onChange={(event) => setValue(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleSave();
              }
            }}
            autoFocus
          />
          <Button size="sm" onClick={handleSave}>
            Save
          </Button>
        </Group>
      </Popover.Dropdown>
    </Popover>
  );
};

export default memo(RubyControl);
