---
name: nextjs-dashboard
description: Use this skill for every Next.js App Router dashboard project.
  Covers project structure, API integration, auth, forms, tables, charts,
  design system, error handling, i18n, and all coding conventions. Always
  read this skill before writing any Next.js code, creating any page,
  component, hook, or making any architectural decision. Applies to admin
  panels, dashboards, data-driven apps, and any Next.js application
  consuming a REST API backend.
---

## Stack

- Next.js 14+ App Router, TypeScript strict mode
- Tailwind CSS + shadcn/ui for all UI components
- TanStack Query v5 for all server state and data fetching
- React Hook Form + Zod for all forms
- shadcn/ui DataTable (TanStack Table) for all tables
- Visx (@visx/*) for complex charts, Recharts for simple charts
- react-i18next for UI locale switching (en/ne)
- Next.js middleware + httpOnly cookies for auth token storage

## Design system

- Primary: oklch(0.536 0.232 15.65) — Crimson Red
- Secondary: #004b8e — Deep Blue
- Background: oklch(0.985 0.003 247.88) — Off-white
- Surface: pure white with subtle borders
- Full design token reference → references/design-system.md

## Universal rules — apply to every task without being told

- No `any` types — ever
- No `console.log` — never
- No raw `fetch` in components — always through the central API client
- No `useEffect` + `useState` for data fetching — always TanStack Query
- No uncontrolled inputs — always React Hook Form + Zod
- No custom table markup — always shadcn/ui DataTable
- No inline styles — always Tailwind classes
- No hardcoded color hex values in components — always use CSS variables from design system
- No hardcoded user-facing strings — always react-i18next `t()` 
- Components never call the API directly — always through a custom hook
- shadcn/ui components used as-is — customize only via `className` prop
- All colors, spacing, radius through design tokens — never arbitrary values

## What to read based on your task

Starting a new project
→ references/new-project-setup.md then references/dependencies.md

Creating any new module (page + table + form)
→ references/new-module-checklist.md + references/conventions.md

Any API integration
→ references/api-client.md

Any auth work
→ references/auth-flow.md

Any form
→ references/forms.md

Any table
→ references/tables.md

Any chart
→ references/charts.md

Any page, layout, or component
→ references/folder-structure.md + references/conventions.md

Any error handling
→ references/error-handling.md

Any i18n / locale work
→ references/i18n.md

Any styling, color, spacing, or component appearance decision
→ references/design-system.md
