import { PDF_MIME_TYPE } from "@mantine/dropzone";
import { FilePdfIcon } from "@phosphor-icons/react";
import { createMediaPlaceholder } from "./createMediaPlaceholder";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    pdfPlaceholder: {
      insertPdfPlaceholder: () => ReturnType;
    };
  }
}

// See AudioPlaceholder for why this is capped well below the image limit -
// same base64-inflation-times-full-doc-reserialization tradeoff applies.
const PdfPlaceholder = createMediaPlaceholder({
  name: "pdfPlaceholder",
  dataAttribute: "data-pdf-placeholder",
  insertCommandName: "insertPdfPlaceholder",
  finalNodeType: "pdfAttachment",
  uploadEndpoint: "dashboard/upload-pdf",
  accept: PDF_MIME_TYPE,
  maxSize: 8 * 1024 ** 2,
  idleIcon: <FilePdfIcon size={28} color="var(--mantine-color-dimmed)" />,
  dropLabel: "Drag PDF file here or click to select",
  buildAttrs: (file, src) => ({ src, name: file.name }),
});

export default PdfPlaceholder;
