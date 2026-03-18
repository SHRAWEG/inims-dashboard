# Charts

## Section 1 — Library choice

Simple charts (line, bar, pie with minimal customization) → `recharts`
Complex custom charts, custom interactions → `@visx/*`

Install:
```bash
npm install recharts
npm install @visx/scale @visx/shape @visx/axis @visx/grid @visx/tooltip @visx/responsive
```

## Section 2 — Data contract

Charts always consume `ChartResponse` from the backend:
```ts
export interface ChartResponse {
  labels: string[];
  datasets: ChartDataset[];
  summary?: Record<string, number>;
}
export interface ChartDataset {
  label: string;
  data: number[];
  color?: string;
}
```

## Section 3 — Chart colors

Always use design system chart tokens in order:
```ts
export const CHART_COLORS = [
  'var(--color-chart-1)', // crimson — always first
  'var(--color-chart-2)', // deep blue — always second
  'var(--color-chart-3)', // green
  'var(--color-chart-4)', // amber
  'var(--color-chart-5)', // purple
];
```

Never use hardcoded hex values in charts.

## Section 4 — Standard Recharts line chart

```tsx
export function LineChart({ data, height = 300, isLoading }: LineChartProps) {
  if (isLoading) return <ChartSkeleton height={height} />;
  if (!data?.labels.length) return <ChartEmpty height={height} />;

  const chartData = data.labels.map((label, i) => ({
    label,
    ...Object.fromEntries(data.datasets.map(d => [d.label, d.data[i]])),
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis dataKey="label" tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }} />
        <YAxis tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }} />
        <Tooltip
          contentStyle={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
          }}
        />
        <Legend />
        {data.datasets.map((dataset, i) => (
          <Line
            key={dataset.label}
            type="monotone"
            dataKey={dataset.label}
            stroke={CHART_COLORS[i % CHART_COLORS.length]}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
```

## Section 5 — Rules

- Charts always in `ResponsiveContainer` — never fixed width
- Charts always show `ChartSkeleton` while loading
- Charts always show `ChartEmpty` when no data
- Data always passed as props — never fetched inside chart components
- Always use `CHART_COLORS` array — never hardcode colors
- Tooltip always styled with design system tokens
