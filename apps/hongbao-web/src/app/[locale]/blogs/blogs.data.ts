import { TBlog, TBlogCategory } from "@/types/blog.type";

export const blogCategories: TBlogCategory[] = [
  "Grammar",
  "Vocabulary",
  "Culture",
  "HSK Exam",
  "Study Tips",
];

/**
 * Placeholder posts used until a real blog endpoint exists - there is no
 * `/blogs` route on the API yet. Swap `useContainer` over to `useApiQuery`
 * once it does; the shape here matches TBlog so nothing else needs to change.
 */
export const blogs: TBlog[] = [
  {
    id: "1",
    slug: "measure-words-guide",
    title: "A Beginner's Guide to Chinese Measure Words (量词)",
    excerpt:
      "Why you can't just say 一书, and how to pick the right measure word without memorising hundreds of them.",
    category: "Grammar",
    author: "Teacher Li",
    publishedAt: "2026-08-12",
    readMinutes: 7,
    content: `
      <p>In Chinese, you almost never put a number directly in front of a noun. Instead you need a <strong>measure word</strong> (量词) between them.</p>
      <p>So instead of 一书 ("one book"), you say 一<strong>本</strong>书 — where 本 is the measure word used for bound volumes.</p>
      <h3>The one you can always fall back on</h3>
      <p>If you genuinely don't know the right measure word, use 个 (gè). It's the general-purpose measure word and native speakers will understand you perfectly.</p>
      <ul>
        <li>本 — books, magazines, notebooks</li>
        <li>张 — flat things: paper, tables, tickets</li>
        <li>只 — animals, and one of a pair</li>
        <li>杯 — cups of something</li>
      </ul>
      <blockquote>Don't try to memorise every measure word up front. Learn them attached to the nouns you actually use.</blockquote>
      <p>Once you've internalised a dozen or so common pairings, the rest start to feel intuitive.</p>
    `,
  },
  {
    id: "2",
    slug: "hsk-3-vocabulary-strategy",
    title: "How to Actually Retain HSK 3 Vocabulary",
    excerpt:
      "600 words sounds like a lot until you break it into daily batches and let spaced repetition do the heavy lifting.",
    category: "HSK Exam",
    author: "Teacher Wang",
    publishedAt: "2026-08-05",
    readMinutes: 6,
    content: `
      <p>HSK 3 expects around 600 words. Most learners try to cram them and forget half within a fortnight.</p>
      <h3>Split it into batches</h3>
      <p>Twenty new words a day for a month gets you there — and crucially, gives your brain time to consolidate between sessions.</p>
      <p>Pair every new word with a sentence you'd actually say. Isolated words fade; words attached to context stick.</p>
      <h3>Review before you forget</h3>
      <p>The best moment to review a word is just before you would have forgotten it. That's the whole idea behind spaced repetition, and it's why reviewing little and often beats one long session.</p>
    `,
  },
  {
    id: "3",
    slug: "tones-that-actually-stick",
    title: "Four Tones, One Habit: Training Your Ear",
    excerpt:
      "Tones aren't a memory problem, they're a listening problem. Here's a practice routine that fixes the root cause.",
    category: "Study Tips",
    author: "Teacher Chen",
    publishedAt: "2026-07-28",
    readMinutes: 5,
    content: `
      <p>Most learners can recite the four tones perfectly in isolation and still mangle them in a sentence. That's normal — and it tells you something important.</p>
      <h3>Listen before you speak</h3>
      <p>Spend the first few minutes of every session just listening, without trying to produce anything. Your ear needs to recognise the contour before your mouth can reproduce it.</p>
      <p>Then shadow: play a short phrase, and say it along with the speaker rather than after them. Matching in real time forces your pitch to track theirs.</p>
      <blockquote>Record yourself once a week. You'll hear progress you can't feel in the moment.</blockquote>
    `,
  },
  {
    id: "4",
    slug: "red-envelopes-explained",
    title: "红包: The Culture Behind the Red Envelope",
    excerpt:
      "More than money in paper — what red envelopes signal, when they're given, and the etiquette worth knowing.",
    category: "Culture",
    author: "Teacher Li",
    publishedAt: "2026-07-19",
    readMinutes: 4,
    content: `
      <p>红包 (hóngbāo) literally means "red packet". The money inside matters far less than what the gesture communicates.</p>
      <h3>When they're given</h3>
      <p>Lunar New Year is the obvious one, but red envelopes also appear at weddings, births, and graduations — any moment worth marking.</p>
      <h3>A little etiquette</h3>
      <ul>
        <li>Receive with both hands.</li>
        <li>Don't open it in front of the giver.</li>
        <li>Avoid amounts containing the digit 4 — 四 sounds like 死 ("death").</li>
        <li>Eight is lucky: 八 sounds like 发, as in 发财 ("to prosper").</li>
      </ul>
    `,
  },
  {
    id: "5",
    slug: "le-particle-demystified",
    title: "了 Isn't Past Tense: Clearing Up the Confusion",
    excerpt:
      "The single most misunderstood particle in Mandarin, explained through the two jobs it actually does.",
    category: "Grammar",
    author: "Teacher Wang",
    publishedAt: "2026-07-10",
    readMinutes: 8,
    content: `
      <p>Textbooks often introduce 了 as "past tense". It isn't — Mandarin doesn't mark tense the way English does. 了 marks <strong>completion</strong> and <strong>change of state</strong>.</p>
      <h3>Completed action</h3>
      <p>我吃了饭 — "I ate." The eating is complete. This can be past, but 明天吃了饭再去 ("tomorrow, after eating, then go") shows it works in the future too.</p>
      <h3>Change of state</h3>
      <p>天黑了 — "It's gotten dark." Nothing was completed; something changed.</p>
      <p>Once you stop mapping 了 onto English tense, most of the confusion dissolves.</p>
    `,
  },
  {
    id: "6",
    slug: "everyday-words-first",
    title: "The 100 Words That Cover Most Daily Conversation",
    excerpt:
      "A small core of high-frequency words does a surprising amount of work. Start here before going broad.",
    category: "Vocabulary",
    author: "Teacher Chen",
    publishedAt: "2026-06-30",
    readMinutes: 6,
    content: `
      <p>Word frequency in Chinese is steep: a small set of words accounts for a large share of everyday speech.</p>
      <h3>Start with function, not nouns</h3>
      <p>Beginners often load up on nouns — 苹果, 桌子, 学校. But 是, 有, 会, 想, 要, 能 appear in almost every sentence you'll ever hear.</p>
      <p>Master the connective tissue first, and you can slot in new nouns as you meet them.</p>
    `,
  },
];

export const findBlogBySlug = (slug: string) =>
  blogs.find((b) => b.slug === slug);

/** Cover treatment per category - no cover images exist yet, so each post gets a branded gradient. */
export const categoryCover: Record<TBlogCategory, string> = {
  Grammar: "from-hongbao-red-500 to-hongbao-maroon-700",
  Vocabulary: "from-hongbao-orange-500 to-hongbao-red-600",
  Culture: "from-hongbao-gold-500 to-hongbao-orange-600",
  "HSK Exam": "from-hongbao-maroon-500 to-hongbao-brown-700",
  "Study Tips": "from-hongbao-brown-500 to-hongbao-maroon-700",
};

export const categoryBadge: Record<TBlogCategory, string> = {
  Grammar: "hongbao-red",
  Vocabulary: "hongbao-orange",
  Culture: "hongbao-gold",
  "HSK Exam": "hongbao-maroon",
  "Study Tips": "hongbao-brown",
};
