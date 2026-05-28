export interface PaginatedResponse<T> {
  data: T[];
  next?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
}
