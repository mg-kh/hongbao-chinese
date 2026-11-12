/** Formats an ISO date string as e.g. "12 Aug 2026". */
export const formatBlogDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
