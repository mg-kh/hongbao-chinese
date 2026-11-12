import { List, Stack, Text } from "@mantine/core";
import type { PolicySection as PolicySectionType } from "../../policy.data";

interface Props {
  section: PolicySectionType;
}

const PolicySection: React.FC<Props> = ({ section }) => {
  return (
    <Stack
      id={section.id}
      component="section"
      gap={12}
      className="scroll-mt-24!"
    >
      <Text
        component="h2"
        fw={700}
        className="text-lg! sm:text-xl! text-gray-900! leading-snug!"
      >
        {section.title}
      </Text>

      {section.paragraphs?.map((p) => (
        <Text key={p} c="gray.7" size="sm" className="leading-relaxed!">
          {p}
        </Text>
      ))}

      {section.bullets && (
        <List
          spacing={8}
          size="sm"
          className="text-gray-700!"
          styles={{
            itemLabel: { lineHeight: 1.6 },
            itemWrapper: { alignItems: "flex-start" },
          }}
        >
          {section.bullets.map((b) => (
            <List.Item key={b}>{b}</List.Item>
          ))}
        </List>
      )}
    </Stack>
  );
};

export default PolicySection;
