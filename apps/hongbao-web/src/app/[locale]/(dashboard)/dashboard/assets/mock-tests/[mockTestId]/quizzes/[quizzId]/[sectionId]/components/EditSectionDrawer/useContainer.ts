import useMediaStorage, {
  UploadedMedia,
} from "@/components/Inputs/CustomRichTextEditor/services/mediaStorage";
import useMutationQuery from "@/hooks/fetching/useMutationQuery";
import useCheckIsvalidSubmitButton from "@/hooks/useCheckIsvalidSubmitButton";
import { useEditDrawer } from "@/providers/EditDrawerProvider";
import { TErrorOptions } from "@/types/general.type";
import { showErrorNoti, showSuccessNoti } from "@/utils/notifications-helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1),
  description: z.string().nullish(),
  timeLimit: z.number().int().positive().nullish(),
  audioUrl: z.string().url().nullish(),
});
export type TSectionFormField = z.infer<typeof schema>;

export type TUploadedAudio = UploadedMedia & {
  name: string;
  size: number;
};

// The file id is the URL path, e.g. "https://<host>/audios/2026/10/<uuid>.mpeg"
// -> "audios/2026/10/<uuid>.mpeg".
const getFileIdFromUrl = (url?: string | null) => {
  if (!url) return undefined;
  try {
    return (
      decodeURIComponent(new URL(url).pathname).replace(/^\//, "") || undefined
    );
  } catch {
    return undefined;
  }
};

interface Props {
  section: TSectionFormField;
}

const useContainer = ({ section }: Props) => {
  const { quizzId, sectionId } = useParams();
  const { close, opened } = useEditDrawer();
  const { uploadMedia } = useMediaStorage();
  const [uploadedFile, setUploadedFile] = useState<TUploadedAudio | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<TSectionFormField>({
    mode: "onChange",
    resolver: zodResolver(schema),
    defaultValues: section,
  });
  const { handleSubmit, reset, setValue, watch } = form;
  const audioUrl = watch("audioUrl");

  const { mutate: save, isPending } = useMutationQuery({
    url: `dashboard/quiz-section/quiz/${quizzId}/section/${sectionId}`,
    method: "patch",
    invalidateKeys: ["mock-test-section-detail"],
  });

  const { isValid } = useCheckIsvalidSubmitButton({ form, isPending });

  const handleFormSubmit = handleSubmit((data) => {
    save(data, {
      onSuccess: () => {
        showSuccessNoti();
        close();
      },
      onError: (e: TErrorOptions) => {
        showErrorNoti(e.message);
      },
    });
  });

  const handleAudioDrop = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const { id, url } = await uploadMedia(file, "dashboard/upload-audio");
      setUploadedFile({ id, url, name: file.name, size: file.size });
      setValue("audioUrl", url, { shouldDirty: true, shouldValidate: true });
    } catch (e) {
      showErrorNoti((e as TErrorOptions)?.message);
    } finally {
      setIsUploading(false);
    }
  };

  const audioFileId = uploadedFile?.id ?? getFileIdFromUrl(audioUrl);

  const { mutate: deleteAudio, isPending: isDeleting } = useMutationQuery({
    url: `dashboard/delete-file`,
    method: "delete",
    params: { id: audioFileId },
  });

  const clearAudioUrl = () =>
    setValue("audioUrl", null, { shouldDirty: true, shouldValidate: true });

  const handleTimeLimitChange = (value: string | number) =>
    setValue("timeLimit", value === "" ? null : Number(value), {
      shouldDirty: true,
      shouldValidate: true,
    });

  const handleAudioDelete = () => {
    if (!audioFileId) {
      clearAudioUrl();
      return;
    }
    deleteAudio(
      {},
      {
        onSuccess: () => {
          setUploadedFile(null);
          clearAudioUrl();
        },
        onError: (e: TErrorOptions) => {
          showErrorNoti(e.message);
        },
      },
    );
  };

  useEffect(() => {
    if (opened) {
      reset(section);
      setUploadedFile(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened]);

  return {
    form,
    isValid,
    isPending,
    handleFormSubmit,
    uploadedFile,
    audioUrl,
    isUploading,
    isDeleting,
    handleAudioDrop,
    handleAudioDelete,
    handleTimeLimitChange,
  };
};

export default useContainer;
