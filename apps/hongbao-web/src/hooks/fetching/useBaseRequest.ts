import useFetcher from "@/hooks/fetching/useFetcher";
import { AxiosRequestConfig } from "axios";

const useBaseRequest = () => {
  const { HttpService } = useFetcher();
  const request = async <T>(config: AxiosRequestConfig) => {
    const response = await HttpService<T>(config);
    return response.data;
  };

  return { request };
};

export default useBaseRequest;
