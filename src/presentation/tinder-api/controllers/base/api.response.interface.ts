interface IApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: IApiError;
}

interface IApiError {
  code: string; 
  message: string; 
  details?: any; 
}

export type SuccessResponse<T> = IApiResponse<T>;
export type ErrorResponse = IApiResponse<never>;