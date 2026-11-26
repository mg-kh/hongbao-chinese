"use client";

import MobileBottomNav from "@/components/Navbar/MobileBottomNav/MobileBottomNav";
import { publicBottomNavItems } from "@/components/Navbar/MobileBottomNav/publicNavItems";
import ClientLayout from "@/layouts/ClientLayout/ClientLayout";
import { TBlogCategory } from "@/types/blog.type";
import { Box, Container, Stack, Text, TextInput } from "@mantine/core";
import { ArticleIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import { blogCategories } from "../../blogs.data";
import ArticleRow from "./components/ArticleRow/ArticleRow";
import useContainer from "./useContainer";

const PageComponent = () => {
  const { search, setSearch, category, setCategory, results, total } =
    useContainer();

  const filters: (TBlogCategory | "All")[] = ["All", ...blogCategories];

  return (
    <ClientLayout size={"100%"} p={0} hideFooterOnMobile>
      <Container size={"sm"} px={{ base: 16, sm: 24 }}>
        <Stack gap={0} className="pb-10! pt-8! sm:pt-12!">
          {/* header */}
          <Text
            component="h1"
            fw={800}
            className="text-[1.9rem]! leading-[1.1]! tracking-tight! text-gray-900! sm:text-[2.4rem]!"
          >
            Hong Bao Journal
          </Text>
          <Text c="gray.6" className="mt-2! leading-relaxed!">
            Grammar breakdowns, exam strategy, and culture notes from our
            teaching team.
          </Text>

          {/* sticky topic bar */}
          <div className="sticky! top-20! z-20! -mx-4! mt-6! border-b! border-gray-200! bg-gray-50/95! px-4! pb-3! pt-3! backdrop-blur-md! sm:-mx-6! sm:px-6!">
            <TextInput
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              placeholder="Search articles..."
              size="sm"
              radius="xl"
              aria-label="Search articles"
              leftSection={<MagnifyingGlassIcon size={16} />}
              classNames={{
                input:
                  "border-0! bg-gray-100! focus:bg-surface! focus:ring-1! focus:ring-hongbao-red-200!",
              }}
            />
            <div className="mt-2.5! flex! gap-2! overflow-x-auto! [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {filters.map((f) => {
                const active = category === f;
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setCategory(f)}
                    aria-pressed={active}
                    className={`shrink-0! rounded-full! px-3.5! py-1.5! text-xs! font-semibold! cursor-pointer! transition-colors! duration-200! ease-out! ${
                      active
                        ? "bg-hongbao-red-500! text-white!"
                        : "bg-gray-100! text-gray-600! hover:bg-gray-200!"
                    }`}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          </div>

          {/* list */}
          {total === 0 ? (
            <Stack align="center" gap={10} className="py-20!">
              <Box className="flex! h-14! w-14! items-center! justify-center! rounded-2xl! bg-hongbao-red-50! text-hongbao-red-600! dark:text-night-red!">
                <ArticleIcon size={26} />
              </Box>
              <Text fw={700}>No articles found</Text>
              <Text size="sm" c="gray.6" ta="center" className="max-w-[360px]!">
                Try a different search term or category.
              </Text>
            </Stack>
          ) : (
            <div className="mt-2!">
              {results.map((b) => (
                <ArticleRow key={b.id} blog={b} />
              ))}
            </div>
          )}
        </Stack>
      </Container>

      {/* mobile: replaces the footer with the shared public bottom bar */}
      <MobileBottomNav items={publicBottomNavItems} />
    </ClientLayout>
  );
};

export default PageComponent;
