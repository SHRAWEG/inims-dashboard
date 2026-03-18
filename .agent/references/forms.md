# Forms

## Section 1 — Standard form pattern

```ts
// Step 1 — Zod schema in src/lib/validations/sector.schema.ts
export const createSectorSchema = z.object({
  name: z.object({
    en: z.string().min(1, 'English name is required').max(255),
    ne: z.string().min(1, 'Nepali name is required').max(255),
  }),
  isActive: z.boolean().default(true),
});

export const updateSectorSchema = z.object({
  name: z.object({
    en: z.string().min(1).max(255).optional(),
    ne: z.string().min(1).max(255).optional(),
  }).optional(),
  isActive: z.boolean().optional(),
});

export type CreateSectorFormValues = z.infer<typeof createSectorSchema>;
export type UpdateSectorFormValues = z.infer<typeof updateSectorSchema>;
```

```tsx
// Step 2 — Form component src/components/sectors/sector-form.tsx
interface SectorFormProps {
  defaultValues?: UpdateSectorFormValues;
  onSuccess: () => void;
}

export function SectorForm({ defaultValues, onSuccess }: SectorFormProps) {
  const { t } = useTranslation('sectors');
  const queryClient = useQueryClient();
  const isEditing = !!defaultValues;

  const form = useForm<CreateSectorFormValues>({
    resolver: zodResolver(createSectorSchema),
    defaultValues: defaultValues ?? {
      name: { en: '', ne: '' },
      isActive: true,
    },
  });

  const mutation = useMutation({
    mutationFn: (dto: CreateSectorFormValues) =>
      isEditing
        ? sectorsApi.update(defaultValues.id, dto)
        : sectorsApi.create(dto),
    onSuccess: () => {
      toast.success(isEditing ? t('updatedSuccessfully') : t('createdSuccessfully'));
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
            className="space-y-6">

        {/* Bilingual name fields */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-text-secondary">
            {t('name')}
          </h3>
          <Tabs defaultValue="en">
            <TabsList>
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="ne">नेपाली</TabsTrigger>
            </TabsList>
            <TabsContent value="en">
              <FormField control={form.control} name="name.en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name (English)</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
            <TabsContent value="ne">
              <FormField control={form.control} name="name.ne"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>नाम (नेपाली)</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
          </Tabs>
        </div>

        <FormField control={form.control} name="isActive"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <FormLabel>{t('active')}</FormLabel>
                <p className="text-xs text-text-secondary">{t('activeDescription')}</p>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onSuccess}>
            {t('common:cancel')}
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending
              ? t('common:saving')
              : isEditing ? t('common:update') : t('common:create')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
```

## Section 2 — Form placement

Forms always open in a `Sheet` (side panel) from shadcn/ui — never in a modal dialog. Exception: confirmation dialogs for destructive actions always use `AlertDialog`.

```tsx
<Sheet open={open} onOpenChange={setOpen}>
  <SheetContent className="sm:max-w-[480px]">
    <SheetHeader>
      <SheetTitle>{isEditing ? t('editSector') : t('addSector')}</SheetTitle>
    </SheetHeader>
    <div className="mt-6">
      <SectorForm onSuccess={() => setOpen(false)} />
    </div>
  </SheetContent>
</Sheet>
```

## Section 3 — Rules

- Zod schema always in `src/lib/validations/` — never inline
- `type FormValues = z.infer<typeof schema>` — never manually typed
- `defaultValues` always provided — never rely on undefined
- Submit button always shows `isPending` state
- Submit button always disabled during `isPending`
- Forms always in a `Sheet` — never inline on the page
- Both `en` and `ne` name fields always rendered — both required on create
- `mapValidationErrors()` always called when `error.details` exists
