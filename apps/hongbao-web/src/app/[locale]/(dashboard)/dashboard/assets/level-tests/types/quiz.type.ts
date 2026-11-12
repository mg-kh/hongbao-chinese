export type TQuiz = {
  id: string;
  title: string;
  description: string;
  levelTestId: string;
  isLevelTest: boolean;
  sections: {
    id: string;
    title: string;
    description: string;
    questionCount: number;
  }[];
};
