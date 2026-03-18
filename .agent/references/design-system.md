# Design System

This is the single source of truth for every visual decision in the app. Agents must read this before touching any className, color, or layout.

## Section 1 — Color tokens

Define all colors as CSS variables in `src/app/globals.css`:

```css
@layer base {
  :root {
    /* Brand */
    --color-primary: oklch(0.536 0.232 15.65);        /* Crimson Red */
    --color-primary-hover: oklch(0.480 0.232 15.65);  /* darker on hover */
    --color-primary-foreground: oklch(0.985 0 0);     /* white text on primary */

    --color-secondary: #004b8e;                        /* Deep Blue */
    --color-secondary-hover: #003d75;                 /* darker on hover */
    --color-secondary-foreground: #ffffff;

    /* Background & Surface */
    --color-background: oklch(0.985 0.003 247.88);    /* Off-white page bg */
    --color-surface: #ffffff;                          /* Card/panel bg */
    --color-surface-hover: oklch(0.975 0.003 247.88); /* Subtle hover on cards */

    /* Border */
    --color-border: oklch(0.922 0.003 247.88);        /* Default border */
    --color-border-strong: oklch(0.850 0.003 247.88); /* Emphasized border */

    /* Text */
    --color-text-primary: oklch(0.145 0.004 285.82);  /* Near black */
    --color-text-secondary: oklch(0.450 0.004 285.82);/* Muted */
    --color-text-tertiary: oklch(0.650 0.004 285.82); /* Placeholder */
    --color-text-inverse: #ffffff;                     /* On dark bg */

    /* Semantic */
    --color-success: oklch(0.527 0.154 150.07);
    --color-success-bg: oklch(0.950 0.050 150.07);
    --color-warning: oklch(0.660 0.179 60.00);
    --color-warning-bg: oklch(0.970 0.040 60.00);
    --color-danger: oklch(0.536 0.232 15.65);         /* same as primary */
    --color-danger-bg: oklch(0.970 0.040 15.65);
    --color-info: #004b8e;                             /* same as secondary */
    --color-info-bg: oklch(0.960 0.030 230.00);

    /* Chart colors — in order of use */
    --color-chart-1: oklch(0.536 0.232 15.65);        /* primary crimson */
    --color-chart-2: #004b8e;                          /* secondary blue */
    --color-chart-3: oklch(0.527 0.154 150.07);        /* green */
    --color-chart-4: oklch(0.660 0.179 60.00);         /* amber */
    --color-chart-5: oklch(0.550 0.200 280.00);        /* purple */

    /* Sidebar */
    --color-sidebar-bg: oklch(0.145 0.004 285.82);    /* near black */
    --color-sidebar-text: oklch(0.850 0.004 285.82);  /* light gray */
    --color-sidebar-text-active: #ffffff;
    --color-sidebar-highlight: oklch(0.536 0.232 15.65); /* crimson active item */
    --color-sidebar-hover: oklch(0.200 0.004 285.82);

    /* Spacing & radius */
    --radius-sm: 0.375rem;   /* 6px */
    --radius-md: 0.5rem;     /* 8px */
    --radius-lg: 0.75rem;    /* 12px */
    --radius-xl: 1rem;       /* 16px */
  }
}
```

Map these to Tailwind in `tailwind.config.ts`:

```ts
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: 'var(--color-primary)',
        hover: 'var(--color-primary-hover)',
        foreground: 'var(--color-primary-foreground)',
      },
      secondary: {
        DEFAULT: 'var(--color-secondary)',
        hover: 'var(--color-secondary-hover)',
        foreground: 'var(--color-secondary-foreground)',
      },
      background: 'var(--color-background)',
      surface: {
        DEFAULT: 'var(--color-surface)',
        hover: 'var(--color-surface-hover)',
      },
      border: {
        DEFAULT: 'var(--color-border)',
        strong: 'var(--color-border-strong)',
      },
      text: {
        primary: 'var(--color-text-primary)',
        secondary: 'var(--color-text-secondary)',
        tertiary: 'var(--color-text-tertiary)',
        inverse: 'var(--color-text-inverse)',
      },
      sidebar: {
        bg: 'var(--color-sidebar-bg)',
        text: 'var(--color-sidebar-text)',
        'text-active': 'var(--color-sidebar-text-active)',
        highlight: 'var(--color-sidebar-highlight)',
        hover: 'var(--color-sidebar-hover)',
      },
      chart: {
        1: 'var(--color-chart-1)',
        2: 'var(--color-chart-2)',
        3: 'var(--color-chart-3)',
        4: 'var(--color-chart-4)',
        5: 'var(--color-chart-5)',
      },
      success: {
        DEFAULT: 'var(--color-success)',
        bg: 'var(--color-success-bg)',
      },
      warning: {
        DEFAULT: 'var(--color-warning)',
        bg: 'var(--color-warning-bg)',
      },
      danger: {
        DEFAULT: 'var(--color-danger)',
        bg: 'var(--color-danger-bg)',
      },
      info: {
        DEFAULT: 'var(--color-info)',
        bg: 'var(--color-info-bg)',
      },
    },
    borderRadius: {
      sm: 'var(--radius-sm)',
      md: 'var(--radius-md)',
      lg: 'var(--radius-lg)',
      xl: 'var(--radius-xl)',
    },
  },
},
```

