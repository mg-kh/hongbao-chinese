import CustomTextInput from "@/components/Inputs/CustomTextInput/CustomTextInput";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ActionIcon } from "@mantine/core";
import { IconGripVertical, IconX } from "@tabler/icons-react";
import React from "react";
import { Control, FieldValues } from "react-hook-form";

interface Props {
  id: string;
  name: string;
  control: Control<FieldValues>;
  onRemove: () => void;
}

const SortableQuestionSlot: React.FC<Props> = ({
  id,
  name,
  control,
  onRemove,
}) => {
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
      <CustomTextInput
        control={control}
        name={name}
        placeholder="-"
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
      <ActionIcon
        size="xs"
        color="red"
        className="absolute! -right-1.25 -top-2.25"
        onClick={onRemove}
      >
        <IconX size={10} />
      </ActionIcon>
    </div>
  );
};

export default SortableQuestionSlot;
