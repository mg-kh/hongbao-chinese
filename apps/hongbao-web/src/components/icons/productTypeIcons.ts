import {
  BookOpenIcon,
  CardsIcon,
  ExamIcon,
} from "@phosphor-icons/react/dist/ssr";

/**
 * Single source of truth for the icons that represent the three product
 * types across the whole web app (shop, profile, purchases, navbars, home).
 * Always import from here instead of picking an icon ad hoc, so a course,
 * mock test or flashcard looks the same wherever it appears.
 *
 * Uses the `/ssr` build so it is safe in both server and client components.
 */
export const CourseTypeIcon = BookOpenIcon;
export const MockTestTypeIcon = ExamIcon;
export const FlashcardTypeIcon = CardsIcon;

export const PRODUCT_TYPE_ICONS = {
  course: CourseTypeIcon,
  "mock-test": MockTestTypeIcon,
  flashcard: FlashcardTypeIcon,
} as const;

export type TProductTypeIconKey = keyof typeof PRODUCT_TYPE_ICONS;
