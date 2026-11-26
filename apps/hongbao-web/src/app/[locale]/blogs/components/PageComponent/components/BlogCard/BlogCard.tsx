import { Link } from "@/i18n/navigation";
import { TBlog } from "@/types/blog.type";
import { formatBlogDate } from "@/utils/formatBlogDate";
import { Badge, Box, Group, Paper, Stack, Text } from "@mantine/core";
import { ClockIcon } from "@phosphor-icons/react";
import React from "react";
import { categoryBadge, categoryCover } from "../../../../blogs.data";

interface Props {
  blog: TBlog;
}

const BlogCard: React.FC<Props> = ({ blog }) => {
  return (
    <Paper
      component={Link}
      href={`/blogs/${blog.slug}`}
      withBorder
      bdrs={20}
      className="group! flex! flex-col! h-full! overflow-hidden! border-gray-200! bg-surface! no-underline! shadow-sm! transition-all! duration-200! ease-out! hover:-translate-y-0.5! hover:border-hongbao-red-200! hover:shadow-lg!"
    >
      {/* cover */}
      <Box
        className={`relative! h-40! shrink-0! overflow-hidden! bg-gradient-to-br! ${categoryCover[blog.category]}`}
      >
        <Box className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.18)_1px,transparent_0)] bg-[length:20px_20px]" />
        <Text className="absolute! inset-0! flex! items-center! justify-center! text-5xl! font-bold! text-white/25! transition-transform! duration-500! ease-out! group-hover:scale-110!">
          汉
        </Text>
        <Badge
          size="sm"
          radius="sm"
          color={categoryBadge[blog.category]}
          className="absolute! top-3! left-3! shadow-sm!"
        >
          {blog.category}
        </Badge>
      </Box>

      <Stack gap={10} p={18} className="flex-1!">
        <Text
          fw={700}
          className="text-base! leading-snug! text-gray-900! transition-colors! duration-200! group-hover:text-hongbao-red-600! dark:group-hover:text-night-red!"
          lineClamp={2}
        >
          {blog.title}
        </Text>

        <Text size="sm" c="gray.6" lineClamp={3} className="flex-1! leading-relaxed!">
          {blog.excerpt}
        </Text>

        <Group gap={8} justify="space-between" wrap="nowrap" pt={2}>
          <Text size="xs" c="gray.5" lineClamp={1}>
            {blog.author} · {formatBlogDate(blog.publishedAt)}
          </Text>
          <Group gap={4} wrap="nowrap" className="shrink-0!">
            <ClockIcon size={13} className="text-gray-400!" />
            <Text size="xs" c="gray.5">
              {blog.readMinutes} min
            </Text>
          </Group>
        </Group>
      </Stack>
    </Paper>
  );
};

export default BlogCard;
