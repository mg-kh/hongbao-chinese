"use client";

import { Box, Flex } from "@mantine/core";
import { FormProvider } from "react-hook-form";
import GridSettings from "./components/GridSettings/GridSettings";
import LivePreview from "./components/LivePreview/LivePreview";
import useContainer from "./useContainer";

const CreateHanziGrid = () => {
  const { form } = useContainer();
  return (
    <FormProvider {...form}>
      <Flex
        className="h-full"
        direction={{ base: "column", lg: "row" }}
        align="stretch"
      >
        <Box className="w-full shrink-0 lg:w-5/12">
          <GridSettings />
        </Box>
        <Box
          className="h-[70vh] w-full shrink-0 self-start lg:sticky! lg:top-15! lg:h-[calc(100vh-60px)] lg:w-7/12"
          bg="dark"
        >
          <LivePreview />
        </Box>
      </Flex>
    </FormProvider>
  );
};

export default CreateHanziGrid;
