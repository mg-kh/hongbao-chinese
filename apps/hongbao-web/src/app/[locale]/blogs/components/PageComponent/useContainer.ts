"use client";

import { TBlogCategory } from "@/types/blog.type";
import { useMemo, useState } from "react";
import { blogs } from "../../blogs.data";

const useContainer = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<TBlogCategory | "All">("All");

  const results = useMemo(() => {
    const q = search.trim().toLowerCase();

    return blogs
      .filter((b) => {
        const matchesCategory = category === "All" || b.category === category;
        const matchesSearch =
          !q ||
          b.title.toLowerCase().includes(q) ||
          b.excerpt.toLowerCase().includes(q);

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  }, [search, category]);

  return {
    search,
    setSearch,
    category,
    setCategory,
    results,
    total: results.length,
  };
};

export default useContainer;
