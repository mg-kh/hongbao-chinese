import { Text } from "@mantine/core";

interface Props {
  label: string;
  children: React.ReactNode;
  /** Secondary line under the value. */
  hint?: React.ReactNode;
}

/** Label / value pair inside a DetailSection. */
const InfoRow: React.FC<Props> = ({ label, children, hint }) => (
  <div className="flex flex-col gap-0.5">
    <Text size="10px" fw={700} c="gray.5" tt="uppercase">
      {label}
    </Text>
    <div className="text-sm text-gray-800">{children}</div>
    {hint && (
      <Text size="xs" c="gray.5">
        {hint}
      </Text>
    )}
  </div>
);

export default InfoRow;
