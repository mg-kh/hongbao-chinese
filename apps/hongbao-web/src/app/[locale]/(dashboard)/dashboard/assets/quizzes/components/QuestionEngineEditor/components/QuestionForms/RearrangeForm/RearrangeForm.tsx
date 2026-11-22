import CustomTextInput from "@/components/Inputs/CustomTextInput/CustomTextInput";
import { closestCenter, DndContext } from "@dnd-kit/core";
import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { ActionIcon, Stack, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import SortableQuestionSlot from "@/app/[locale]/(dashboard)/dashboard/assets/quizzes/components/QuestionEngineEditor/components/QuestionForms/RearrangeForm/components/SortableQuestionSlot/SortableQuestionSlot";
import SortableWord from "@/app/[locale]/(dashboard)/dashboard/assets/quizzes/components/QuestionEngineEditor/components/QuestionForms/RearrangeForm/components/SortableWord/SortableWord";
import useContainer from "@/app/[locale]/(dashboard)/dashboard/assets/quizzes/components/QuestionEngineEditor/components/QuestionForms/RearrangeForm/useContainer";

const RearrangeForm = () => {
  const {
    control,
    questionFields,
    answerWords,
    sensors,
    handleAddWord,
    handleRemoveWord,
    handleQuestionDragEnd,
    handleAnswerDragEnd,
  } = useContainer();

  return (
    <Stack gap={20}>
      <CustomTextInput
        control={control}
        name="title"
        placeholder="Re-arrange to get the correct answer"
        label="Title"
      />
      <Stack gap={8}>
        <Text size="lg">Question</Text>
        <Text size="xs" c="dimmed">
          Add the words in the order learners will see them. Drag the handle to
          reorder.
        </Text>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleQuestionDragEnd}
        >
          <SortableContext
            items={questionFields.map((o) => o.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="flex flex-wrap gap-2.5">
              {questionFields.map((o, i) => (
                <SortableQuestionSlot
                  key={o.id}
                  id={o.id}
                  name={`data.questions.${i}.label`}
                  control={control}
                  onRemove={() => handleRemoveWord(i)}
                />
              ))}
              <ActionIcon size="lg" onClick={handleAddWord} variant="light">
                <IconPlus />
              </ActionIcon>
            </div>
          </SortableContext>
        </DndContext>
      </Stack>
      <Stack gap={8}>
        <Text size="lg">Answer</Text>
        <Text size="xs" c="dimmed">
          Drag the words into the correct order.
        </Text>
        {answerWords.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleAnswerDragEnd}
          >
            <SortableContext
              items={answerWords.map((w) => w.value)}
              strategy={horizontalListSortingStrategy}
            >
              <div className="flex flex-wrap gap-2.5">
                {answerWords.map((w) => (
                  <SortableWord key={w.value} id={w.value} label={w.label} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <Text size="sm" c="dimmed">
            Add question words to arrange the answer.
          </Text>
        )}
      </Stack>
    </Stack>
  );
};

export default RearrangeForm;
