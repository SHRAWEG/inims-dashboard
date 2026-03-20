import * as z from "zod";

// Base name schema for localized fields
export const localizedNameSchema = z.object({
  en: z.string().min(1, "English name is required"),
  ne: z.string().min(1, "Nepali name is required"),
});

// Base description schema
export const localizedDescriptionSchema = z.object({
  en: z.string().optional(),
  ne: z.string().optional(),
}).optional();

// Localized code schema
export const localizedCodeSchema = z.object({
  en: z.string().min(1, "English code is required"),
  ne: z.string().min(1, "Nepali code is required"),
});

// Common Master Schema (Sectors, Types, Genders, Frequencies, Age Groups)
export const commonMasterSchema = z.object({
  name: localizedNameSchema,
  isActive: z.boolean().default(true),
});

// MSNP Indicator Schema
export const indicatorSchema = z.object({
  name: localizedNameSchema,
  code: localizedCodeSchema,
  isActive: z.boolean().default(true),
});

// Administrative Level Schema
export const administrativeLevelSchema = z.object({
  name: localizedNameSchema,
  isActive: z.boolean().default(true),
});

export type IndicatorFormValues = z.infer<typeof indicatorSchema>;
export type CommonMasterFormValues = z.infer<typeof commonMasterSchema>;
