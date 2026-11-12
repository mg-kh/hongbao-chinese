export type TSubLessonRes = {
  id: string;
  userId: string;
  lessonId: string;
  title: string;
  description: string;
  video_url: string;
  createdAt: string;
  lesson: { title?: string; courseId?: string };
  quizzes: {
    id: string;
    title: string;
    description: string;
  }[];
  quizzesCount: number;
};
