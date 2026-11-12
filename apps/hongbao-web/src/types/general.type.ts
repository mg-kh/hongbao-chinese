export type TErrorOptions = {
  message?: string;
  statusCode?: number;
};
export type TAtomValue = boolean | string | number | undefined;

export enum FileTypeEnum {
  GENERAL = "general",
  QUESTION = "question",
  BLOG = "blog",
}
