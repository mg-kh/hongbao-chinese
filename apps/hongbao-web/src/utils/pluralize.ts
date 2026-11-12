/** Returns `count` with the singular or plural form, e.g. `1 Question`, `3 Questions`. */
export const pluralize = (
  count: number,
  singular: string,
  plural = `${singular}s`,
) => `${count} ${count === 1 ? singular : plural}`;
