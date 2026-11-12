import { HttpStatus } from '@nestjs/common';

export interface SuccessOptions<T> {
  data: T;
  message?: string;
  statusCode?: number;
}

export interface ErrorOptions {
  message?: string;
  statusCode?: number;
}

export const successResponse = <T>({
  data,
  message = 'Success',
  statusCode = HttpStatus.OK,
}: SuccessOptions<T>) => {
  return {
    success: true,
    message,
    data,
    statusCode,
  };
};

export const errorResponse = ({
  message = 'Something went wrong',
  statusCode = HttpStatus.INTERNAL_SERVER_ERROR,
}: ErrorOptions = {}) => {
  return {
    success: false,
    message,
    data: null,
    statusCode,
  };
};
