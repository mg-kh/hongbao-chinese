import CustomTextInput from "@/components/Inputs/CustomTextInput/CustomTextInput";
import { ActionIcon, Box, Flex, Stack, Text } from "@mantine/core";
import { IconPlus, IconX } from "@tabler/icons-react";
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

const RearrangeForm = () => {
  const { control } = useFormContext();
  const questions = useFieldArray({
    control,
    name: "data.questions",
  });
  const answers = useFieldArray({
    control,
    name: "data.answers",
  });
  return (
    <Stack gap={20}>
      <CustomTextInput
        control={control}
        name="title"
        placeholder="Re-arrange to get the correct answer"
        label="Title"
      />
      <Stack>
        <Text size="lg">Question</Text>
        <Flex gap={10}>
          {questions?.fields?.map((o, i) => {
            return (
              <React.Fragment key={o.id}>
                <Box className="relative">
                  <CustomTextInput
                    control={control}
                    name={`data.questions.${i}`}
                    placeholder="-"
                    w={70}
                  />
                  <ActionIcon
                    size="xs"
                    color="red"
                    className="absolute! -right-1.25 -top-2.25"
                    onClick={() => {
                      questions.remove(i);
                    }}
                  >
                    <IconX size={10} />
                  </ActionIcon>
                </Box>
              </React.Fragment>
            );
          })}
          <ActionIcon
            size="lg"
            onClick={() => {
              questions.append("-");
            }}
            variant="light"
          >
            <IconPlus />
          </ActionIcon>
        </Flex>
      </Stack>
      <Stack>
        <Text size="lg">Answer</Text>
        <Flex gap={10}>
          {answers?.fields?.map((o, i) => {
            return (
              <React.Fragment key={o.id}>
                <Box className="relative">
                  <CustomTextInput
                    control={control}
                    name={`data.answers.${i}`}
                    placeholder="-"
                    w={70}
                  />
                  <ActionIcon
                    size="xs"
                    color="red"
                    className="absolute! -right-1.25 -top-2.25"
                    onClick={() => {
                      answers.remove(i);
                    }}
                  >
                    <IconX size={10} />
                  </ActionIcon>
                </Box>
              </React.Fragment>
            );
          })}
          <ActionIcon
            size="lg"
            onClick={() => {
              answers.append("-");
            }}
            variant="light"
          >
            <IconPlus />
          </ActionIcon>
        </Flex>
      </Stack>
    </Stack>
  );
};

export default RearrangeForm;
