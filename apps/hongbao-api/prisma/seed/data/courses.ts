/**
 * -----------------------
 * Course seed content
 * -----------------------
 * Three real Mandarin Chinese courses, each with three lessons and each
 * lesson with three sub-lessons. Videos all point at a public sample clip
 * so the player has something to load.
 */

export interface SeedSubLesson {
  title: string;
  description: string;
}

export interface SeedLesson {
  title: string;
  description: string;
  subLessons: SeedSubLesson[];
}

export interface SeedCourse {
  title: string;
  description: string;
  isFree: boolean;
  /** Price in the smallest currency unit (e.g. MMK). 0 when the course is free. */
  price: number;
  /** Access duration multiplier in months used when a purchase is made. */
  perTime: number;
  includedAssets: string[];
  introVideoTitle: string;
  lessons: SeedLesson[];
}

export const SAMPLE_VIDEO_URL = 'https://samplelib.com/preview/mp4/sample-5s.mp4';

export const COURSES: SeedCourse[] = [
  {
    title: 'HSK 1: Foundations of Mandarin Chinese',
    description:
      'Start speaking Mandarin from day one. This beginner course covers Pinyin, tones, everyday greetings, numbers and time so you can hold your first simple conversations and pass the HSK 1 exam.',
    isFree: true,
    price: 0,
    perTime: 0,
    includedAssets: [
      'HSK 1 vocabulary list (150 words)',
      'Pinyin pronunciation chart',
      'Printable stroke-order worksheets',
    ],
    introVideoTitle: 'Welcome to HSK 1: How to Use This Course',
    lessons: [
      {
        title: 'Lesson 1: Pinyin and Pronunciation',
        description:
          'Learn the building blocks of Mandarin sound: initials, finals and the four tones.',
        subLessons: [
          {
            title: 'Initials and Finals',
            description:
              'Meet the consonant and vowel sounds of Mandarin and practise the ones that do not exist in English.',
          },
          {
            title: 'The Four Tones',
            description:
              'Understand how pitch changes meaning and drill the first, second, third and fourth tones.',
          },
          {
            title: 'Tone Change Rules',
            description:
              'Learn the common tone sandhi rules, including third-tone pairs and the special cases of 不 and 一.',
          },
        ],
      },
      {
        title: 'Lesson 2: Greetings and Introductions',
        description:
          'Say hello, introduce yourself and ask basic questions about other people.',
        subLessons: [
          {
            title: 'Saying Hello and Goodbye',
            description:
              'Use 你好, 您好, 再见 and 明天见 in the right situations.',
          },
          {
            title: "Asking Someone's Name",
            description:
              'Ask and answer 你叫什么名字？ and introduce yourself with 我叫……',
          },
          {
            title: 'Countries and Nationalities',
            description:
              'Talk about where you are from using 我是……人 and country names.',
          },
        ],
      },
      {
        title: 'Lesson 3: Numbers, Dates and Time',
        description:
          'Count, give dates and tell the time so you can talk about your schedule.',
        subLessons: [
          {
            title: 'Numbers 0 to 100',
            description:
              'Learn the number system and how tens and units combine in Mandarin.',
          },
          {
            title: 'Days, Months and Dates',
            description:
              'Use 星期, 月 and 号 to say what day it is and when things happen.',
          },
          {
            title: 'Telling Time',
            description:
              'Ask 现在几点？ and answer with 点, 分, 半 and 刻.',
          },
        ],
      },
    ],
  },
  {
    title: 'HSK 2: Everyday Conversation',
    description:
      'Build on your basics and start handling real daily situations in Mandarin. Learn to talk about your family, go shopping, and get around a Chinese city with confidence.',
    isFree: false,
    price: 49000,
    perTime: 3,
    includedAssets: [
      'HSK 2 vocabulary list (300 words)',
      'Dialogue audio pack',
      'Grammar summary PDF',
      'Practice quiz bank',
    ],
    introVideoTitle: 'Welcome to HSK 2: What You Will Be Able to Do',
    lessons: [
      {
        title: 'Lesson 1: Family and Daily Life',
        description:
          'Describe your family and talk through an ordinary day.',
        subLessons: [
          {
            title: 'Talking About Your Family',
            description:
              'Introduce family members and say how many people are in your family with 有 and measure words.',
          },
          {
            title: 'Describing Daily Routines',
            description:
              'Use time words and common verbs to describe what you do in the morning, afternoon and evening.',
          },
          {
            title: 'Household Items and Chores',
            description:
              'Name things around the home and talk about simple chores.',
          },
        ],
      },
      {
        title: 'Lesson 2: Shopping and Money',
        description:
          'Ask about prices, describe what you want and complete a purchase.',
        subLessons: [
          {
            title: 'Prices and Bargaining',
            description:
              'Ask 多少钱？ understand prices in 块 and 毛, and politely negotiate.',
          },
          {
            title: 'Colours, Sizes and Preferences',
            description:
              'Describe products by colour and size and say which one you prefer.',
          },
          {
            title: 'Making a Purchase',
            description:
              'Work through a full shop dialogue from choosing an item to paying.',
          },
        ],
      },
      {
        title: 'Lesson 3: Getting Around the City',
        description:
          'Find your way and use transport in a Chinese-speaking city.',
        subLessons: [
          {
            title: 'Asking for Directions',
            description:
              'Use 怎么走, 往左, 往右 and 一直走 to ask for and follow directions.',
          },
          {
            title: 'Taking Public Transport',
            description:
              'Buy tickets and ask about the bus and subway using 坐 and 站.',
          },
          {
            title: 'Booking and Taking a Taxi',
            description:
              'Tell a driver where to go, ask how long it will take and confirm the fare.',
          },
        ],
      },
    ],
  },
  {
    title: 'Mandarin Chinese Characters: Reading and Writing',
    description:
      'Stop relying on Pinyin. This course teaches how Chinese characters are built, the most useful high-frequency characters, and how to read short real-world texts and write simple notes by hand.',
    isFree: false,
    price: 39000,
    perTime: 2,
    includedAssets: [
      '300 high-frequency character deck',
      'Radical reference sheet',
      'Grid writing paper (printable)',
    ],
    introVideoTitle: 'Welcome: Why Learning Characters Is Easier Than You Think',
    lessons: [
      {
        title: 'Lesson 1: Character Basics',
        description:
          'Understand the components that every character is made from.',
        subLessons: [
          {
            title: 'Strokes and Stroke Order',
            description:
              'Learn the basic strokes and the rules that decide the order you write them in.',
          },
          {
            title: 'Radicals and Components',
            description:
              'See how radicals hint at meaning and how components combine into full characters.',
          },
          {
            title: 'Character Structure',
            description:
              'Recognise left-right, top-bottom and enclosed structures to remember characters faster.',
          },
        ],
      },
      {
        title: 'Lesson 2: High-Frequency Characters',
        description:
          'Learn the characters that appear in almost every sentence.',
        subLessons: [
          {
            title: 'People and Pronouns',
            description:
              'Read and write 我, 你, 他, 她, 们 and family characters.',
          },
          {
            title: 'Verbs of Motion and Action',
            description:
              'Master common verbs such as 去, 来, 看, 吃, 喝 and 做.',
          },
          {
            title: 'Time and Place Words',
            description:
              'Read 今天, 明天, 现在, 这里 and 那里 at a glance.',
          },
        ],
      },
      {
        title: 'Lesson 3: Building Reading Skills',
        description:
          'Put characters together and read short real texts.',
        subLessons: [
          {
            title: 'Reading Short Sentences',
            description:
              'Read simple sentences without Pinyin and check your comprehension.',
          },
          {
            title: 'Common Signs and Notices',
            description:
              'Decode everyday signs like 入口, 出口, 洗手间 and 小心.',
          },
          {
            title: 'Writing a Simple Note',
            description:
              'Write a short message to a friend using the characters from this course.',
          },
        ],
      },
    ],
  },
];
