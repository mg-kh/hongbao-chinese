import { showErrorNoti } from "@/utils/notifications-helper";
import { Group, Loader, Text } from "@mantine/core";
import { Dropzone, type FileRejection } from "@mantine/dropzone";
import { UploadSimpleIcon, XIcon } from "@phosphor-icons/react";
import {
  mergeAttributes,
  Node,
  type CommandProps,
  type RawCommands,
} from "@tiptap/core";
import {
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type ReactNodeViewProps,
} from "@tiptap/react";
import type { ReactNode } from "react";
import { useState } from "react";
import useMediaStorage from "../services/mediaStorage";

export interface MediaPlaceholderConfig {
  /** Tiptap node name for the placeholder itself, e.g. "audioPlaceholder". */
  name: string;
  /** HTML attribute marking/parsing the placeholder wrapper div, e.g. "data-audio-placeholder". */
  dataAttribute: string;
  /** Command name exposed on the editor chain, e.g. "insertAudioPlaceholder". */
  insertCommandName: string;
  /** Node type inserted once a file is dropped, e.g. "audio". */
  finalNodeType: string;
  /** API route this media type uploads to, e.g. "dashboard/upload-audio?type=question". */
  uploadEndpoint: string;
  accept: string[];
  maxSize: number;
  idleIcon: ReactNode;
  dropLabel: string;
  buildAttrs: (file: File, src: string) => Record<string, unknown>;
}

/**
 * Shared shape behind every "drop a file, upload it to storage, embed the
 * returned URL" control (image/audio/pdf) - keeps the Dropzone wiring,
 * upload/loading state, reject-feedback, and insert-without-clobbering-the-
 * previous-node logic in one place so adding a future media type is a config
 * object, not a copy-pasted NodeView.
 */
export function createMediaPlaceholder(config: MediaPlaceholderConfig) {
  const {
    name,
    dataAttribute,
    insertCommandName,
    finalNodeType,
    uploadEndpoint,
    accept,
    maxSize,
    idleIcon,
    dropLabel,
    buildAttrs,
  } = config;

  const PlaceholderView: React.FC<ReactNodeViewProps<HTMLDivElement>> = ({
    editor,
    getPos,
  }) => {
    const [isUploading, setIsUploading] = useState(false);
    const { uploadMedia, deleteMedia } = useMediaStorage();

    const handleDrop = async (files: File[]) => {
      const file = files[0];
      const pos = getPos();
      if (!file || pos === undefined) return;

      setIsUploading(true);
      try {
        const { id, url } = await uploadMedia(file, uploadEndpoint);

        // The placeholder may have been removed while the upload was in
        // flight (e.g. user deleted the node) - don't insert into a stale
        // position, and clean up the now-orphaned upload instead.
        if (editor.state.doc.nodeAt(pos)?.type.name !== name) {
          deleteMedia(id).catch(() => undefined);
          return;
        }

        editor
          .chain()
          .focus()
          .deleteRange({ from: pos, to: pos + 1 })
          .insertContentAt(pos, {
            type: finalNodeType,
            attrs: { ...buildAttrs(file, url), mediaId: id },
          })
          .run();
      } catch {
        showErrorNoti(`Failed to upload ${dropLabel.toLowerCase()}`);
        setIsUploading(false);
      }
    };

    const handleReject = (fileRejections: FileRejection[]) => {
      const reason = fileRejections[0]?.errors[0]?.message;
      showErrorNoti(
        reason
          ? `${dropLabel} - ${reason}`
          : `Could not add ${dropLabel.toLowerCase()}`,
      );
    };

    return (
      <NodeViewWrapper {...{ [dataAttribute]: "" }}>
        {isUploading ? (
          <Group justify="center" gap="xs" mih={100}>
            <Loader size="sm" />
            <Text size="sm" c="dimmed">
              Uploading...
            </Text>
          </Group>
        ) : (
          <Dropzone
            onDrop={handleDrop}
            onReject={handleReject}
            accept={accept}
            maxSize={maxSize}
            multiple={false}
          >
            <Group
              justify="center"
              gap="xs"
              mih={100}
              style={{ pointerEvents: "none" }}
            >
              <Dropzone.Accept>
                <UploadSimpleIcon
                  size={28}
                  color="var(--mantine-color-blue-6)"
                />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <XIcon size={28} color="var(--mantine-color-red-6)" />
              </Dropzone.Reject>
              <Dropzone.Idle>{idleIcon}</Dropzone.Idle>

              <Text size="sm" c="dimmed" ta="center" inline>
                {dropLabel}
              </Text>
            </Group>
          </Dropzone>
        )}
      </NodeViewWrapper>
    );
  };

  return Node.create({
    name,
    group: "block",
    atom: true,
    selectable: true,
    draggable: false,

    parseHTML() {
      return [{ tag: `div[${dataAttribute}]` }];
    },

    renderHTML({ HTMLAttributes }) {
      return ["div", mergeAttributes(HTMLAttributes, { [dataAttribute]: "" })];
    },

    addNodeView() {
      return ReactNodeViewRenderer(PlaceholderView);
    },

    addCommands() {
      return {
        // Inserts after the current selection end rather than replacing it -
        // if the selection is a NodeSelection on a just-inserted atom (image,
        // audio, pdf, advertisement all leave one behind), a plain
        // `insertContent` would silently delete that node instead of adding
        // a new one next to it.
        [insertCommandName]:
          () =>
          ({ state, commands }: CommandProps) =>
            commands.insertContentAt(state.selection.to, { type: name }),
      } as Partial<RawCommands>;
    },
  });
}
