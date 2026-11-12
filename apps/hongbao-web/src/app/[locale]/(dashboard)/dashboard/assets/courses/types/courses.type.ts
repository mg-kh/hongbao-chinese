export type TCourseRes = {
  id: string;
  title: string;
  description: string;
  includedAssets: string[];
  level: string;
  categoryId: string;
  isFree: boolean;
  price: number;
  perTime: number;
  discount: number;
  published: boolean;
  createdAt: string;
  quizzes: {
    id: string;
    title: string;
    description: string;
  }[];
  quizzesCount: number;
  category: {
    id: string;
    name: string;
  };
};
