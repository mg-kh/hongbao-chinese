import { Text } from "@mantine/core";
import React from "react";

interface Props {
  icon: React.ReactNode;
  /** Screen-reader label for the value (the icon carries it visually). */
  label: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

/** Compact icon + value pair in the profile header's meta row. */
const MetaItem: React.FC<Props> = ({ icon, label, children, action }) => (
  <div className="flex items-center gap-1.5 min-w-0 text-gray-500">
    <span aria-hidden className="flex shrink-0">
      {icon}
    </span>
    <span className="sr-only">{label}:</span>
    <Text size="sm" c="gray.6" truncate className="min-w-0!">
      {children}
    </Text>
    {action}
  </div>
);

export default MetaItem;
