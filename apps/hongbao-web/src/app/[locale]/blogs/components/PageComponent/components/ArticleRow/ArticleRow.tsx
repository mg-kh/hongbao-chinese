import { Link } from "@/i18n/navigation";
import { TBlog } from "@/types/blog.type";
import { formatBlogDate } from "@/utils/formatBlogDate";
import { Text } from "@mantine/core";
import { ClockIcon } from "@phosphor-icons/react";
import { categoryCover } from "../../../../blogs.data";

interface Props {
  blog: TBlog;
}

/** Medium-style article list row: text-forward, small square thumbnail, thin divider. */
const ArticleRow: React.FC<Props> = ({ blog }) => (
  <Link
    href={`/blogs/${blog.slug}`}
    className="group! block! border-b! border-gray-200! py-6! no-underline! last:border-b-0!"
  >
    <div className="flex! items-start! gap-4! sm:gap-8!">
      <div className="min-w-0! flex-1!">
        {/* author */}
        <div className="mb-2! flex! items-center! gap-2!">
          <span
            className={`flex! h-5! w-5! shrink-0! items-center! justify-center! rounded-full! bg-gradient-to-br! text-[10px]! font-bold! text-white! ${categoryCover[blog.category]}`}
          >
            {blog.author.replace(/^Teacher\s+/i, "").charAt(0)}
          </span>
          <Text size="xs" c="gray.7" fw={500} lineClamp={1}>
            {blog.author}
          </Text>
        </div>

        {/* title */}
        <Text
          fw={800}
          lineClamp={2}
          className="text-[16px]! leading-snug! text-gray-900! transition-colors! duration-200! group-hover:text-gray-600! sm:text-[20px]!"
        >
          {blog.title}
        </Text>

        {/* preview */}
        <Text
          size="sm"
          c="gray.6"
          lineClamp={2}
          className="mt-1.5! leading-relaxed!"
        >
          {blog.excerpt}
        </Text>

        {/* meta */}
        <div className="mt-3! flex! flex-wrap! items-center! gap-x-2! gap-y-1! text-xs! text-gray-500!">
          <span>{formatBlogDate(blog.publishedAt)}</span>
          <span className="text-gray-300!">·</span>
          <span className="inline-flex! items-center! gap-1!">
            <ClockIcon size={12} />
            {blog.readMinutes} min read
          </span>
          <span className="ml-1! rounded-full! bg-gray-100! px-2! py-0.5! font-medium! text-gray-600!">
            {blog.category}
          </span>
        </div>
      </div>

      {/* thumbnail */}
      <div
        className={`relative! h-16! w-16! shrink-0! overflow-hidden! rounded-md! bg-gradient-to-br! sm:h-28! sm:w-28! ${categoryCover[blog.category]}`}
      >
        <span className="absolute! inset-0! flex! items-center! justify-center! text-2xl! font-bold! text-white/25! sm:text-4xl!">
          汉
        </span>
      </div>
    </div>
  </Link>
);

export default ArticleRow;
