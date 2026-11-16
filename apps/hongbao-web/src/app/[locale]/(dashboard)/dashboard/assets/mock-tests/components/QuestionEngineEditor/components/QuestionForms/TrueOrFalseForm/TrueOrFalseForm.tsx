import CustomRichTextEditor from "@/components/Inputs/CustomRichTextEditor/CustomRichTextEditor";
import CustomTextInput from "@/components/Inputs/CustomTextInput/CustomTextInput";
import { ActionIcon, Button, Flex, Stack, Text } from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { isEmpty } from "lodash";
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

const TrueOrFalseForm = () => {
  const { control } = useFormContext();
  const options = useFieldArray({
    control,
    name: "data.options",
  });
  return (
    <Stack>
      <CustomTextInput
        control={control}
        name="title"
        className="w-full!"
        label="Title"
        placeholder="Choose true or false"
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
                      <CustomTextInput
                        control={control}
                        name={`data.options.${i}`}
                        className="w-full!"
                      />
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
                          options.append("-");
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
                options.append("-");
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
          <CustomTextInput
            control={control}
            name="data.answer"
            className="w-full!"
          />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default TrueOrFalseForm;
