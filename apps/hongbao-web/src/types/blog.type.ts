export type TBlogCategory =
  | "Grammar"
  | "Vocabulary"
  | "Culture"
  | "HSK Exam"
  | "Study Tips";

export type TBlog = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** HTML body, rendered through RichTextContent (same shape the editor produces). */
  content: string;
  category: TBlogCategory;
  author: string;
  publishedAt: string;
  readMinutes: number;
};
