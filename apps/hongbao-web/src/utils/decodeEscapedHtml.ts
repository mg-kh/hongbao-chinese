const ENTITY_MAP: Record<string, string> = {
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&amp;": "&",
};

/** Some saved rich-text fields come back HTML-escaped once too many (e.g.
 * `"&lt;p&gt;...&lt;/p&gt;"` instead of `"<p>...</p>"`), which renders as
 * literal visible tags through `dangerouslySetInnerHTML` instead of markup.
 * Undo exactly one level of escaping - only when the string is escaped to
 * begin with, so already-correct HTML (and legitimate text like "Q&amp;A"
 * inside real markup) passes through untouched. */
export const decodeEscapedHtml = (html: string) =>
  /^\s*&lt;/i.test(html)
    ? html.replace(/&lt;|&gt;|&quot;|&#39;|&apos;|&amp;/g, (entity) => ENTITY_MAP[entity])
    : html;
