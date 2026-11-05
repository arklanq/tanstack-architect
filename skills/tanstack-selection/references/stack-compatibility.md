# Stack compatibility

Rejections here are hard rules unless the user explicitly asks for a migration. Check adapters against `https://tanstack.com/api/data/libraries`. A newly listed adapter removes a rejection only when the library was rejected for missing framework support. It never overrides concern ownership.

## Concern ownership

The most common mistake is suggesting a library for a concern that the framework already owns. A library with a working adapter can still be wrong.

| Stack evidence | Rejected | What handles the concern instead | Notes on libraries that remain usable |
| --- | --- | --- | --- |
| Next.js (`next`) | Start, Router | Next.js routing. For URL state, `useSearchParams` and the page `searchParams` prop, or `nuqs` when typed URL state is needed. | Query only in Client Components, with hydration from Server Components. Form uses `@tanstack/react-form-nextjs`. Use Query only where the client needs caching or refetching. |
| React Router framework mode or Remix (`@react-router/dev`, `@remix-run/*`) | Start, Router | Route modules, loaders, and actions. | Form uses `@tanstack/react-form-remix`. Query is useful for client-side caching beyond loaders. |
| React Router library mode (`react-router` in a Vite app) | Start, Router | The existing router, including its search params hooks. | All client libraries remain available. |
| TanStack Start (`@tanstack/react-start`, `@tanstack/solid-start`) | Router as a separate decision, because Start includes it | Start routes and server functions. | Form uses `@tanstack/react-form-start`. Query integrates with the router. |
| TanStack Router in a client-rendered app | Start. If SSR or server code is required, list that under Risks as a decision for the user. | The existing router. | Query fits route loaders. |
| Vite with React or Solid and no router | Start. If SSR or server code is required, list that under Risks as a decision for the user. | | Router is a candidate only if the app needs several routes or typed URL state. |
| Vue, Nuxt | Start, Router, Redact, Markdown and Highlight React adapters | Vue Router, Nuxt routing. | Query, Table, Form, Virtual, and others have Vue adapters. |
| Svelte, SvelteKit | Start, Router, Redact | SvelteKit routing and form actions. | Query, Table, Form, and Virtual have Svelte adapters. |
| Angular | Start, Router, Redact | Angular Router, and Reactive Forms when they are in place. | Query, Table, Form, and Virtual have Angular adapters. |
| SolidStart | Start, Router | SolidStart routing. | Query, Table, Form, and Virtual have Solid adapters. |
| Astro | Start, Router | Astro pages. | Use client libraries only inside islands, and only when the island needs them. |
| Expo, React Native | Start, Router, Virtual, Table UI, Charts, Hotkeys, Markdown, Highlight, Redact | Expo Router or React Navigation, and FlashList or FlatList. | Query, Form, DB, and AI document React Native support. Pacer and Store have no DOM need, so check before use. |
| Server-rendered backends with templates or Inertia (Rails, Laravel, Django) | Start, Router | Backend routes and Inertia forms. | Add client libraries only for interactive islands. |
| Backend, CLI, or worker with no UI | Everything with a UI or client role | | Consider only AI (server use) and Markdown or Highlight (HTML output). |

If the stack is not listed, apply the same test: does the framework own routing, data loading, or forms? If so, reject the library for that concern.

Framework support applies in every row, even when a row does not repeat it:

- Redact is React only.
- Outside React, Markdown and Highlight offer only their framework-neutral output, such as HTML.
- `@tanstack/vue-router` and `@tanstack/vue-start` are on npm, but TanStack's metadata lists Router and Start only for React and Solid. Treat them as unsupported until the metadata lists Vue.

## Existing libraries

A working library blocks its TanStack equivalent. Do not suggest replacing it, and do not run both for one concern. If the user asks about migration, treat that as a separate decision.

| Concern | Blocks | When already installed |
| --- | --- | --- |
| Server state | Query | SWR, Apollo, urql, RTK Query |
| Forms | Form | React Hook Form, Formik, Vee-Validate, Angular Reactive Forms |
| Tables | Table | AG Grid, MUI Data Grid, a design system grid |
| Virtualization | Virtual | react-window, react-virtuoso, Vue Virtual Scroller |
| Charts | Charts | Recharts, ECharts, Chart.js, Visx, D3 |
| Client state | Store | Zustand, Redux, Jotai, Pinia, NgRx |
| AI | AI | Vercel AI SDK, LangChain, a direct provider SDK used for streaming |
| Shortcuts | Hotkeys | react-hotkeys-hook, tinykeys |
| Rate control | Pacer | lodash `debounce` or `throttle`, when they meet the need |
| Markdown | Markdown | react-markdown, remark, MDX |
| Highlighting | Highlight | Shiki, Prism, highlight.js |

Older versions of a TanStack library are not a conflict. Note the upgrade path instead of adding a second copy.

## Maturity

- Stable (v1 or later, and no warning in the overview): acceptable by default.
- Release candidate: acceptable when the requirement clearly needs it, and listed under Risks.
- Beta or pre-1.0: only when the benefit is clear and the feature is not business critical, and listed under Risks.
- Alpha or experimental: never for production requirements unless the user accepts the risk.

## No stack chosen yet

Do not treat this skill as a reason to pick TanStack for everything. Check the brief for constraints first, such as team experience, hosting, or required platforms.

| Product type | Default assumption |
| --- | --- |
| Interactive full-stack web app in React or Solid | Start, with Query. |
| Client-only dashboard behind login, with an existing API | Vite with Router and Query. |
| Mostly static or content site | Do not use Start or Router by default. Consider a content framework such as Astro, with Markdown and Highlight only if they fit. |
| Heavy dependence on React Server Components, or a team already on Next.js | Next.js, and apply its row in the table above. |
| Native mobile app | Expo, and apply its row in the table above. |

State the assumption in the report so the user can correct it.
