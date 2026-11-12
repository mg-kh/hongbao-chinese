"use client";

import LoaderComponent from "@/components/LoaderComponent/LoaderComponent";
import {
  Box,
  Button,
  Group,
  Pagination,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { ArrowRightIcon, ShoppingCartIcon } from "@phosphor-icons/react";
import { isEmpty } from "lodash";
import Link from "next/link";
import CourseCard from "../../../components/CourseCard/CourseCard";
import useContainer from "./useContainer";

/** Copy shown when a status filter turns up nothing. */
const emptyByFilter: Record<string, string> = {
  ALL: "ဝယ်ယူထားသော သင်ခန်းစာများမရှိသေးပါ။",
  APPROVED: "No courses in progress right now.",
  PENDING: "No courses waiting for approval.",
  EXPIRED: "No expired courses — nothing to renew.",
};

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
  } = useContainer();

  return (
    <Stack gap={24} className="flex-1!">
      {/* page header */}
      <Group justify="space-between" align="flex-start" wrap="wrap" gap={12}>
        <Stack gap={4} className="min-w-0!">
          <Text size="xl" fw={"bold"} c={"hongbao-red"}>
            ကျွန်ုပ်၏ သင်ခန်းစာများ
          </Text>
          <Text size="sm" c="gray.6">
            Everything you&apos;re enrolled in, and where each one stands.
          </Text>
        </Stack>
        <Button
          component={Link}
          href="/shop?type=course"
          color="hongbao-red"
          radius="md"
          size="sm"
          rightSection={<ArrowRightIcon size={14} />}
          className="w-full! sm:w-auto! shrink-0!"
        >
          ဝယ်ယူရန်
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
                      : "border-gray-200! bg-white! text-gray-600! hover:border-hongbao-red-200! hover:text-hongbao-red-600!"
                  }`}
                >
                  {f.label}
                  <span
                    className={`rounded-full! px-1.5! py-0.5! text-[10px]! leading-none! ${
                      active
                        ? "bg-white/25! text-white!"
                        : "bg-gray-100! text-gray-500!"
                    }`}
                  >
                    {f.count}
                  </span>
                </button>
              );
            })}
          </Group>
        </Box>
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
            <Box className="flex! items-center! justify-center! w-14! h-14! rounded-2xl! bg-hongbao-red-50! text-hongbao-red-600!">
              <ShoppingCartIcon size={26} />
            </Box>
            <Text ta={"center"} c="gray.7">
              {emptyByFilter[filter]}
            </Text>
            {filter === "ALL" ? (
              <Button
                component={Link}
                href="/shop?type=course"
                color="hongbao-red"
                rightSection={<ArrowRightIcon size={15} />}
                className="w-full! sm:w-auto!"
              >
                ဝယ်ယူရန်
              </Button>
            ) : (
              <Button
                variant="light"
                color="hongbao-red"
                size="sm"
                onClick={() => setFilter("ALL")}
              >
                Show all courses
              </Button>
            )}
          </Stack>
        </Paper>
      ) : (
        <Stack
          gap={12}
          className={`transition-opacity! duration-200! ${isFetching ? "opacity-60!" : ""}`}
        >
          {filteredCourses.map((c) => (
            <CourseCard key={c?.id} data={c} />
          ))}
        </Stack>
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
