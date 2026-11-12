export type TVideo = {
  id: string;
  subLessonId: string;
  title: string;
  description: string;
  url: string;
  duration: number | null;
  createdAt: string;
  updatedAt: string;
  isIntroVideo: boolean;
};

export type TVideoDetail = TVideo & {
  subLesson: {
    lessonId: string;
    lesson: {
      courseId: string;
    };
  };
};
