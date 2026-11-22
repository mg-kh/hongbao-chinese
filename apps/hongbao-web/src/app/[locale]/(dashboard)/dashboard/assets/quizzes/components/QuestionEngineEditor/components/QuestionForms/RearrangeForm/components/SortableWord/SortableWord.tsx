import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TextInput } from "@mantine/core";
import { IconGripVertical } from "@tabler/icons-react";
import React from "react";

interface Props {
  id: string;
  label: string;
}

/** Answer slot: looks like a question slot (input with a grip on the left),
 * but read-only since its word comes from the question. */
const SortableWord: React.FC<Props> = ({ id, label }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1 : undefined,
      }}
      className={`relative ${isDragging ? "opacity-80 shadow-md" : ""}`}
    >
      <TextInput
        value={label}
        readOnly
        tabIndex={-1}
        w={90}
        leftSectionPointerEvents="auto"
        leftSectionWidth={24}
        leftSection={
          <span
            ref={setActivatorNodeRef}
            {...attributes}
            {...listeners}
            aria-label="Drag to reorder"
            className="flex cursor-grab touch-none items-center text-gray-400 active:cursor-grabbing"
          >
            <IconGripVertical size={14} />
          </span>
        }
      />
    </div>
  );
};

export default SortableWord;
