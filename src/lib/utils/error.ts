export interface AppError {
  message: string;
  code: number;
  details?: Record<string, string[]>;
}

export function parseApiError(error: unknown): AppError {
  // Stub for now. Full implementation will map API interceptor errors
  return {
    message: 'Something went wrong. Please try again.',
    code: 500,
  };
}

export function mapValidationErrors(
  details: Record<string, string[]>,
  setError: (field: any, error: any) => void,
): void {
  Object.entries(details).forEach(([field, messages]) => {
    setError(field, { type: 'server', message: messages[0] });
  });
}
