import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { isUndefined } from "lodash";
import createIntlMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { TRole } from "./types/roles";

// type TUser = {
//   id: string;
//   name: string;
//   clerkId: string;
//   email: string;
//   role: TRole;
//   createdAt: string;
// };

// 🌐 public routes (WITH locale!)
const isPublicRoute = createRouteMatcher([
  "/",
  "/(en|mm)",
  "/(en|mm)/unauthorized",
  "/(en|mm)/course-detail(.*)",
  "/(en|mm)/shop(.*)",
  "/(en|mm)/blogs(.*)",
  "/(en|mm)/privacy-policy(.*)",
  "/(en|mm)/sign-in(.*)",
  "/(en|mm)/sign-up(.*)",
]);

// 🔐 role routes
const roleRoutes: Record<TRole, RegExp[]> = {
  // ADMIN can access every route
  ADMIN: [/.*/],
  // TEACHER is limited to the dashboard root, assets routes, create-hanzi-grid, and profile
  TEACHER: [
    /^\/(en|mm)\/dashboard\/?$/,
    /^\/(en|mm)\/dashboard\/assets/,
    /^\/(en|mm)\/dashboard\/create-hanzi-grid/,
    /^\/((en|mm)\/)?profile/,
  ],
  // STAFF rules not finalized yet, keep existing access for now
  STAFF: [/^\/(en|mm)\/dashboard/, /^\/((en|mm)\/)?profile/],
  // STUDENT is limited to (protected) routes
  STUDENT: [/^\/((en|mm)\/)?profile/],
};

const handleI18nRouting = createIntlMiddleware({
  locales: routing.locales,
  defaultLocale: routing.defaultLocale,
});

export default clerkMiddleware(
  async (auth, req) => {
    const defaultLocale = "mm";
    const pathname = req.nextUrl.pathname;
    const intlResponse = handleI18nRouting(req);

    if (isPublicRoute(req)) {
      return intlResponse;
    }

    try {
      const { sessionClaims } = await auth.protect();
      const role = sessionClaims?.metadata?.role;
      if (isUndefined(role)) {
        return NextResponse.redirect(
          new URL(`/${defaultLocale}/sign-in`, req.url),
        );
      }

      // 🔐 3. Protected route
      const allowedRoutes = roleRoutes[role] || [];
      const isAllowed = allowedRoutes.some((route) => route.test(pathname));

      if (!isAllowed) {
        return NextResponse.redirect(
          new URL(`/${defaultLocale}/unauthorized`, req.url),
        );
      }

      return intlResponse;
    } catch (error) {
      if (isPublicRoute(req)) {
        return intlResponse;
      }
      return NextResponse.redirect(
        new URL(`/${defaultLocale}/sign-in`, req.url),
      );
    }
  },
  { debug: false },
);

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)", "/([\\w-]+)?/users/(.+)"],
};
