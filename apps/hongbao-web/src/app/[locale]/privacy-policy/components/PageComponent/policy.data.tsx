/**
 * Section copy lives in the `PrivacyPolicy.sections.<key>` messages namespace.
 * `paragraphs` / `bullets` list the message keys (inside that section) to
 * render, in order.
 */
export type PolicySection = {
  /** DOM anchor id */
  id: string;
  /** messages key under `PrivacyPolicy.sections` */
  key: string;
  paragraphs?: string[];
  bullets?: string[];
};

export const policySections: PolicySection[] = [
  {
    id: "information-we-collect",
    key: "information_we_collect",
    paragraphs: ["p1"],
    bullets: ["b1", "b2", "b3", "b4", "b5"],
  },
  {
    id: "how-we-use-it",
    key: "how_we_use_it",
    bullets: ["b1", "b2", "b3", "b4", "b5", "b6"],
  },
  {
    id: "payments",
    key: "payments",
    paragraphs: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "notifications",
    key: "notifications",
    paragraphs: ["p1", "p2"],
    bullets: ["b1", "b2"],
  },
  {
    id: "cookies",
    key: "cookies",
    bullets: ["b1", "b2", "b3"],
  },
  {
    id: "sharing",
    key: "sharing",
    paragraphs: ["p1"],
    bullets: ["b1", "b2", "b3"],
  },
  {
    id: "retention",
    key: "retention",
    bullets: ["b1", "b2", "b3"],
  },
  {
    id: "children",
    key: "children",
    paragraphs: ["p1", "p2"],
  },
  {
    id: "your-rights",
    key: "your_rights",
    bullets: ["b1", "b2", "b3", "b4", "b5"],
  },
  {
    id: "security",
    key: "security",
    paragraphs: ["p1", "p2", "p3"],
  },
  {
    id: "changes",
    key: "changes",
    paragraphs: ["p1", "p2"],
  },
  {
    id: "contact",
    key: "contact",
    paragraphs: ["p1"],
    bullets: ["b1", "b2"],
  },
];
