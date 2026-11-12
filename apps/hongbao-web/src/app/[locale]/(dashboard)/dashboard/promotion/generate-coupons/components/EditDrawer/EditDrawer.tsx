"use client";

import EditDrawerFrame from "@/components/EditDrawerFrame/EditDrawerFrame";
import CustomDateTimeInput from "@/components/Inputs/CustomDateTimeInput/CustomDateTimeInput";
import CustomNumberInput from "@/components/Inputs/CustomNumberInput/CustomNumberInput";
import CustomSwitch from "@/components/Inputs/CustomSwitch/CustomSwitch";
import CustomTextInput from "@/components/Inputs/CustomTextInput/CustomTextInput";
import DropDownInput from "@/components/Inputs/DropDownInput/DropDownInput";
import FormSectionWrapper from "@/components/Inputs/FormSectionWrapper/FormSectionWrapper";
import { ActionIcon, Badge, Flex, Stack } from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import dayjs from "dayjs";
import { map } from "lodash";
import useContainer from "./useContianer";

const DISCOUNT_TYPE_OPTIONS = [
  { label: "Percentage", value: "PERCENTAGE" },
  { label: "Fixed", value: "FIXED" },
];

const EditDrawer = () => {
  const {
    handleFormSubmit,
    handleDelete,
    form,
    courseFields,
    appendCourse,
    removeCourse,
    isFetching,
    isPending,
    isDeletePending,
    isValid,
    courseRes,
  } = useContainer();

  const courseOptions = map(courseRes, (course) => ({
    label: course?.title,
    value: course?.id,
  }));

  const selectedCourseIds = map(form.watch("courses"), (c) => c?.courseId);

  const expiresAt = form.watch("expiresAt");
  const daysUntilExpiry = expiresAt
    ? dayjs(expiresAt).startOf("day").diff(dayjs().startOf("day"), "day")
    : null;

  return (
    <EditDrawerFrame
      title="Coupon Builder"
      handleUpdate={handleFormSubmit}
      handleDelete={handleDelete}
      isLoading={isFetching}
      isDeletePending={isDeletePending}
      isPending={isPending}
      isValid={isValid}
    >
      <form id="form-area" onSubmit={handleFormSubmit}>
        <Stack>
          {/* Basic Info */}
          <FormSectionWrapper sectionTitle="Basic Info">
            <CustomTextInput control={form.control} name="code" label="Code" />
            <CustomTextInput
              control={form.control}
              name="description"
              label="Description"
            />
            <DropDownInput
              name="discountType"
              control={form.control}
              data={DISCOUNT_TYPE_OPTIONS}
              label="Discount Type"
            />
          </FormSectionWrapper>
          {/* Pricing */}
          <FormSectionWrapper sectionTitle="Pricing">
            <CustomNumberInput
              control={form.control}
              name="discountValue"
              label="Discount Value"
              min={0}
            />
            <CustomNumberInput
              control={form.control}
              name="usageLimit"
              label="Usage Limit"
              min={1}
            />
            <CustomNumberInput
              control={form.control}
              name="perUserLimit"
              label="Per User Limit"
              min={1}
            />
          </FormSectionWrapper>
          {/* Attach Course */}
          <FormSectionWrapper sectionTitle="Attach Course">
            {courseFields?.map((f, i) => (
              <Flex key={f.id} gap={10} align="flex-end">
                <DropDownInput
                  name={`courses.${i}.courseId`}
                  control={form.control}
                  data={courseOptions.filter(
                    (opt) =>
                      opt.value === selectedCourseIds[i] ||
                      !selectedCourseIds.includes(opt.value),
                  )}
                  label={i === 0 ? "Attach course" : undefined}
                  placeholder="Select course"
                  searchable
                  className="flex-1!"
                />
                {i === courseFields.length - 1 ? (
                  <ActionIcon
                    onClick={() => {
                      appendCourse({
                        courseId: "",
                      });
                    }}
                    variant="transparent"
                  >
                    <IconPlus />
                  </ActionIcon>
                ) : (
                  <ActionIcon
                    onClick={() => {
                      removeCourse(i);
                    }}
                    variant="transparent"
                    color="red"
                  >
                    <IconTrash />
                  </ActionIcon>
                )}
              </Flex>
            ))}
          </FormSectionWrapper>
          {/* Other */}
          <FormSectionWrapper sectionTitle="Other">
            <CustomSwitch
              control={form.control}
              name="isActive"
              label="Is Active?"
            />
            <CustomDateTimeInput
              name="expiresAt"
              control={form.control}
              label="Expire at"
              withTime={false}
              minDate={new Date()}
            />
            {daysUntilExpiry !== null && (
              <Badge color="orange" variant="light" radius="xl">
                {daysUntilExpiry === 0
                  ? "Expires today"
                  : `${daysUntilExpiry} day${daysUntilExpiry > 1 ? "s" : ""} from now`}
              </Badge>
            )}
          </FormSectionWrapper>
        </Stack>
      </form>
    </EditDrawerFrame>
  );
};

export default EditDrawer;
