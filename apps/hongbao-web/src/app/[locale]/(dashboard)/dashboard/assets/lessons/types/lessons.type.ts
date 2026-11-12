export type TLessonRes = {
  id: string;
  userId: string;
  courseId: string;
  title: string;
  description: string;
  createdAt: string;
  course: {
    title: string;
  };
  quizzes: {
    id: string;
    title: string;
    description: string;
  }[];
  quizzesCount: number;
};
