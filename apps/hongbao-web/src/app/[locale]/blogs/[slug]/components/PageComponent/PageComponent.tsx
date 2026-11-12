"use client";

import RichTextContent from "@/components/RichTextContent/RichTextContent";
import { Link } from "@/i18n/navigation";
import ClientLayout from "@/layouts/ClientLayout/ClientLayout";
import MobileBottomNav from "@/components/Navbar/MobileBottomNav/MobileBottomNav";
import { publicBottomNavItems } from "@/components/Navbar/MobileBottomNav/publicNavItems";
import { formatBlogDate } from "@/utils/formatBlogDate";
import {
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import {
  ArrowLeftIcon,
  ArticleIcon,
  ClockIcon,
  UserCircleIcon,
} from "@phosphor-icons/react";
import React from "react";
import { categoryBadge, categoryCover } from "../../../blogs.data";
import BlogCard from "../../../components/PageComponent/components/BlogCard/BlogCard";
import useContainer from "./useContainer";

const PageComponent = () => {
  const { blog, related } = useContainer();

  if (!blog) {
    return (
      <ClientLayout>
        <Stack align="center" gap={14} className="py-24!">
          <Box className="flex! items-center! justify-center! w-16! h-16! rounded-2xl! bg-hongbao-red-50! text-hongbao-red-600!">
            <ArticleIcon size={30} />
          </Box>
          <Text fw={700} size="lg">
            Article not found
          </Text>
          <Text size="sm" c="gray.6" ta="center">
            This article may have been moved or removed.
          </Text>
          <Button
            component={Link}
            href="/blogs"
            color="hongbao-red"
            radius="md"
            leftSection={<ArrowLeftIcon size={15} weight="bold" />}
          >
            Back to blogs
          </Button>
        </Stack>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout size={"100%"} p={0} hideFooterOnMobile>
      {/* cover */}
      <Box
        className={`relative! overflow-hidden! bg-gradient-to-br! ${categoryCover[blog.category]}`}
      >
        <Box className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.16)_1px,transparent_0)] bg-[length:24px_24px]" />
        <Text className="pointer-events-none! absolute! -right-6! -bottom-10! text-[10rem]! font-bold! text-white/10! leading-none!">
          汉
        </Text>

        <Container size={"md"} px={{ base: 16, sm: 24 }} className="relative!">
          <Stack gap={16} className="py-12! sm:py-16! md:py-20!">
            <Link
              href="/blogs"
              className="flex! items-center! gap-1.5! w-fit! no-underline! text-white/70! transition-colors! duration-200! hover:text-white!"
            >
              <ArrowLeftIcon size={14} weight="bold" />
              <Text size="xs" fw={600} c="white" className="opacity-90!">
                All articles
              </Text>
            </Link>

            <Badge
              size="sm"
              radius="sm"
              variant="white"
              c={categoryBadge[blog.category]}
              className="w-fit!"
            >
              {blog.category}
            </Badge>

            <Text
              fw={800}
              c="white"
              className="text-2xl! sm:text-3xl! md:text-4xl! leading-tight!"
            >
              {blog.title}
            </Text>

            <Text
              c="white"
              className="opacity-80! text-sm! sm:text-base! leading-relaxed! max-w-[640px]!"
            >
              {blog.excerpt}
            </Text>

            <Group gap={16} wrap="wrap" pt={4}>
              <Group gap={6} wrap="nowrap">
                <UserCircleIcon size={16} className="text-white/70!" />
                <Text size="xs" c="white" className="opacity-80!">
                  {blog.author}
                </Text>
              </Group>
              <Text size="xs" c="white" className="opacity-60!">
                {formatBlogDate(blog.publishedAt)}
              </Text>
              <Group gap={5} wrap="nowrap">
                <ClockIcon size={14} className="text-white/70!" />
                <Text size="xs" c="white" className="opacity-80!">
                  {blog.readMinutes} min read
                </Text>
              </Group>
            </Group>
          </Stack>
        </Container>
      </Box>

      {/* body */}
      <Container size={"md"} px={{ base: 16, sm: 24 }}>
        <Box className="py-10! sm:py-14!">
          <RichTextContent
            html={blog.content}
            className="text-gray-700! leading-relaxed! [&_p]:mb-4! [&_h3]:mt-8! [&_h3]:mb-3! [&_h3]:text-lg! [&_h3]:font-bold! [&_h3]:text-gray-900! [&_strong]:font-semibold! [&_strong]:text-gray-900! [&_ul]:list-disc! [&_ul]:pl-5! [&_ul]:mb-4! [&_ul]:space-y-1.5! [&_ol]:list-decimal! [&_ol]:pl-5! [&_ol]:mb-4! [&_li]:leading-relaxed! [&_blockquote]:border-l-4! [&_blockquote]:border-hongbao-red-200! [&_blockquote]:bg-hongbao-cream-50! [&_blockquote]:rounded-r-xl! [&_blockquote]:py-3! [&_blockquote]:px-4! [&_blockquote]:my-5! [&_blockquote]:text-gray-600! [&_blockquote]:italic! [&_a]:text-hongbao-red-600! [&_a]:underline!"
          />

          {related.length > 0 && (
            <>
              <Divider my={{ base: 32, sm: 44 }} color="gray.2" />

              <Stack gap={16}>
                <Text size="xl" fw={"bold"} c={"hongbao-red"}>
                  Keep reading
                </Text>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {related.map((b) => (
                    <BlogCard key={b.id} blog={b} />
                  ))}
                </div>
              </Stack>
            </>
          )}
        </Box>
      </Container>

      {/* footer CTA */}
      <Container size={"xl"} px={{ base: 16, sm: 24 }}>
        <Paper
          withBorder
          bdrs={24}
          p={{ base: 24, sm: 36 }}
          className="mb-12! border-gray-200! bg-gradient-to-br! from-hongbao-cream-50! to-hongbao-red-50/60!"
        >
          <Stack align="center" gap={10}>
            <Text fw={800} className="text-lg! sm:text-xl!" ta="center">
              Ready to put this into practice?
            </Text>
            <Text size="sm" c="gray.6" ta="center" className="max-w-[420px]!">
              Structured HSK courses, flashcards, and spaced repetition — all in
              one place.
            </Text>
            <Button
              component={Link}
              href="/"
              color="hongbao-red"
              radius="md"
              size="md"
              className="mt-2!"
            >
              Explore courses
            </Button>
          </Stack>
        </Paper>
      </Container>

      {/* mobile: replaces the footer with the shared public bottom bar */}
      <MobileBottomNav items={publicBottomNavItems} />
    </ClientLayout>
  );
};

export default PageComponent;
