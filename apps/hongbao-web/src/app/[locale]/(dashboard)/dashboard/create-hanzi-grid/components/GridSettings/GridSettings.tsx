import { Stack } from "@mantine/core";
import GeneralSection from "./components/GeneralSection/GeneralSection";
import GridsSection from "./components/GridsSection/GridsSection";

const GridSettings = () => {
  return (
    <>
      <Stack p={10}>
        <GeneralSection />
        <GridsSection />
      </Stack>
    </>
  );
};

export default GridSettings;
