import { Mark, mergeAttributes } from "@tiptap/core";

export interface RubyOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    ruby: {
      setRuby: (rt: string) => ReturnType;
      unsetRuby: () => ReturnType;
    };
  }
}

const Ruby = Mark.create<RubyOptions>({
  name: "ruby",

  // Without this, typing right after (or before) an annotated word inherits
  // the ruby mark by default, silently growing the annotated range - and
  // since the pinyin is centered on the <ruby> box, it visibly slides over
  // as the box widens with every keystroke.
  inclusive: false,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      rt: {
        default: "",
        parseHTML: (element) =>
          element.getAttribute("data-rt") ?? element.querySelector("rt")?.textContent ?? "",
        renderHTML: (attributes) => ({ "data-rt": attributes.rt }),
      },
    };
  },

  parseHTML() {
    return [{ tag: "ruby" }];
  },

  renderHTML({ HTMLAttributes }) {
    // Keep this the same shape as any other mark ([tag, attrs, hole], no DOM
    // siblings) - the pinyin is rendered from the data-rt attribute via CSS
    // (see globals.css), not a real <rt> child. A sibling element here would
    // force ProseMirror to wrap the marked text in an extra node, which made
    // typing/cursor movement inside annotated text noticeably janky.
    return ["ruby", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setRuby:
        (rt: string) =>
        ({ commands }) =>
          commands.setMark(this.name, { rt }),
      unsetRuby:
        () =>
        ({ commands }) =>
          commands.unsetMark(this.name),
    };
  },
});

export default Ruby;
