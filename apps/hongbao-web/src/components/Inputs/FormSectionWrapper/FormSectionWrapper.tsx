import { Flex, Stack, Text } from "@mantine/core";
import React from "react";

interface Props {
  sectionTitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

const FormSectionWrapper: React.FC<Props> = ({
  sectionTitle = "",
  children,
  actions,
}) => {
  return (
    <Stack p={20} gap={5} bg="white" bdrs={10}>
      <Flex justify="space-between" align="center">
        <Text c={"gray"}>{sectionTitle}</Text>
        {actions}
      </Flex>
      {children}
    </Stack>
  );
};

export default FormSectionWrapper;
