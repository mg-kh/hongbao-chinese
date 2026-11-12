"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useDb from "./hooks/useDb";
import {
  CreateHanziGridSchema,
  FormField,
} from "./schemas/CreateHanziGridSchema";

const useContainer = () => {
  const { db, getData } = useDb();
  const form = useForm<FormField>({
    mode: "onChange",
    resolver: zodResolver(CreateHanziGridSchema),
    defaultValues: {
      website_name: "Hong Bao",
      website_type: "Chinese Online Class",
      pages: [
        // {
        //   rows: [
        //     {
        //       text: "狗",
        //       type: "noun",
        //       phinyin: "gǒu",
        //       meaning_english: "dog",
        //       meaning_my: "ေခွးမ",
        //     },
        //     {
        //       text: "暴",
        //       type: "adjective",
        //       phinyin: "Bào",
        //       meaning_english: "sudden and violent",
        //       meaning_my: "ရုတ်တရက်",
        //     },
        //     {
        //       text: "二",
        //       type: "noun",
        //       phinyin: "èr",
        //       meaning_english: "two",
        //       meaning_my: "နှစ်",
        //     },
        //     {
        //       text: "难",
        //       type: "adjective",
        //       phinyin: "nán",
        //       meaning_english: "difficult",
        //       meaning_my: "ခက်ခဲေသာ",
        //     },
        //   ],
        // },
        // {
        //   rows: [
        //     {
        //       text: "懂",
        //       type: "verb",
        //       phinyin: "dǒng",
        //       meaning_english: "understand",
        //       meaning_my: "နားလည်သည်",
        //     },
        //   ],
        // },
      ],
    },
  });
  const { reset } = form;

  useEffect(() => {
    getData()?.then((d) => {
      if (!d) return;
      reset(d);
    });
  }, [reset, db]);

  return {
    form,
  };
};

export default useContainer;
