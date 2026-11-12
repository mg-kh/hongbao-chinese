import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import PdfView from "./components/PdfView";

export interface PdfAttachmentOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    pdfAttachment: {
      setPdfAttachment: (options: { src: string; name?: string }) => ReturnType;
    };
  }
}

const PdfAttachment = Node.create<PdfAttachmentOptions>({
  name: "pdfAttachment",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (element) => element.getAttribute("href"),
        renderHTML: (attributes) => ({ href: attributes.src }),
      },
      name: {
        default: null,
        parseHTML: (element) => element.getAttribute("download"),
        renderHTML: (attributes) => ({ download: attributes.name }),
      },
      mediaId: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-media-id"),
        renderHTML: (attributes) =>
          attributes.mediaId ? { "data-media-id": attributes.mediaId } : {},
      },
    };
  },

  parseHTML() {
    return [{ tag: 'a[data-type="pdf-attachment"]' }];
  },

  renderHTML({ HTMLAttributes, node }) {
    return [
      "a",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": "pdf-attachment",
        target: "_blank",
        rel: "noopener noreferrer",
      }),
      ["span", { class: "rte-pdf-chip-icon" }, "📄"],
      ["span", { class: "rte-pdf-chip-name" }, node.attrs.name || "PDF file"],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(PdfView);
  },

  addCommands() {
    return {
      setPdfAttachment:
        (options) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs: options }),
    };
  },
});

export default PdfAttachment;
