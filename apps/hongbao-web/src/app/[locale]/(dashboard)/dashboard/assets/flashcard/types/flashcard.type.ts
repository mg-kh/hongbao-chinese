export type TFlashcardExampleUsage = {
  pinyin: string;
  chinese: string;
  meaningEn: string;
  meaningMm: string;
};

export type TFlashcardRes = {
  id: string;
  cnWord: string;
  pinyin: string;
  type: string;
  meaningEn: string;
  meaningMm: string;
  exampleUsage: TFlashcardExampleUsage[];
  categoryId: string;
  category?: {
    id: string;
    name: string;
  };
  createdAt: string;
};
