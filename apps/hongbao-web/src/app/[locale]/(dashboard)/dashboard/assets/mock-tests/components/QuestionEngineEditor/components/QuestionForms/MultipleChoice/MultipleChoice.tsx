import CustomRadioGroup from "@/components/Inputs/CustomRadioGroup/CustomRadioGroup";
import CustomRichTextEditor from "@/components/Inputs/CustomRichTextEditor/CustomRichTextEditor";
import CustomTextInput from "@/components/Inputs/CustomTextInput/CustomTextInput";
import { ActionIcon, Box, Button, Flex, Stack, Text } from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { isEmpty } from "lodash";
import { nanoid } from "nanoid";
import React from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

const MultipleChoice = () => {
  const { control } = useFormContext();
  const options = useFieldArray({
    control,
    name: "data.options",
  });
  const dropdownOptions = useWatch({
    control,
    name: "data.options",
  });
  console.log({ options });
  return (
    <Stack>
      <CustomTextInput
        control={control}
        name="title"
        className="w-full!"
        label="Title"
        placeholder="Choose the correct answer"
      />
      <CustomRichTextEditor
        control={control}
        name="data.question"
        label="Question"
      />
      <Stack gap={5}>
        <Text size="md">Options</Text>
        <Stack>
          {!isEmpty(options?.fields) ? (
            <>
              {options?.fields?.map((o, i) => {
                return (
                  <React.Fragment key={o.id}>
                    <Flex gap={10} align="stretch">
                      <Box w={"100%"}>
                        <CustomRichTextEditor
                          label={`Option ${i + 1}`}
                          control={control}
                          name={`data.options.${i}.label`}
                          commands={["ruby"]}
                          showHeader={false}
                        />
                      </Box>
                      <ActionIcon
                        onClick={() => {
                          options.remove(i);
                        }}
                        size="lg"
                        bg="red"
                      >
                        <IconTrash />
                      </ActionIcon>
                      <ActionIcon
                        onClick={() => {
                          options.append({
                            label: "",
                            value: nanoid(),
                          });
                        }}
                        size="lg"
                      >
                        <IconPlus />
                      </ActionIcon>
                    </Flex>
                  </React.Fragment>
                );
              })}
            </>
          ) : (
            <Button
              onClick={() => {
                options.append(
                  Array.from({ length: 4 }, () => ({
                    label: "",
                    value: nanoid(),
                  })),
                );
              }}
              w={300}
            >
              Add New Option
            </Button>
          )}
        </Stack>
      </Stack>
      <Stack gap={5}>
        <Text size="md">Answer</Text>
        <Stack>
          <CustomRadioGroup
            control={control}
            name="data.answer"
            data={dropdownOptions || []}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default MultipleChoice;
