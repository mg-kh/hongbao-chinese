import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { type Method } from "axios";
import useBaseRequest from "./useBaseRequest";

interface UseMutationQueryProps<
  TData = unknown,
  TVariables = unknown,
  TContext = unknown,
> {
  url: string;
  method?: Method;
  invalidateKeys?: (string | unknown[])[];
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  onSuccess?: (
    data: TData,
    variables: TVariables,
    context: TContext | undefined,
  ) => void;
}

function useMutationQuery<
  TData = unknown,
  TVariables = unknown,
  TContext = unknown,
>({
  url,
  method = "POST",
  invalidateKeys = [],
  params,
  headers,
  onSuccess,
}: UseMutationQueryProps<TData, TVariables, TContext>): UseMutationResult<
  TData,
  Error,
  TVariables,
  TContext
> {
  const queryClient = useQueryClient();
  const { request } = useBaseRequest();

  return useMutation<TData, Error, TVariables, TContext>({
    mutationFn: (variables: TVariables) =>
      request<TData>({
        url,
        method,
        data: variables,
        params,
        headers,
      }),

    onSuccess: async (data, variables, context) => {
      // ✅ invalidate queries safely
      await Promise.all(
        invalidateKeys.map((key) =>
          queryClient.invalidateQueries({
            queryKey: Array.isArray(key) ? key : [key],
          }),
        ),
      );

      onSuccess?.(data, variables, context);
    },
  });
}

export default useMutationQuery;
