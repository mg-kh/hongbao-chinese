import useBaseRequest from "@/hooks/fetching/useBaseRequest";

export interface UploadedMedia {
  id: string;
  url: string;
}

const useMediaStorage = () => {
  const { request } = useBaseRequest();

  const uploadMedia = async (file: File, url: string) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await request<{ data: UploadedMedia }>({
      url,
      method: "POST",
      data: formData,
    });

    return response.data;
  };

  const deleteMedia = (id: string) =>
    request<void>({ url: `dashboard/delete-file?id=${id}`, method: "DELETE" });

  return { uploadMedia, deleteMedia };
};

export default useMediaStorage;
