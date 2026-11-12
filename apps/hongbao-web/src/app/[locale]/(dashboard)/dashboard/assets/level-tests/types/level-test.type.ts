export type TLevelTestRes = {
  id: string;
  title: string;
  description?: string | null;
  price?: number | null;
  perTime?: number | null;
  published?: boolean;
  categoryId: string;
  category?: {
    id: string;
    name: string;
  };
  createdAt?: string;
};
