import ClientLayout from "@/layouts/ClientLayout/ClientLayout";
import { Flex, Stack } from "@mantine/core";
import React from "react";
import CourseNavigator from "./components/CourseNavigator/CourseNavigator";

interface Props {
  children: React.ReactNode;
}

const LearnLayout: React.FC<Props> = ({ children }) => {
  return (
    <ClientLayout hideFooterOnMobile>
      <Flex
        gap={{ base: 14, lg: 20 }}
        py={10}
        align="start"
        direction={{ base: "column", lg: "row" }}
      >
        <CourseNavigator />
        {/* Left */}
        <Stack className="flex-1! w-full! min-w-0!">{children}</Stack>
      </Flex>
    </ClientLayout>
  );
};

export default LearnLayout;
