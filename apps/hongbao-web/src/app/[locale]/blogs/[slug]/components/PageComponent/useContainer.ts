"use client";

import { useParams } from "next/navigation";
import { blogs, findBlogBySlug } from "../../../blogs.data";

const useContainer = () => {
  const { slug } = useParams();

  const blog = findBlogBySlug(String(slug));

  // Same category first, falling back to anything else, so the rail is never
  // empty just because a category only has one post.
  const related = blog
    ? [
        ...blogs.filter(
          (b) => b.id !== blog.id && b.category === blog.category,
        ),
        ...blogs.filter(
          (b) => b.id !== blog.id && b.category !== blog.category,
        ),
      ].slice(0, 3)
    : [];

  return {
    blog,
    related,
  };
};

export default useContainer;
