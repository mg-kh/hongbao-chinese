export type TCardExampleUsage = {
  pinyin: string;
  chinese: string;
  meaningEn: string;
  meaningMm: string;
};

export type TCardRes = {
  id: string;
  cnWord: string;
  pinyin: string;
  type: string;
  meaningEn: string;
  meaningMm: string;
  exampleUsage: TCardExampleUsage[];
  flashcardId?: string | null;
  flashcard?: {
    id: string;
    name: string;
    category?: { id: string; name: string } | null;
  } | null;
  createdAt: string;
};

export type TCardListRes = {
  items: TCardRes[];
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};
