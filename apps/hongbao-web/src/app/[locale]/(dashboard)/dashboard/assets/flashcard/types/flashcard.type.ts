import { TCardRes } from "../../card/types/card.type";

export type TFlashcardRes = {
  id: string;
  name: string;
  price: number;
  published: boolean;
  categoryId: string;
  category?: {
    id: string;
    name: string;
  };
  _count?: {
    cards: number;
  };
  cards?: TCardRes[];
  createdAt: string;
  updatedAt: string;
};
