interface ApiResponse<T> {
  status: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details?: any;
  };
}

export class ResponseUtil {
  static success<T>(data: T, message: string = "Success"): ApiResponse<T> {
    return {
      status: true,
      message,
      data,
    };
  }

  static error(
    message: string,
    code: string = "INTERNAL_SERVER_ERROR",
    details?: any
  ): ApiResponse<null> {
    return {
      status: false,
      message,
      error: {
        code,
        details,
      },
    };
  }
}
