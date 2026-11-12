import { MusicNotesIcon } from "@phosphor-icons/react";
import { createMediaPlaceholder } from "./createMediaPlaceholder";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    audioPlaceholder: {
      insertAudioPlaceholder: () => ReturnType;
    };
  }
}

const AUDIO_MIME_TYPE = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/wave",
  "audio/x-wav",
  "audio/ogg",
  "audio/webm",
  "audio/aac",
  "audio/flac",
  "audio/mp4",
  "audio/x-m4a",
];

// Kept well below the image limit: base64 inflates ~33% on top of the raw
// file, and the whole document is re-serialized (getHTML) on every debounced
// keystroke pause - a large embedded audio blob makes every one of those
// re-serializations proportionally heavier.
const AudioPlaceholder = createMediaPlaceholder({
  name: "audioPlaceholder",
  dataAttribute: "data-audio-placeholder",
  insertCommandName: "insertAudioPlaceholder",
  finalNodeType: "audio",
  uploadEndpoint: "dashboard/upload-audio",
  accept: AUDIO_MIME_TYPE,
  maxSize: 8 * 1024 ** 2,
  idleIcon: <MusicNotesIcon size={28} color="var(--mantine-color-dimmed)" />,
  dropLabel: "Drag audio file here or click to select",
  buildAttrs: (file, src) => ({ src, title: file.name }),
});

export default AudioPlaceholder;
