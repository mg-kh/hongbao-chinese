import { pluralize } from "@/utils/pluralize";
import { cn } from "@/utils/cn";
import { Badge, Button, Loader, Text } from "@mantine/core";
import { IconChevronRight, IconPlus } from "@tabler/icons-react";
import React from "react";

interface Props {
  depth: 0 | 1 | 2;
  icon: React.ReactNode;
  /** tailwind text color class for the icon, e.g. "text-blue-600" */
  accentClass?: string;
  title: string;
  quizzesCount: number;
  expanded: boolean;
  loading?: boolean;
  onToggle: () => void;
  onAttach: () => void;
}

const DEPTH_PADDING: Record<Props["depth"], string> = {
  0: "pl-3",
  1: "pl-8",
  2: "pl-14",
};

const NodeRow: React.FC<Props> = ({
  depth,
  icon,
  accentClass = "text-blue-600 dark:text-night-blue",
  title,
  quizzesCount,
  expanded,
  loading = false,
  onToggle,
  onAttach,
}) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border border-gray-200 bg-surface pr-2 transition-colors hover:border-blue-300 hover:bg-blue-50/40",
        expanded && "border-blue-300 bg-blue-50/40",
        DEPTH_PADDING[depth],
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex flex-1 items-center gap-2 py-2.5 text-left"
      >
        <IconChevronRight
          size={16}
          className={cn(
            "shrink-0 text-gray-400 transition-transform",
            expanded && "rotate-90",
          )}
        />
        <span className={cn("flex shrink-0 items-center", accentClass)}>
          {icon}
        </span>
        <Text component="span" fw={600} lineClamp={1} className="flex-1">
          {title}
        </Text>
      </button>

      {loading ? (
        <Loader size={14} />
      ) : (
        <Badge
          size="sm"
          variant={quizzesCount > 0 ? "filled" : "light"}
          color={quizzesCount > 0 ? "blue" : "gray"}
        >
          {pluralize(quizzesCount, "quiz", "quizzes")}
        </Badge>
      )}

      <Button
        size="compact-xs"
        variant="light"
        leftSection={<IconPlus size={13} />}
        onClick={onAttach}
      >
        Attach quiz
      </Button>
    </div>
  );
};

export default NodeRow;