## Section 2 — shadcn/ui theme mapping

Map shadcn/ui CSS variables to the design tokens so all shadcn components automatically use the brand colors:

```css
:root {
  --background: oklch(0.985 0.003 247.88);
  --foreground: oklch(0.145 0.004 285.82);
  --card: #ffffff;
  --card-foreground: oklch(0.145 0.004 285.82);
  --primary: oklch(0.536 0.232 15.65);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: #004b8e;
  --secondary-foreground: #ffffff;
  --muted: oklch(0.960 0.003 247.88);
  --muted-foreground: oklch(0.450 0.004 285.82);
  --accent: oklch(0.960 0.003 247.88);
  --accent-foreground: oklch(0.145 0.004 285.82);
  --destructive: oklch(0.536 0.232 15.65);
  --destructive-foreground: oklch(0.985 0 0);
  --border: oklch(0.922 0.003 247.88);
  --input: oklch(0.922 0.003 247.88);
  --ring: oklch(0.536 0.232 15.65);
  --radius: 0.5rem;
}
```

## Section 3 — Typography

```css
/* src/app/globals.css */
body {
  font-family: var(--font-sans);
  color: var(--color-text-primary);
  background-color: var(--color-background);
  font-size: 14px;
  line-height: 1.6;
}
```

Heading scale — use these Tailwind classes consistently:
- Page title: `text-2xl font-semibold text-text-primary`
- Section title: `text-lg font-semibold text-text-primary`
- Card title: `text-base font-medium text-text-primary`
- Label: `text-sm font-medium text-text-primary`
- Body: `text-sm text-text-primary`
- Muted/caption: `text-xs text-text-secondary`

## Section 4 — Layout

Sidebar width: `256px` fixed, never collapsible in this app.
Content area: `calc(100vw - 256px)`, padding `24px`.
Topbar height: `64px`.
Page max content width: `1400px`.

Standard page layout:
```tsx
<div className="flex h-screen bg-background overflow-hidden">
  <Sidebar />                          {/* fixed 256px, full height, bg-sidebar-bg */}
  <div className="flex flex-col flex-1 overflow-hidden">
    <Topbar />                         {/* 64px, bg-surface, border-b border-border */}
    <main className="flex-1 overflow-auto p-6">
      <div className="max-w-[1400px] mx-auto">
        {children}
      </div>
    </main>
  </div>
</div>
```

## Section 5 — Component patterns

**Cards:**
```tsx
<div className="bg-surface rounded-lg border border-border p-6">
  {children}
</div>
```

**Page header:**
```tsx
<div className="flex items-center justify-between mb-6">
  <div>
    <h1 className="text-2xl font-semibold text-text-primary">{title}</h1>
    <p className="text-sm text-text-secondary mt-1">{description}</p>
  </div>
  <div className="flex items-center gap-3">{actions}</div>
</div>
```

**Primary button:** `bg-primary hover:bg-primary-hover text-primary-foreground`
**Secondary button:** `bg-secondary hover:bg-secondary-hover text-secondary-foreground`
**Ghost button:** `hover:bg-surface-hover text-text-primary`
**Danger button:** `bg-danger hover:bg-danger/90 text-primary-foreground`

**Status badges:**
```tsx
// Active
<span className="bg-success-bg text-success text-xs font-medium px-2 py-0.5 rounded-md">
  Active
</span>
// Inactive
<span className="bg-danger-bg text-danger text-xs font-medium px-2 py-0.5 rounded-md">
  Inactive
</span>
```

**Sidebar active item:**
```tsx
// Active nav item
<div className="flex items-center gap-3 px-3 py-2 rounded-md bg-sidebar-highlight text-sidebar-text-active">
  <Icon className="w-4 h-4" />
  <span className="text-sm font-medium">{label}</span>
</div>
// Inactive nav item
<div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-hover text-sidebar-text cursor-pointer">
  <Icon className="w-4 h-4" />
  <span className="text-sm font-medium">{label}</span>
</div>
```

## Section 6 — Rules

- Never use arbitrary color values like `text-[#004b8e]` — always use the mapped Tailwind token like `text-secondary`
- Never use `text-red-500` for errors — use `text-danger`
- Never use `text-green-500` for success — use `text-success`
- Never use `bg-gray-100` for surfaces — use `bg-surface` or `bg-background`
- Chart colors always in order: `chart-1` first, `chart-2` second — never random
- Sidebar always dark background (`bg-sidebar-bg`) with crimson active highlight
- All interactive elements must have a visible hover state using the defined hover tokens
- Border radius always uses the defined radius tokens — never `rounded-full` except for avatars and pills
