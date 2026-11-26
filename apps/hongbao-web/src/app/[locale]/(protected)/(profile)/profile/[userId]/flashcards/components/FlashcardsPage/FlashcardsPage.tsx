"use client";

import CustomBreadCrumb from "@/components/CustomBreadCrumb/CustomBreadCrumb";
import { Button, Center, Loader, Paper, Stack, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import Link from "next/link";
import FlashcardTile from "../FlashcardTile/FlashcardTile";
import useContainer from "./useContainer";

const FlashcardsPage = () => {
  const { userId, flashcards, isLoading } = useContainer();
  const t = useTranslations("Profile.Flashcards");

  return (
    <Stack gap={20} className="flex-1!">
      <CustomBreadCrumb
        title={t("title")}
        links={[
          {
            label: t("breadcrumb_profile"),
            href: `/profile/${userId}`,
            isActive: true,
          },
          {
            label: t("breadcrumb_flashcards"),
            href: `/profile/${userId}/flashcards`,
            isActive: false,
          },
        ]}
      />

      {isLoading ? (
        <Center py={60}>
          <Loader color="hongbao-red" />
        </Center>
      ) : flashcards.length === 0 ? (
        <Paper
          withBorder
          bdrs={20}
          p={{ base: 28, sm: 40 }}
          className="border-dashed! border-gray-300! bg-gray-50/60! text-center!"
        >
          <Stack gap={12} align="center">
            <Text c="gray.6">{t("List.empty")}</Text>
            <Button
              component={Link}
              href="/shop?type=flashcard"
              color="hongbao-red"
              radius="md"
            >
              {t("browse")}
            </Button>
          </Stack>
        </Paper>
      ) : (
        <div className="grid! grid-cols-1! sm:grid-cols-2! md:grid-cols-3! gap-3!">
          {flashcards.map((f) => (
            <FlashcardTile
              key={f.id}
              flashcard={f}
              href={`/profile/${userId}/flashcards/${f.id}`}
            />
          ))}
        </div>
      )}
    </Stack>
  );
};

export default FlashcardsPage;
