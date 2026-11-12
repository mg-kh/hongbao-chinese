import useApiQuery from "@/hooks/fetching/useApiQuery";
import useMutationQuery from "@/hooks/fetching/useMutationQuery";
import useCheckIsvalidSubmitButton from "@/hooks/useCheckIsvalidSubmitButton";
import { useEditDrawer } from "@/providers/EditDrawerProvider";
import { TErrorOptions } from "@/types/general.type";
import { showErrorNoti, showSuccessNoti } from "@/utils/notifications-helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { map } from "lodash";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import useCourse from "../../../../hooks/data-fetching/useCourses";
import { TCouponRes } from "../../types/coupon.type";

const schema = z.object({
  code: z.string().min(1),
  description: z.string().min(1),
  discountType: z.enum(["PERCENTAGE", "FIXED"]),
  discountValue: z.number().min(0),
  usageLimit: z.number().min(1),
  perUserLimit: z.number().min(1),
  isActive: z.boolean(),
  expiresAt: z.string().min(1),
  courses: z
    .array(
      z.object({
        courseId: z.string().min(1),
      }),
    )
    .min(1),
});
type FormField = z.infer<typeof schema>;

const useContainer = () => {
  const { close, currentId } = useEditDrawer();
  const form = useForm<FormField>({
    mode: "onChange",
    resolver: zodResolver(schema),
    defaultValues: {
      code: "",
      description: "",
      discountType: "PERCENTAGE",
      discountValue: 0,
      usageLimit: 1,
      perUserLimit: 1,
      isActive: true,
      expiresAt: "",
      courses: [
        {
          courseId: "",
        },
      ],
    },
  });
  const { control, handleSubmit, reset, watch } = form;
  const {
    fields: courseFields,
    append: appendCourse,
    remove: removeCourse,
  } = useFieldArray({
    control,
    name: "courses" as never,
  });
  const { data: courseRes } = useCourse();
  const { data: couponDetail, isFetching } = useApiQuery<
    { data: TCouponRes },
    TCouponRes
  >({
    url: `dashboard/coupon/${currentId}`,
    enabled: !!currentId,
    select: (data) => data?.data,
  });
  const { mutate: save, isPending } = useMutationQuery({
    url: currentId ? `dashboard/coupon/${currentId}` : `dashboard/coupon`,
    method: currentId ? "patch" : "post",
    invalidateKeys: ["coupon"],
  });
  const { mutate: deleteItem, isPending: isDeletePending } = useMutationQuery({
    url: `dashboard/coupon/${currentId}`,
    method: "delete",
    invalidateKeys: ["coupon"],
  });

  const handleFormSubmit = handleSubmit((data) => {
    const { courses, expiresAt, ...rest } = data;
    save(
      {
        ...rest,
        expiresAt: new Date(expiresAt).toISOString(),
        courseIds: map(courses, (c) => c.courseId),
      },
      {
        onSuccess: () => {
          showSuccessNoti();
          close();
        },
        onError: (e: TErrorOptions) => {
          showErrorNoti(e.message);
        },
      },
    );
  });
  const handleDelete = (cb: () => void) => {
    deleteItem(
      {},
      {
        onSuccess: () => {
          showSuccessNoti();
          cb();
          close();
        },
        onError: (e) => {
          showErrorNoti(e.message);
        },
      },
    );
  };

  useEffect(() => {
    if (currentId && couponDetail) {
      const courseIds =
        couponDetail.courseIds ?? map(couponDetail.courses, (c) => c.id);
      reset({
        code: couponDetail.code || "",
        description: couponDetail.description || "",
        discountType: couponDetail.discountType || "PERCENTAGE",
        discountValue: couponDetail.discountValue || 0,
        usageLimit: couponDetail.usageLimit || 1,
        perUserLimit: couponDetail.perUserLimit || 1,
        isActive: couponDetail.isActive ?? true,
        expiresAt: couponDetail.expiresAt
          ? couponDetail.expiresAt.slice(0, 19).replace("T", " ")
          : "",
        courses: courseIds.length
          ? map(courseIds, (id) => ({ courseId: id }))
          : [{ courseId: "" }],
      });
    }
  }, [couponDetail, reset, currentId]);

  const { isValid } = useCheckIsvalidSubmitButton({ form, isPending });

  return {
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
  };
};

export default useContainer;
