import { atom } from "jotai";

export type TAttachLevel = "course" | "lesson" | "sub_lesson";

export type TAttachTarget = {
  level: TAttachLevel;
  id: string;
  /** Human readable name of the course / lesson / sub-lesson, shown in the dialog. */
  title: string;
};

/**
 * Holds the node the user is currently attaching a quiz to.
 * `null` means the quiz picker dialog is closed.
 */
export const AttachTargetAtom = atom<TAttachTarget | null>(null);

export const ATTACH_LEVEL_LABEL: Record<TAttachLevel, string> = {
  course: "Course",
  lesson: "Lesson",
  sub_lesson: "Sub-lesson",
};
