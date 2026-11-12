import { IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { ImageIcon } from "@phosphor-icons/react";
import { createMediaPlaceholder } from "./createMediaPlaceholder";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    imagePlaceholder: {
      insertImagePlaceholder: () => ReturnType;
    };
  }
}

const ImagePlaceholder = createMediaPlaceholder({
  name: "imagePlaceholder",
  dataAttribute: "data-image-placeholder",
  insertCommandName: "insertImagePlaceholder",
  finalNodeType: "image",
  uploadEndpoint: "dashboard/upload-image",
  accept: IMAGE_MIME_TYPE,
  maxSize: 5 * 1024 ** 2,
  idleIcon: <ImageIcon size={28} color="var(--mantine-color-dimmed)" />,
  dropLabel: "Drag image here or click to select",
  buildAttrs: (file, src) => ({ src, alt: file.name }),
});

export default ImagePlaceholder;
