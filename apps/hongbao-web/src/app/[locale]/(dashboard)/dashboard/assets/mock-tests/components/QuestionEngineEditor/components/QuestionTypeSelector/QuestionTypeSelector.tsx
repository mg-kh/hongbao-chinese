import FormSectionWrapper from "@/components/Inputs/FormSectionWrapper/FormSectionWrapper";
import { Group, Radio, SimpleGrid, Text } from "@mantine/core";
import { Controller, useFormContext } from "react-hook-form";
import { QuestionType } from "@repo/shared";

export { QuestionType };

const questionTypes = [
  {
    label: "Multiple Choice",
    value: QuestionType.MULTIPLE_CHOICES,
  },
  {
    label: "True Or False",
    value: QuestionType.TRUE_OR_FALSE,
  },
  {
    label: "Re-arrange",
    value: QuestionType.REARRANGE,
  },
];

const QuestionTypeSelector = () => {
  const { control, reset, getValues } = useFormContext();
  return (
    <FormSectionWrapper sectionTitle="Choose Question type">
      <Controller
        name="type"
        control={control}
        render={({ field: { onChange, value } }) => {
          return (
            <Radio.Group
              value={value}
              onChange={(v) => {
                onChange(v);
                reset({
                  type: getValues("type"),
                });
              }}
            >
              <SimpleGrid cols={{ base: 1, xs: 2, sm: 3, md: 4 }}>
                {questionTypes?.map((q) => {
                  return (
                    <Radio.Card
                      key={q.value}
                      p={20}
                      withBorder={false}
                      bdrs={15}
                      value={q.value}
                      bg="gray.1"
                      c={value === q.value ? "blue.7" : ""}
                    >
                      <Group wrap="nowrap" align="flex-start">
                        <Radio.Indicator mt={3} />
                        <div>
                          <Text fw={"bold"}>{q.label}</Text>
                        </div>
                      </Group>
                    </Radio.Card>
                  );
                })}
              </SimpleGrid>
            </Radio.Group>
          );
        }}
      />
    </FormSectionWrapper>
  );
};

export default QuestionTypeSelector;
