"use client";

import CustomBreadCrumb from "@/components/CustomBreadCrumb/CustomBreadCrumb";
import LoaderComponent from "@/components/LoaderComponent/LoaderComponent";
import {
  Box,
  Button,
  Group,
  Pagination,
  Paper,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { ArrowRightIcon, ShoppingCartIcon } from "@phosphor-icons/react";
import { isEmpty } from "lodash";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import CourseCard from "../../../components/CourseCard/CourseCard";
import useContainer from "./useContainer";

/** Message keys for the copy shown when a status filter turns up nothing. */
const emptyByFilter = {
  ALL: "empty.all",
  APPROVED: "empty.approved",
  PENDING: "empty.pending",
  EXPIRED: "empty.expired",
} as const;

const PageComponent = () => {
  const {
    isLoading,
    isFetching,
    stats,
    page,
    setPage,
    totalPages,
    filter,
    setFilter,
    filters,
    filteredCourses,
    activeCount,
  } = useContainer();
  const { userId } = useParams();
  const t = useTranslations("Profile.MyCourses");

  return (
    <Stack gap={24} className="flex-1!">
      {/* page header */}
      <Group justify="space-between" align="center" wrap="wrap" gap={12}>
        <CustomBreadCrumb
          title={t("title")}
          links={[
            {
              label: t("breadcrumb_profile"),
              href: `/profile/${userId}`,
              isActive: true,
            },
            { label: t("breadcrumb_my_courses"), href: "", isActive: false },
          ]}
        />
        <Button
          component={Link}
          href="/shop?type=course"
          color="hongbao-red"
          radius="md"
          size="sm"
          rightSection={<ArrowRightIcon size={14} />}
          className="w-full! sm:w-auto! shrink-0!"
        >
          {t("buy")}
        </Button>
      </Group>

      {/* status filter - scrolls sideways on narrow screens rather than
          wrapping into a ragged second row */}
      {stats.total > 0 && (
        <Box className="-mx-1! overflow-x-auto! [&::-webkit-scrollbar]:hidden!">
          <Group gap={8} wrap="nowrap" className="px-1! w-max!">
            {filters.map((f) => {
              const active = filter === f.value;
              return (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setFilter(f.value)}
                  aria-pressed={active}
                  className={`flex! items-center! gap-2! shrink-0! rounded-full! border! px-3.5! py-1.5! text-xs! font-semibold! cursor-pointer! transition-colors! duration-200! ease-out! ${
                    active
                      ? "border-hongbao-red-500! bg-hongbao-red-500! text-white!"
                      : "border-gray-200! bg-surface! text-gray-600! hover:border-hongbao-red-200! hover:text-hongbao-red-600! dark:hover:text-night-red!"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </Group>
        </Box>
      )}

      {/* item count for the active filter */}
      {stats.total > 0 && !isLoading && (
        <Group gap={8} align="center" wrap="wrap">
          <Text size="sm" c="gray.6">
            {t.rich("showing_count", {
              count: activeCount,
              b: (chunks) => (
                <Text span fw={700} c="gray.9">
                  {chunks}
                </Text>
              ),
            })}
          </Text>
        </Group>
      )}

      {/* list */}
      {isLoading ? (
        <LoaderComponent />
      ) : isEmpty(filteredCourses) ? (
        <Paper
          withBorder
          bdrs={20}
          p={{ base: 28, sm: 40 }}
          className="border-dashed! border-gray-300! bg-gray-50/60!"
        >
          <Stack align="center" gap={14}>
            <Box className="flex! items-center! justify-center! w-14! h-14! rounded-2xl! bg-hongbao-red-50! text-hongbao-red-600! dark:text-night-red!">
              <ShoppingCartIcon size={26} />
            </Box>
            <Text ta={"center"} c="gray.7">
              {t(emptyByFilter[filter])}
            </Text>
            {filter === "ALL" ? (
              <Button
                component={Link}
                href="/shop?type=course"
                color="hongbao-red"
                rightSection={<ArrowRightIcon size={15} />}
                className="w-full! sm:w-auto!"
              >
                {t("buy")}
              </Button>
            ) : (
              <Button
                variant="light"
                color="hongbao-red"
                size="sm"
                onClick={() => setFilter("ALL")}
              >
                {t("show_all")}
              </Button>
            )}
          </Stack>
        </Paper>
      ) : (
        <SimpleGrid
          cols={{ base: 1, xs: 2, md: 3 }}
          spacing={12}
          verticalSpacing={12}
          className={`transition-opacity! duration-200! ${isFetching ? "opacity-60!" : ""}`}
        >
          {filteredCourses.map((c) => (
            <CourseCard key={c?.id} data={c} />
          ))}
        </SimpleGrid>
      )}

      {totalPages > 1 && (
        <Group justify="center">
          <Pagination
            total={totalPages}
            value={page}
            onChange={(value) => {
              setPage(value);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            color="hongbao-red"
            radius="md"
            siblings={1}
            boundaries={1}
          />
        </Group>
      )}
    </Stack>
  );
};

export default PageComponent;
