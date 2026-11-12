import useMutationQuery from "@/hooks/fetching/useMutationQuery";
import useCheckIsvalidSubmitButton from "@/hooks/useCheckIsvalidSubmitButton";
import { useEditDrawer } from "@/providers/EditDrawerProvider";
import { TErrorOptions } from "@/types/general.type";
import { showErrorNoti, showSuccessNoti } from "@/utils/notifications-helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useCourse from "../../../../hooks/data-fetching/useCourses";
import { useEffect } from "react";
import { TLessonRes } from "../../types/lessons.type";
import useApiQuery from "@/hooks/fetching/useApiQuery";

const schema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  courseId: z.string(),
});
type FormField = z.infer<typeof schema>;

const useContainer = () => {
  const { close, currentId } = useEditDrawer();
  const form = useForm<FormField>({
    mode: "onChange",
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
    },
  });
  const { handleSubmit, reset } = form;

  const { courseDropdownData, isLoading: courseDropdownDataLoading } =
    useCourse();
  const { data: lessonDetail, isFetching } = useApiQuery<
    { data: TLessonRes },
    TLessonRes
  >({
    url: `dashboard/lesson/${currentId}`,
    enabled: !!currentId,
    select: (data) => data?.data,
  });
  const { mutate: save, isPending } = useMutationQuery({
    url: currentId ? `dashboard/lesson/${currentId}` : `dashboard/lesson`,
    method: currentId ? "patch" : "post",
    invalidateKeys: ["lesson"],
  });
  const { mutate: deleteItem, isPending: isDeletePending } = useMutationQuery({
    url: `dashboard/lesson/${currentId}`,
    method: "delete",
    invalidateKeys: ["lesson"],
  });

  const handleFormSubmit = handleSubmit((data) => {
    save(
      {
        ...data,
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

  const { isValid } = useCheckIsvalidSubmitButton({ form, isPending });

  useEffect(() => {
    if (currentId) {
      reset({
        title: lessonDetail?.title || "",
        description: lessonDetail?.description || "",
        courseId: lessonDetail?.courseId || "",
      });
    }
  }, [lessonDetail, reset, currentId]);

  return {
    handleFormSubmit,
    handleDelete,
    form,
    isPending,
    isDeletePending,
    isValid,
    courseDropdownData,
    isFetching,
    courseDropdownDataLoading,
  };
};
export default useContainer;
