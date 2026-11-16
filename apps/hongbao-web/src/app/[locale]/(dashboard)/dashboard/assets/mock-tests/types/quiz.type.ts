export type TQuiz = {
  id: string;
  title: string;
  description: string;
  mockTestId: string;
  isMockTest: boolean;
  sections: {
    id: string;
    title: string;
    description: string;
    questionCount: number;
  }[];
};
