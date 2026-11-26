import { Group } from "@mantine/core";
import React from "react";

interface Props {
  icon: React.ReactNode;
  label: string;
}

const OptionLabel: React.FC<Props> = ({ icon, label }) => (
  <Group gap={6} wrap="nowrap" justify="center">
    {icon}
    <span>{label}</span>
  </Group>
);

export default OptionLabel;
