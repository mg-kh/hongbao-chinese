export type FlashCard = {
  id: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
  example?: string;
  exampleMeaning?: string;
};

/**
 * Starter HSK1 deck used until a real vocabulary endpoint exists. There is
 * currently no backend concept of "words in a course", so this is a fixed
 * general-purpose deck rather than something derived from the student's
 * actual enrolled courses.
 */
export const starterDeck: FlashCard[] = [
  {
    id: "1",
    hanzi: "你好",
    pinyin: "nǐ hǎo",
    meaning: "Hello",
    example: "你好，很高兴认识你。",
    exampleMeaning: "Hello, nice to meet you.",
  },
  { id: "2", hanzi: "谢谢", pinyin: "xièxie", meaning: "Thank you" },
  { id: "3", hanzi: "再见", pinyin: "zàijiàn", meaning: "Goodbye" },
  { id: "4", hanzi: "对不起", pinyin: "duìbùqǐ", meaning: "Sorry" },
  {
    id: "5",
    hanzi: "没关系",
    pinyin: "méi guānxi",
    meaning: "It's okay, no problem",
  },
  { id: "6", hanzi: "我", pinyin: "wǒ", meaning: "I, me" },
  { id: "7", hanzi: "你", pinyin: "nǐ", meaning: "You" },
  {
    id: "8",
    hanzi: "是",
    pinyin: "shì",
    meaning: "To be (am / is / are)",
    example: "我是学生。",
    exampleMeaning: "I am a student.",
  },
  { id: "9", hanzi: "不", pinyin: "bù", meaning: "Not, no" },
  { id: "10", hanzi: "老师", pinyin: "lǎoshī", meaning: "Teacher" },
  { id: "11", hanzi: "学生", pinyin: "xuésheng", meaning: "Student" },
  { id: "12", hanzi: "朋友", pinyin: "péngyou", meaning: "Friend" },
  { id: "13", hanzi: "吃饭", pinyin: "chī fàn", meaning: "To eat a meal" },
  {
    id: "14",
    hanzi: "喜欢",
    pinyin: "xǐhuan",
    meaning: "To like",
    example: "我喜欢喝茶。",
    exampleMeaning: "I like drinking tea.",
  },
];
