import { QuestionType } from "@repo/shared";
import { Badge, BadgeProps } from "@mantine/core";
import React from "react";

export const QUESTION_TYPE_META: Record<
  QuestionType,
  { label: string; color: string }
> = {
  [QuestionType.MULTIPLE_CHOICES]: { label: "Multiple Choice", color: "blue" },
  [QuestionType.TRUE_OR_FALSE]: { label: "True or False", color: "indigo" },
  [QuestionType.REARRANGE]: { label: "Re-arrange", color: "green" },
};

interface Props extends Omit<BadgeProps, "children" | "color"> {
  type: QuestionType | string | undefined | null;
}

const QuestionTypeBadge: React.FC<Props> = ({ type, ...props }) => {
  const meta = type ? QUESTION_TYPE_META[type as QuestionType] : undefined;
  if (!meta) return null;

  return (
    <Badge variant="light" radius="sm" color={meta.color} {...props}>
      {meta.label}
    </Badge>
  );
};

export default QuestionTypeBadge;
