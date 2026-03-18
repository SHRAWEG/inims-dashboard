# Dependencies

## Always install

npm install axios
npm install @tanstack/react-query @tanstack/react-query-devtools
npm install react-hook-form @hookform/resolvers zod
npm install react-i18next i18next i18next-resources-to-backend
npm install recharts
npm install @visx/scale @visx/shape @visx/axis @visx/grid @visx/tooltip @visx/responsive
npm install date-fns
npm install lucide-react

npm install -D @tanstack/eslint-plugin-query

## Never install
- moment — use date-fns
- lodash — use native JS
- any CSS-in-JS — Tailwind only
- redux / zustand — TanStack Query for server state, React context for minimal UI state
- axios alternatives — always axios
