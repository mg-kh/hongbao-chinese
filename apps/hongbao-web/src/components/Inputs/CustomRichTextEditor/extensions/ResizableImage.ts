import { mergeAttributes } from "@tiptap/core";
import TiptapImage, { type ImageOptions } from "@tiptap/extension-image";

type ResizeDirection = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export interface ResizableImageOptions extends ImageOptions {
  directions: ResizeDirection[];
  minWidth: number;
  minHeight: number;
}

// Anchor the opposite corner so the drag grows/shrinks away from a fixed point, like Figma.
const ANCHOR_ORIGIN: Record<ResizeDirection, string> = {
  "top-left": "100% 100%",
  "top-right": "0% 100%",
  "bottom-left": "100% 0%",
  "bottom-right": "0% 0%",
};

const JUSTIFY_CONTENT: Record<string, string> = {
  left: "flex-start",
  center: "center",
  right: "flex-end",
};

const ResizableImage = TiptapImage.extend<ResizableImageOptions>({
  addOptions() {
    return {
      inline: false,
      allowBase64: false,
      HTMLAttributes: {},
      resize: false,
      directions: ["top-left", "top-right", "bottom-left", "bottom-right"],
      minWidth: 40,
      minHeight: 40,
    };
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      mediaId: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-media-id"),
        renderHTML: (attributes) =>
          attributes.mediaId ? { "data-media-id": attributes.mediaId } : {},
      },
    };
  },

  addNodeView() {
    const { directions, minWidth, minHeight } = this.options;

    return ({ node, getPos, HTMLAttributes, editor }) => {
      const container = document.createElement("div");
      container.dataset.resizeContainer = "";
      container.style.display = node.type.isInline ? "inline-flex" : "flex";

      const wrapper = document.createElement("div");
      wrapper.dataset.resizeWrapper = "";
      wrapper.style.position = "relative";
      wrapper.style.display = "block";

      const img = document.createElement("img");
      img.draggable = false;

      // Alignment (from TextAlign's global `textAlign` attribute) is applied to
      // the flex `container` below via justify-content, not to the <img> itself -
      // text-align has no effect on an image element.
      const mergedAttributes = mergeAttributes(this.options.HTMLAttributes, HTMLAttributes);
      Object.entries(mergedAttributes).forEach(([key, value]) => {
        if (value == null || key === "width" || key === "height" || key === "style") return;
        img.setAttribute(key, value);
      });
      if (mergedAttributes.src != null) img.src = mergedAttributes.src;

      wrapper.appendChild(img);
      container.appendChild(wrapper);

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.dataset.resizeDelete = "";
      deleteButton.setAttribute("aria-label", "Remove image");
      deleteButton.addEventListener("pointerdown", (event) => {
        // Stop the ProseMirror view from turning this into a node selection
        // drag before the click has a chance to fire.
        event.stopPropagation();
      });
      deleteButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const pos = getPos();
        if (pos === undefined) return;
        editor.chain().focus().deleteRange({ from: pos, to: pos + 1 }).run();
      });
      wrapper.appendChild(deleteButton);

      const applySize = (width?: number | null, height?: number | null) => {
        img.style.width = width ? `${width}px` : "";
        img.style.height = height ? `${height}px` : "";
      };

      const applyAlign = (align?: string | null) => {
        container.style.justifyContent = (align && JUSTIFY_CONTENT[align]) || "flex-start";
      };

      applySize(node.attrs.width, node.attrs.height);
      applyAlign(node.attrs.textAlign);

      container.style.visibility = "hidden";
      container.style.pointerEvents = "none";
      img.onload = () => {
        container.style.visibility = "";
        container.style.pointerEvents = "";
      };

      let isResizing = false;
      let activeDirection: ResizeDirection | null = null;
      let startX = 0;
      let startY = 0;
      let startWidth = 0;
      let startHeight = 0;
      let aspectRatio = 1;
      let rafId: number | null = null;
      let latestEvent: PointerEvent | null = null;

      const computeSize = (clientX: number, clientY: number, preserveAspectRatio: boolean) => {
        const deltaX = clientX - startX;
        const deltaY = clientY - startY;
        const isRight = activeDirection?.includes("right");
        const isBottom = activeDirection?.includes("bottom");

        let width = startWidth + (isRight ? deltaX : -deltaX);
        let height = startHeight + (isBottom ? deltaY : -deltaY);

        if (preserveAspectRatio) {
          height = width / aspectRatio;
        }

        if (width < minWidth) {
          width = minWidth;
          if (preserveAspectRatio) height = width / aspectRatio;
        }
        if (height < minHeight) {
          height = minHeight;
          if (preserveAspectRatio) width = height * aspectRatio;
        }

        return { width, height };
      };

      // Scale a transform on the wrapper during drag (compositor-only, no reflow),
      // then commit real width/height once on release — that decoupling is what
      // keeps the drag itself smooth inside a contenteditable document.
      const flush = () => {
        rafId = null;
        if (!latestEvent) return;
        const { width, height } = computeSize(latestEvent.clientX, latestEvent.clientY, latestEvent.shiftKey);
        wrapper.style.transform = `scale(${width / startWidth}, ${height / startHeight})`;
      };

      const endResize = (event: PointerEvent, handle: HTMLElement) => {
        if (!isResizing) return;
        isResizing = false;
        latestEvent = null;
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        handle.releasePointerCapture(event.pointerId);
        delete container.dataset.resizeState;
        wrapper.style.willChange = "";
        wrapper.style.transform = "";

        const { width, height } = computeSize(event.clientX, event.clientY, event.shiftKey);
        applySize(Math.round(width), Math.round(height));

        const pos = getPos();
        if (pos !== undefined) {
          editor
            .chain()
            .setNodeSelection(pos)
            .updateAttributes(this.name, { width: Math.round(width), height: Math.round(height) })
            .run();
        }

        activeDirection = null;
      };

      directions.forEach((direction) => {
        const handle = document.createElement("div");
        handle.dataset.resizeHandle = direction;
        handle.style.position = "absolute";
        handle.style.touchAction = "none";

        if (direction.includes("top")) handle.style.top = "0";
        if (direction.includes("bottom")) handle.style.bottom = "0";
        if (direction.includes("left")) handle.style.left = "0";
        if (direction.includes("right")) handle.style.right = "0";

        handle.addEventListener("pointerdown", (event) => {
          event.preventDefault();
          event.stopPropagation();

          startWidth = img.offsetWidth;
          startHeight = img.offsetHeight;
          aspectRatio = startWidth / startHeight || 1;
          startX = event.clientX;
          startY = event.clientY;
          activeDirection = direction;
          isResizing = true;

          handle.setPointerCapture(event.pointerId);
          wrapper.style.transformOrigin = ANCHOR_ORIGIN[direction];
          wrapper.style.willChange = "transform";
          container.dataset.resizeState = "true";
        });

        handle.addEventListener("pointermove", (event) => {
          if (!isResizing) return;
          latestEvent = event;
          if (rafId === null) rafId = requestAnimationFrame(flush);
        });

        handle.addEventListener("pointerup", (event) => endResize(event, handle));
        handle.addEventListener("pointercancel", (event) => endResize(event, handle));

        wrapper.appendChild(handle);
      });

      return {
        dom: container,
        ignoreMutation: () => true,
        update: (updatedNode) => {
          if (updatedNode.type !== node.type) return false;
          if (!isResizing) applySize(updatedNode.attrs.width, updatedNode.attrs.height);
          applyAlign(updatedNode.attrs.textAlign);
          return true;
        },
        destroy: () => {
          if (rafId !== null) cancelAnimationFrame(rafId);
        },
      };
    };
  },
});

export default ResizableImage;
