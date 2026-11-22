import { TRearrangeWord } from "@/utils/normalizeRearrange";
import {
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { nanoid } from "nanoid";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

const SLOTS_PER_ADD = 4;

/** Full arrangement of word ids: the known order for ids that still exist,
 * then any words not placed yet. If none of the known ids exist (the form was
 * reset with a loaded question), start from the saved answer instead. */
const resolveOrder = (
  order: string[],
  words: TRearrangeWord[],
  savedAnswers: string[],
) => {
  const ids = new Set(words.map((w) => w.value));
  let placed = order.filter((id) => ids.has(id));
  if (placed.length === 0) placed = savedAnswers.filter((id) => ids.has(id));
  const placedSet = new Set(placed);
  return [
    ...placed,
    ...words.map((w) => w.value).filter((id) => !placedSet.has(id)),
  ];
};

const useContainer = () => {
  const { control, getValues, setValue } = useFormContext();
  const questions = useFieldArray({
    control,
    name: "data.questions",
  });
  const watchedWords: TRearrangeWord[] | undefined = useWatch({
    control,
    name: "data.questions",
  });
  const words = useMemo(() => watchedWords ?? [], [watchedWords]);

  // Arranged order of every word id, including empty slots, so a slot that is
  // cleared and refilled comes back where it was.
  const [order, setOrder] = useState<string[]>(
    () => getValues("data.answers") ?? [],
  );
  const currentOrder = useMemo(
    () => resolveOrder(order, words, getValues("data.answers") ?? []),
    [order, words, getValues],
  );

  // Only filled-in question slots become answer slots.
  const answerWords = useMemo(() => {
    const byId = new Map(words.map((w) => [w.value, w]));
    return currentOrder
      .map((id) => byId.get(id))
      .filter((w): w is TRearrangeWord => !!w?.label?.trim());
  }, [currentOrder, words]);

  // data.answers is the filled word ids in the arranged order.
  useEffect(() => {
    const nextAnswers = answerWords.map((w) => w.value);
    const prevAnswers: string[] = getValues("data.answers") ?? [];
    if (
      nextAnswers.length !== prevAnswers.length ||
      nextAnswers.some((id, i) => id !== prevAnswers[i])
    ) {
      setValue("data.answers", nextAnswers, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [answerWords, getValues, setValue]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // The plus button adds a batch of empty word slots at once.
  const handleAddWord = () => {
    const newWords = Array.from({ length: SLOTS_PER_ADD }, () => ({
      value: nanoid(),
      label: "",
    }));
    setOrder([...currentOrder, ...newWords.map((w) => w.value)]);
    questions.append(newWords);
  };

  const handleRemoveWord = (index: number) => {
    const id = words[index]?.value;
    setOrder(currentOrder.filter((x) => x !== id));
    questions.remove(index);
  };

  // Reordering question slots only changes what learners see; the answer is
  // tracked by word id, so it is unaffected.
  const handleQuestionDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const ids = questions.fields.map((f) => f.id);
    const from = ids.indexOf(String(active.id));
    const to = ids.indexOf(String(over.id));
    if (from === -1 || to === -1) return;
    questions.move(from, to);
  };

  const handleAnswerDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    // Move within the full order so hidden (empty) slots keep their place.
    setOrder(
      arrayMove(
        currentOrder,
        currentOrder.indexOf(String(active.id)),
        currentOrder.indexOf(String(over.id)),
      ),
    );
  };

  return {
    control,
    questionFields: questions.fields,
    answerWords,
    sensors,
    handleAddWord,
    handleRemoveWord,
    handleQuestionDragEnd,
    handleAnswerDragEnd,
  };
};

export default useContainer;
