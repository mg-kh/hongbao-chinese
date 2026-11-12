import CustomTextInput from "@/components/Inputs/CustomTextInput/CustomTextInput";
import { Accordion, Stack } from "@mantine/core";
import { useFormContext } from "react-hook-form";

const GeneralSection = () => {
  const { control } = useFormContext();
  return (
    <Accordion defaultValue="general" p={0} variant="filled">
      <Accordion.Item value="general" p={0}>
        <Accordion.Control p={0}>General</Accordion.Control>
        <Accordion.Panel bg="white" px={0}>
          <Stack gap={1}>
            <CustomTextInput
              control={control}
              name="website_name"
              label="Website Name"
            />
            <CustomTextInput
              control={control}
              name="website_type"
              label="Business Type"
            />
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};

export default GeneralSection;
