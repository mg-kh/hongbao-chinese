import ClientLayout from "@/layouts/ClientLayout/ClientLayout";
import { Flex, Stack } from "@mantine/core";
import React from "react";
import CourseAccessGate from "./components/CourseAccessGate/CourseAccessGate";
import CourseNavigator from "./components/CourseNavigator/CourseNavigator";

interface Props {
  children: React.ReactNode;
}

const LearnLayout: React.FC<Props> = ({ children }) => {
  return (
    <ClientLayout hideFooterOnMobile>
      <CourseAccessGate>
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
      </CourseAccessGate>
    </ClientLayout>
  );
};

export default LearnLayout;
