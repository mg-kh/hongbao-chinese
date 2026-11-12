import { showErrorNoti } from "@/utils/notifications-helper";
import { Group, Input, Switch } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { RichTextEditor } from "@mantine/tiptap";
import "@mantine/tiptap/styles.css";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyleKit } from "@tiptap/extension-text-style";
import type { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { useEditor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
import Advertisement from "../../extensions/Advertisement";
import Audio from "../../extensions/Audio";
import AudioPlaceholder from "../../extensions/AudioPlaceholder";
import ImagePlaceholder from "../../extensions/ImagePlaceholder";
import PdfAttachment from "../../extensions/PdfAttachment";
import PdfPlaceholder from "../../extensions/PdfPlaceholder";
import ResizableImage from "../../extensions/ResizableImage";
import Ruby from "../../extensions/Ruby";
import useMediaStorage from "../../services/mediaStorage";
import {
  ALL_RICH_TEXT_EDITOR_COMMANDS,
  RichTextEditorCommand,
} from "../../types/richTextEditor.type";
import AdvertisementControl from "./components/AdvertisementControl/AdvertisementControl";
import AudioControl from "./components/AudioControl/AudioControl";
import FontSizeControl from "./components/FontSizeControl/FontSizeControl";
import ImageControl from "./components/ImageControl/ImageControl";
import PdfControl from "./components/PdfControl/PdfControl";
import RubyControl from "./components/RubyControl/RubyControl";

// Nodes whose deletion (button, backspace, cut, selection replace...) should
// delete the underlying R2 object - each carries a `mediaId` attribute.
const TRACKED_MEDIA_NODE_TYPES = ["image", "audio", "pdfAttachment"];

const collectMediaIds = (doc: ProseMirrorNode) => {
  const ids = new Set<string>();
  doc.descendants((node) => {
    if (
      TRACKED_MEDIA_NODE_TYPES.includes(node.type.name) &&
      node.attrs.mediaId
    ) {
      ids.add(node.attrs.mediaId);
    }
  });
  return ids;
};

/**
 * Declared once at module scope (not per render): `useEditor` re-runs
 * `editor.setOptions()` whenever this array (or its entries) isn't
 * reference-equal to the previous render's, so recreating it inline would
 * reconfigure the editor on every keystroke.
 */
const editorExtensions = [
  StarterKit.configure({
    code: false,
    codeBlock: false,
    heading: false,
    horizontalRule: false,
    link: {
      openOnClick: false,
    },
  }),
  Ruby,
  ResizableImage.configure({
    allowBase64: true,
    directions: ["top-left", "top-right", "bottom-left", "bottom-right"],
    minWidth: 40,
    minHeight: 40,
  }),
  ImagePlaceholder,
  Audio,
  AudioPlaceholder,
  PdfAttachment,
  PdfPlaceholder,
  Advertisement,
  TextStyleKit.configure({
    color: false,
    backgroundColor: false,
    fontFamily: false,
    lineHeight: false,
  }),
  TextAlign.configure({
    types: ["paragraph", "blockquote", "image"],
    alignments: ["left", "center", "right"],
  }),
];

interface Props {
  value?: string;
  onChange: (value: string) => void;
  label?: React.ReactNode;
  error?: React.ReactNode;
  minHeight?: number;
  commands?: RichTextEditorCommand[];
  showHeader?: boolean;
}

const RichTextEditorField: React.FC<Props> = ({
  value,
  onChange,
  label,
  error,
  minHeight = 200,
  commands = ALL_RICH_TEXT_EDITOR_COMMANDS,
  showHeader,
}) => {
  // Only used to seed the editor once - later external updates go through
  // the sync effect below, so this must not track `value` on every render.
  const [initialValue] = useState(value);
  const [isPreview, setIsPreview] = useState(false);
  const { deleteMedia } = useMediaStorage();

  const isEnabled = (command: RichTextEditorCommand) =>
    commands.includes(command);
  const anyEnabled = (...cmds: RichTextEditorCommand[]) => cmds.some(isEnabled);

  // getHTML() re-serializes the whole document - expensive once images (kept
  // as inline base64 data URLs) are in the content - and firing it straight
  // into the parent's onChange on every keystroke re-renders the surrounding
  // form each time too. Debouncing keeps typing itself smooth; flushOnUnmount
  // plus the onBlur flush below make sure the final value is never dropped.
  const debouncedOnChange = useDebouncedCallback(onChange, {
    delay: 300,
    flushOnUnmount: true,
  });

  const editor = useEditor({
    immediatelyRender: false,
    extensions: editorExtensions,
    content: initialValue || "",
    onUpdate: ({ editor: updatedEditor }) => {
      debouncedOnChange(updatedEditor.getHTML());
    },
    onBlur: ({ editor: blurredEditor }) => {
      debouncedOnChange.flush();
      onChange(blurredEditor.getHTML());
    },
    // Single place that decides a media node was actually removed from the
    // doc (button, backspace, cut, selection replace...) and deletes it from
    // R2 exactly once. Skipped for `preventUpdate` transactions (set by
    // `setContent(value, { emitUpdate: false })` below) so switching records
    // never triggers a false mass-delete.
    onTransaction: ({ transaction }) => {
      if (!transaction.docChanged || transaction.getMeta("preventUpdate"))
        return;

      const before = collectMediaIds(transaction.before);
      const after = collectMediaIds(transaction.doc);

      before.forEach((id) => {
        if (after.has(id)) return;
        deleteMedia(id).catch(() =>
          showErrorNoti("Failed to delete media file"),
        );
      });
    },
  });

  useEffect(() => {
    if (!editor || editor.isFocused) return;

    const currentHtml = editor.getHTML();
    if ((value || "") !== currentHtml) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  // Preview reuses the same editor/DOM (same ProseMirror content, same CSS)
  // instead of re-rendering the HTML separately, so it can never drift from
  // what editing shows - it just flips the editor read-only and hides the
  // controls that mutate it.
  useEffect(() => {
    editor?.setEditable(!isPreview);
  }, [isPreview, editor]);

  // The bubble menu's own shouldShow only re-runs on selection/doc changes,
  // so Escape needs to explicitly collapse the selection - that then makes
  // shouldShow's `empty` check hide the menu.
  useEffect(() => {
    if (!editor) return;

    const dom = editor.view.dom;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !editor.state.selection.empty) {
        editor.commands.setTextSelection(editor.state.selection.to);
      }
    };

    dom.addEventListener("keydown", handleKeyDown);
    return () => dom.removeEventListener("keydown", handleKeyDown);
  }, [editor]);

  return (
    <Input.Wrapper
      label={
        <Group justify="space-between" wrap="nowrap">
          <Input.Label>{label}</Input.Label>
          <Switch
            size="xs"
            label="Preview"
            labelPosition="left"
            checked={isPreview}
            onChange={(event) => setIsPreview(event.currentTarget.checked)}
          />
        </Group>
      }
      error={error}
    >
      <RichTextEditor editor={editor} variant="default" mih={minHeight}>
        {!isPreview && (
          <>
            {showHeader && (
              <RichTextEditor.Toolbar sticky stickyOffset={0}>
                {anyEnabled("bold", "italic", "underline", "strike") && (
                  <RichTextEditor.ControlsGroup>
                    {isEnabled("bold") && <RichTextEditor.Bold />}
                    {isEnabled("italic") && <RichTextEditor.Italic />}
                    {isEnabled("underline") && <RichTextEditor.Underline />}
                    {isEnabled("strike") && <RichTextEditor.Strikethrough />}
                  </RichTextEditor.ControlsGroup>
                )}

                {isEnabled("fontSize") && (
                  <RichTextEditor.ControlsGroup>
                    <FontSizeControl />
                  </RichTextEditor.ControlsGroup>
                )}

                {anyEnabled("bulletList", "orderedList", "blockquote") && (
                  <RichTextEditor.ControlsGroup>
                    {isEnabled("bulletList") && <RichTextEditor.BulletList />}
                    {isEnabled("orderedList") && <RichTextEditor.OrderedList />}
                    {isEnabled("blockquote") && <RichTextEditor.Blockquote />}
                  </RichTextEditor.ControlsGroup>
                )}

                {anyEnabled("alignLeft", "alignCenter", "alignRight") && (
                  <RichTextEditor.ControlsGroup>
                    {isEnabled("alignLeft") && <RichTextEditor.AlignLeft />}
                    {isEnabled("alignCenter") && <RichTextEditor.AlignCenter />}
                    {isEnabled("alignRight") && <RichTextEditor.AlignRight />}
                  </RichTextEditor.ControlsGroup>
                )}

                {isEnabled("link") && (
                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Link
                      popoverProps={{ withinPortal: false, offset: 10 }}
                    />
                    <RichTextEditor.Unlink />
                  </RichTextEditor.ControlsGroup>
                )}

                {anyEnabled("image", "audio", "pdf", "advertisement") && (
                  <RichTextEditor.ControlsGroup>
                    {isEnabled("image") && <ImageControl />}
                    {isEnabled("audio") && <AudioControl />}
                    {isEnabled("pdf") && <PdfControl />}
                    {isEnabled("advertisement") && <AdvertisementControl />}
                  </RichTextEditor.ControlsGroup>
                )}
              </RichTextEditor.Toolbar>
            )}
          </>
        )}

        {editor && !isPreview && (
          <BubbleMenu editor={editor} className="z-1000! rte-bubble-menu">
            <RichTextEditor.Toolbar className="rounded-b-(--mantine-radius-default)!">
              {anyEnabled("bold", "italic", "underline", "strike") && (
                <RichTextEditor.ControlsGroup>
                  {isEnabled("bold") && <RichTextEditor.Bold />}
                  {isEnabled("italic") && <RichTextEditor.Italic />}
                  {isEnabled("underline") && <RichTextEditor.Underline />}
                  {isEnabled("strike") && <RichTextEditor.Strikethrough />}
                </RichTextEditor.ControlsGroup>
              )}

              {isEnabled("fontSize") && (
                <RichTextEditor.ControlsGroup>
                  <FontSizeControl />
                </RichTextEditor.ControlsGroup>
              )}

              {anyEnabled("alignLeft", "alignCenter", "alignRight") && (
                <RichTextEditor.ControlsGroup>
                  {isEnabled("alignLeft") && <RichTextEditor.AlignLeft />}
                  {isEnabled("alignCenter") && <RichTextEditor.AlignCenter />}
                  {isEnabled("alignRight") && <RichTextEditor.AlignRight />}
                </RichTextEditor.ControlsGroup>
              )}

              {isEnabled("link") && (
                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Link
                    popoverProps={{ withinPortal: false, offset: 10 }}
                  />
                  <RichTextEditor.Unlink />
                </RichTextEditor.ControlsGroup>
              )}

              {isEnabled("ruby") && (
                <RichTextEditor.ControlsGroup>
                  <RubyControl />
                </RichTextEditor.ControlsGroup>
              )}
            </RichTextEditor.Toolbar>
          </BubbleMenu>
        )}

        <RichTextEditor.Content mih={minHeight} />
      </RichTextEditor>
    </Input.Wrapper>
  );
};

export default RichTextEditorField;
