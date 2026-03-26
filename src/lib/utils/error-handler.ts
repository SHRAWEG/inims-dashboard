import { UseFormSetError, FieldValues, Path } from "react-hook-form";
import { toast } from "sonner";

interface ApiErrorResponse {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
}

/**
 * Reusable utility to handle API errors and map them to React Hook Form fields.
 * It also displays a toast with the error message.
 * 
 * @param error The error object (usually from Axios/React Query)
 * @param setError The React Hook Form setError function
 * @param defaultMessage A fallback message if the API doesn't provide one
 */
export function handleApiError<T extends FieldValues>(
  error: any,
  setError: UseFormSetError<T>,
  defaultMessage: string = "Something went wrong"
) {
  const data = error.response?.data as ApiErrorResponse;
  
  // Extract the main message
  const message = data?.message || data?.error?.message || defaultMessage;
  
  // Show the toast
  toast.error(message);

  // Map field-level errors if they exist
  const validationErrors = data?.errors || data?.error?.details;
  
  if (validationErrors) {
    Object.entries(validationErrors).forEach(([field, messages]) => {
      // Use the first message for the field
      const fieldPath = field as Path<T>;
      setError(fieldPath, {
        type: "server",
        message: Array.isArray(messages) ? messages[0] : (messages as string),
      });
    });
  }
}
