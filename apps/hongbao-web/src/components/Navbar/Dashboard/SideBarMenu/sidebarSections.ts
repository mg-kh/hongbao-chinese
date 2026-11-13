import {
  ATTACH_QUIZ,
  CATEGORY_LIST,
  COURSE_LIST,
  CREATE_HANZI_GRID,
  DASHBOARD,
  FEED_BACKS,
  FLASHCARD_LIST,
  GENERATE_COUPONS,
  LESSON_LIST,
  MOCK_TEST_LIST,
  PURCHASES_APPROVED,
  QUIZZES_LIST,
  REVENUE,
  SUB_LESSON_LIST,
  USERS,
  VIDEO_LIST,
} from "@/constants/DashboardRoutes";
import {
  IconBooks,
  IconLayoutDashboard,
  IconMoneybagPlus,
  IconTools,
  IconUsers,
} from "@tabler/icons-react";
import type { useTranslations } from "next-intl";
import type { NavSection } from "./types/sideBarMenu.type";

export const getSidebarSections = (
  t: ReturnType<typeof useTranslations>,
): NavSection[] => [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: IconLayoutDashboard,
    links: [
      { label: "Overview", href: DASHBOARD },
      { label: "Revenue", href: REVENUE, segment: "revenue" },
    ],
  },
  {
    id: "users",
    label: "Users",
    icon: IconUsers,
    segment: "users",
    links: [
      { label: "All Users", href: USERS },
      { label: "Purchases", href: PURCHASES_APPROVED, segment: "purchases" },
      { label: "Feedbacks", href: FEED_BACKS, segment: "feedbacks" },
    ],
  },
  {
    id: "assets",
    label: "Assets",
    icon: IconBooks,
    segment: "assets",
    links: [
      {
        group: "General",
        links: [{ label: "Category", href: CATEGORY_LIST }],
      },
      {
        group: "Courses",
        links: [
          { label: t("DashboardSidebar.courses"), href: COURSE_LIST },
          { label: t("DashboardSidebar.lessons"), href: LESSON_LIST },
          { label: "Sub Lessons", href: SUB_LESSON_LIST },
          { label: "Videos", href: VIDEO_LIST },
          { label: "Quizzes", href: QUIZZES_LIST, segment: "quizzes" },
          {
            label: "Attach Quizzes",
            href: ATTACH_QUIZ,
            segment: "attach-quizzes",
          },
        ],
      },
      {
        group: "Flashcards",
        links: [{ label: "Flashcard", href: FLASHCARD_LIST }],
      },
      {
        group: "Mock Tests",
        links: [
          {
            label: "Mock Tests",
            href: MOCK_TEST_LIST,
            segment: "mock-tests",
          },
        ],
      },
      {
        group: "Blogs",
        links: [{ label: "Reading Blogs", href: "/" }],
      },
    ],
  },
  {
    id: "promotion",
    label: "Promotion",
    icon: IconMoneybagPlus,
    segment: "promotion",
    links: [
      { label: "Generate Coupons", href: GENERATE_COUPONS },
      // { label: "Pricing - Course", href: PRICING_COURSE },
      // { label: "Pricing - Flash Cards", href: PRICING_FLASHCARD },
      // { label: "Mock Tests", href: PRICING_MOCK_TEST },
    ],
  },
  {
    id: "tools",
    label: "Tools",
    icon: IconTools,
    segment: "create-hanzi-grid",
    links: [{ label: "Create Hanzi Grid", href: CREATE_HANZI_GRID }],
  },
];
