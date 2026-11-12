import useBaseRequest from "@/hooks/fetching/useBaseRequest";
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import { type Method } from "axios";

interface UseApiQueryProps<T = unknown, TSelected = T> extends Omit<
  UseQueryOptions<T, Error, TSelected>,
  "queryKey" | "queryFn"
> {
  key?: string | unknown[];
  url: string;
  method?: Method;
  params?: Record<string, unknown> | URLSearchParams;
}

function useApiQuery<T = unknown, TSelected = T>({
  key,
  url,
  method = "GET",
  params,
  enabled = true,
  ...options
}: UseApiQueryProps<T, TSelected>): UseQueryResult<TSelected, Error> {
  const { request } = useBaseRequest();

  return useQuery<T, Error, TSelected>({
    queryKey: Array.isArray(key)
      ? key
      : [key ?? url, method, JSON.stringify(params ?? {})], // ✅ stable
    queryFn: () =>
      request<T>({
        url,
        method,
        params,
      }),
    enabled,
    ...options,
  });
}

export default useApiQuery;
