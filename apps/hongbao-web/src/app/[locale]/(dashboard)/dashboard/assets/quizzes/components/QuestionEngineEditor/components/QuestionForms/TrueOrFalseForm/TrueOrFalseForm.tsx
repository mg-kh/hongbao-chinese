import CustomRadioGroup from "@/components/Inputs/CustomRadioGroup/CustomRadioGroup";
import CustomRichTextEditor from "@/components/Inputs/CustomRichTextEditor/CustomRichTextEditor";
import CustomTextInput from "@/components/Inputs/CustomTextInput/CustomTextInput";
import { Stack, Text, TextInput } from "@mantine/core";
import useContainer from "@/app/[locale]/(dashboard)/dashboard/assets/quizzes/components/QuestionEngineEditor/components/QuestionForms/TrueOrFalseForm/useContainer";

const TrueOrFalseForm = () => {
  const { control, options } = useContainer();
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
        {/* Options are fixed to True / False and can't be edited. */}
        <div className="flex flex-col gap-2.5 sm:flex-row">
          {options.map((o, i) => (
            <TextInput
              key={o.value}
              label={`Option ${i + 1}`}
              value={o.label}
              readOnly
              variant="filled"
              className="w-full"
            />
          ))}
        </div>
      </Stack>
      <Stack gap={5}>
        <Text size="md">Answer</Text>
        <CustomRadioGroup control={control} name="data.answer" data={options} />
      </Stack>
    </Stack>
  );
};

export default TrueOrFalseForm;
