import useApiQuery from "@/hooks/fetching/useApiQuery";
import useMutationQuery from "@/hooks/fetching/useMutationQuery";
import useCheckIsvalidSubmitButton from "@/hooks/useCheckIsvalidSubmitButton";
import { useEditDrawer } from "@/providers/EditDrawerProvider";
import { TErrorOptions } from "@/types/general.type";
import { showErrorNoti, showSuccessNoti } from "@/utils/notifications-helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { omit } from "lodash";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useCourse from "../../../../hooks/data-fetching/useCourses";
import useLessons from "../../../../hooks/data-fetching/useLessons";
import useSubLessons from "../../../../hooks/data-fetching/useSubLessons";
import { TVideoDetail } from "../../types/videos.type";

const schema = z.object({
  isIntroVideo: z.boolean(),
  courseId: z.string().min(1),
  lessonId: z.string().min(1),
  subLessonId: z.string().min(1),
  url: z.url().min(1),
  title: z.string().min(1),
  description: z.string().nullish(),
});
type FormField = z.infer<typeof schema>;

const useContainer = () => {
  const { close, currentId } = useEditDrawer();
  const form = useForm<FormField>({
    mode: "onChange",
    resolver: zodResolver(schema),
  });
  const { handleSubmit, reset } = form;
  const { courseDropdownData, isLoading: courseDropdownDataLoading } =
    useCourse();
  const { lessonDropdownData, isLoading: lessonDropdownDataLoading } =
    useLessons({
      courseId: form.watch("courseId"),
    });
  const { subLessonDropdownData, isLoading: subLessonDropdownDataLoading } =
    useSubLessons({
      courseId: form.watch("courseId"),
      lessonId: form.watch("lessonId"),
    });

  const { data: videoDetail, isFetching } = useApiQuery<
    { data: TVideoDetail },
    TVideoDetail
  >({
    url: `dashboard/video/${currentId}`,
    enabled: !!currentId,
    select: (data) => data?.data,
    key: "video",
  });
  const { mutate: save, isPending } = useMutationQuery({
    url: currentId ? `dashboard/video/${currentId}` : `dashboard/video`,
    method: currentId ? "patch" : "post",
    invalidateKeys: ["video"],
  });
  const { mutate: deleteItem, isPending: isDeletePending } = useMutationQuery({
    url: `dashboard/video/${currentId}`,
    method: "delete",
    invalidateKeys: ["video"],
  });

  const handleFormSubmit = handleSubmit((data) => {
    const payload = data?.isIntroVideo
      ? omit(data, ["subLessonId", "lessonId"])
      : omit(data, ["courseId", "lessonId"]);
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
        courseId: videoDetail?.subLesson?.lesson?.courseId,
        lessonId: videoDetail?.subLesson?.lessonId,
        subLessonId: videoDetail?.subLessonId,
        url: videoDetail?.url || "",
        title: videoDetail?.title || "",
        description: videoDetail?.description || "",
        isIntroVideo: videoDetail?.isIntroVideo || false,
      });
    }
  }, [reset, currentId, videoDetail]);

  return {
    form,
    courseDropdownData,
    courseDropdownDataLoading,
    lessonDropdownData,
    lessonDropdownDataLoading,
    subLessonDropdownData,
    subLessonDropdownDataLoading,
    isPending,
    isValid,
    isFetching,
    isDeletePending,
    handleFormSubmit,
    handleDelete,
  };
};

export default useContainer;
