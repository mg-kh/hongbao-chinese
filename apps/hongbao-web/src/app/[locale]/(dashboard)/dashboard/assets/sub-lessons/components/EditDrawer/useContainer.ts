import useApiQuery from "@/hooks/fetching/useApiQuery";
import useMutationQuery from "@/hooks/fetching/useMutationQuery";
import useCheckIsvalidSubmitButton from "@/hooks/useCheckIsvalidSubmitButton";
import { useEditDrawer } from "@/providers/EditDrawerProvider";
import { TErrorOptions } from "@/types/general.type";
import { showErrorNoti, showSuccessNoti } from "@/utils/notifications-helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useCourse from "../../../../hooks/data-fetching/useCourses";
import useLessons from "../../../../hooks/data-fetching/useLessons";
import { TSubLessonRes } from "../../types/sub-lesson.type";
import { omit } from "lodash";

const schema = z.object({
  lessonId: z.string().min(1),
  courseId: z.string().min(1),
  title: z.string(),
  description: z.string(),
  video_url: z.string().nullish(),
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
  const { lessonDropdownData, isLoading: lessonDropdownDataLoading } =
    useLessons({
      courseId: form.watch("courseId"),
    });
  const { data: subLessonDetail, isFetching } = useApiQuery<
    { data: TSubLessonRes },
    TSubLessonRes
  >({
    url: `dashboard/sub-lesson/${currentId}`,
    enabled: !!currentId,
    select: (data) => data?.data,
  });
  const { mutate: save, isPending } = useMutationQuery({
    url: currentId
      ? `dashboard/sub-lesson/${currentId}`
      : `dashboard/sub-lesson`,
    method: currentId ? "patch" : "post",
    invalidateKeys: ["sub-lesson"],
  });
  const { mutate: deleteItem, isPending: isDeletePending } = useMutationQuery({
    url: `dashboard/sub-lesson/${currentId}`,
    method: "delete",
    invalidateKeys: ["sub-lesson"],
  });

  const handleFormSubmit = handleSubmit((data) => {
    const payload = omit(data, ["courseId"]);
    save(
      {
        ...payload,
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
        title: subLessonDetail?.title || "",
        description: subLessonDetail?.description || "",
        lessonId: subLessonDetail?.lessonId || "",
        courseId: subLessonDetail?.lesson?.courseId || "",
      });
    }
  }, [subLessonDetail, reset, currentId]);

  return {
    handleFormSubmit,
    handleDelete,
    form,
    isPending,
    isDeletePending,
    isValid,
    lessonDropdownData,
    isFetching,
    lessonDropdownDataLoading,
    courseDropdownData,
    courseDropdownDataLoading,
  };
};

export default useContainer;
