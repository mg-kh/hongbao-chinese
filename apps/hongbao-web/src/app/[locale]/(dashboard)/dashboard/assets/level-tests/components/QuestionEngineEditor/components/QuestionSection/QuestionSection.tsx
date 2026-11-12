import FormSectionWrapper from "@/components/Inputs/FormSectionWrapper/FormSectionWrapper";
import { useFormContext, useWatch } from "react-hook-form";
import MultipleChoice from "../QuestionForms/MultipleChoice/MultipleChoice";
import RearrangeForm from "../QuestionForms/RearrangeForm/RearrangeForm";
import { QuestionType } from "../QuestionTypeSelector/QuestionTypeSelector";
import TrueOrFalseForm from "../QuestionForms/TrueOrFalseForm/TrueOrFalseForm";

const QuestionSection = () => {
  const { control } = useFormContext();
  const type = useWatch({
    control,
    name: "type",
  });
  return (
    <FormSectionWrapper sectionTitle="Build Questions">
      {type === QuestionType.MULTIPLE_CHOICES && <MultipleChoice />}

      {type === QuestionType.TRUE_OR_FALSE && <TrueOrFalseForm />}

      {type === QuestionType.REARRANGE && <RearrangeForm />}
    </FormSectionWrapper>
  );
};

export default QuestionSection;
