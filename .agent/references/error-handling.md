# Error Handling

## Section 1 — TanStack Query global config

`src/providers/query-provider.tsx`:
```ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: AppError) => {
        if ([401, 403, 404].includes(error.code)) return false;
        return failureCount < 2;
      },
      staleTime: 1000 * 60 * 5,
    },
    mutations: {
      onError: (error: AppError) => {
        toast.error(error.message);
      },
    },
  },
});
```

## Section 2 — Query errors in components

```tsx
const { data, isLoading, isError, error } = useQuery({ ... });

if (isLoading) return <LoadingSpinner />;
if (isError) return <ErrorState message={(error as AppError).message} />;
if (!data?.data.length) return <EmptyState />;
```

Never throw inside components. Always use `isError` state.

## Section 3 — Mutation error patterns

Non-form mutations (delete, deactivate, status toggle):
```ts
useMutation({
  mutationFn: (id: string) => sectorsApi.delete(id),
  onSuccess: () => {
    toast.success(t('common.deletedSuccessfully'));
    queryClient.invalidateQueries({ queryKey: sectorKeys.lists() });
  },
  onError: (error: AppError) => toast.error(error.message),
});
```

Form mutations — map backend validation to fields:
```ts
useMutation({
  mutationFn: (dto: CreateSectorDto) => sectorsApi.create(dto),
  onSuccess: () => {
    toast.success(t('sectors.createdSuccessfully'));
    queryClient.invalidateQueries({ queryKey: sectorKeys.lists() });
    onSuccess();
  },
  onError: (error: AppError) => {
    if (error.details) {
      mapValidationErrors(error.details, form.setError);
    } else {
      toast.error(error.message);
    }
  },
});
```

## Section 4 — Route level error boundary

`app/(dashboard)/error.tsx` and `app/(auth)/error.tsx`:
```tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <ErrorState message={error.message} />
      <Button onClick={reset} variant="outline">Try again</Button>
    </div>
  );
}
```

## Section 5 — Never do these
- Never `try/catch` around TanStack Query calls in components
- Never `alert()` for errors
- Never expose raw server error messages in production UI
- Never silently swallow errors — always toast or error state
- Never show a loading spinner indefinitely — always have an error fallback
