import {
  useInfiniteQuery,
  type UseInfiniteQueryOptions,
  type UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { type Method } from "axios";
import useBaseRequest from "./useBaseRequest";

interface UseApiInfiniteQueryProps<
  TQueryFnData = unknown,
  TData = TQueryFnData,
  TPageParam = unknown,
> extends Omit<
  UseInfiniteQueryOptions<
    TQueryFnData,
    Error,
    TData,
    readonly unknown[],
    TPageParam
  >,
  "queryKey" | "queryFn"
> {
  key?: string | readonly unknown[];
  url: string;
  method?: Method;
  params?: Record<string, unknown> | URLSearchParams;
}

function useApiInfiniteQuery<
  TQueryFnData = unknown,
  TData = TQueryFnData,
  TPageParam = unknown,
>({
  key,
  url,
  method = "GET",
  params,
  enabled = true,
  ...options
}: UseApiInfiniteQueryProps<
  TQueryFnData,
  TData,
  TPageParam
>): UseInfiniteQueryResult<TData, Error> {
  const { request } = useBaseRequest();

  const serializedParams =
    params instanceof URLSearchParams
      ? Object.fromEntries(params.entries())
      : params;

  return useInfiniteQuery<
    TQueryFnData,
    Error,
    TData,
    readonly unknown[],
    TPageParam
  >({
    queryKey: Array.isArray(key)
      ? key
      : [key ?? url, method, JSON.stringify(serializedParams ?? {})],
    queryFn: ({ pageParam }) =>
      request<TQueryFnData>({
        url,
        method,
        params: { ...serializedParams, page: pageParam },
      }),
    enabled,
    ...options,
  });
}

export default useApiInfiniteQuery;
