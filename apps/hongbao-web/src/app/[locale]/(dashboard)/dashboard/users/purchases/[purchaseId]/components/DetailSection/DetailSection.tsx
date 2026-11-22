import { Paper, Text } from "@mantine/core";

interface Props {
  title: string;
  icon?: React.ReactNode;
  /** Right side of the section header (e.g. a count). */
  extra?: React.ReactNode;
  children: React.ReactNode;
}

/** Titled card used for each block of the purchase detail page. */
const DetailSection: React.FC<Props> = ({ title, icon, extra, children }) => (
  <Paper
    withBorder
    bdrs={12}
    p={0}
    className="overflow-hidden! border-gray-200! bg-white!"
  >
    <div className="flex items-center justify-between gap-2 border-b border-gray-100 px-4 py-2.5">
      <div className="flex items-center gap-2 text-gray-500">
        {icon}
        <Text size="xs" fw={700} c="gray.6" tt="uppercase">
          {title}
        </Text>
      </div>
      {extra}
    </div>
    <div className="px-4 py-3">{children}</div>
  </Paper>
);

export default DetailSection;
