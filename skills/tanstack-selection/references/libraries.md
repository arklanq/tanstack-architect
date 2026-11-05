# TanStack libraries by requirement

Maturity notes were checked on 2026-11-04. Verify them against current data before answering.

## Application foundation

| Library | Pick when the requirement says | Skip when | Maturity |
| --- | --- | --- | --- |
| **Start** | A new full-stack React or Solid app needs SSR, typed server functions, and end-to-end type safety. | A meta-framework is in place, or the app needs no server rendering or server code. | v1. |
| **Router** | A client-rendered React or Solid app has many routes, or complex URL state such as filters and sort order that must stay shareable and typed. | Any framework owns routing. A Start app already includes it. | v1. |

## Data and state

| Library | Pick when the requirement says | Skip when | Maturity |
| --- | --- | --- | --- |
| **Query** | The client reads server data with caching, background refresh, retries, pagination, infinite scroll, or optimistic updates. | Data is rendered only on the server, such as React Server Components with no client refetching, or a data layer such as Apollo, urql, or RTK Query is in place. | v5, stable. |
| **DB** | Many views join and filter the same data on the client, interactions must be instant, or the app needs a sync engine or offline writes. | Plain fetch-and-display screens, where Query is enough. | 1.0 release candidate. Packages may still report 0.x. |
| **Store** | A small reactive store is shared across frameworks or is needed for a custom library. | React state, context, or an existing store is enough. | Pre-1.0. Mainly used inside other TanStack libraries. |

## User interface

All of these are headless or bring little styling, so the app must still provide the design.

| Library | Pick when the requirement says | Skip when | Maturity |
| --- | --- | --- | --- |
| **Table** | A data grid needs sorting, filtering, grouping, pagination, or column control, with custom markup. | A small static table, or a design system grid is in place. For pivoting and Excel export, consider AG Grid. | v9. Check the v8 migration guide if v8 is installed. |
| **Virtual** | A list, grid, or feed holds thousands of items or has a variable item height. | Lists small enough that paging or plain rendering performs well. React Native, which has its own list components. | v3, stable. |
| **Form** | Forms have complex validation, dependent or dynamic fields, or shared client and server validation. | One or two simple fields, where native forms or framework actions are enough. | v1. |
| **Charts** | The product needs custom, composable charts in SVG or Canvas. | A chart library is in place. | v1. Young, so check its compatibility page. |
| **Hotkeys** | The product has keyboard shortcuts, sequences, a cheat sheet, or user rebinding. | One or two shortcuts that a plain key listener handles. | Beta. |
| **Markdown** | A docs site, blog, or AI stream renders controlled Markdown with a small bundle. | The app needs MDX, full CommonMark coverage, or a plugin ecosystem. | v1. React, Octane, or HTML output only. |
| **Highlight** | A docs site or blog highlights code, including during SSR, with a small bundle. | The app needs editor features, automatic language detection, or TextMate grammars. | v1. |

## Behaviour and performance

| Library | Pick when the requirement says | Skip when | Maturity |
| --- | --- | --- | --- |
| **Pacer** | The UI needs debouncing, throttling, rate limiting, queuing, or batching with pending state or cancellation. | One simple debounce, or a utility already in the project covers it. | Beta. Mostly client-side today. |
| **Redact** | Reducing the React runtime size is an explicit requirement, and its compatibility guide has been checked against the app. | Any other case. Never choose it by default, because it replaces the React browser runtime. | Pre-1.0. |

## AI

| Library | Pick when the requirement says | Skip when | Maturity |
| --- | --- | --- | --- |
| **AI** | The product needs streaming chat, tool calls, or media generation, with a provider-neutral TypeScript API. | Another AI SDK is in place. Read its comparison pages when the choice is open. | v1 core. The agent harness is experimental. |

## Tooling

Add these only as support for libraries already chosen. They do not answer product requirements.

| Library | Use | Maturity |
| --- | --- | --- |
| **Devtools** | A shared panel for TanStack devtools and custom ones. | Alpha. |
| **CLI** | Scaffolding a new Start app and searching the docs: `tanstack create`, `tanstack search-docs`, `tanstack libraries --json`. | Pre-1.0. |
| **Intent** | Loading the skills that ship with installed packages. | Pre-1.0. |
| **Config** | Publishing JavaScript packages. Relevant only to library authors. | Pre-1.0. |

## Pairs that work well

- Start or Router with Query: loaders prefetch and Query owns the cache. Avoid two competing caches.
- Query with DB: DB builds on Query through the Query collection.
- Table with Virtual: large grids.
- Table with Query: server-side pagination, sorting, and filtering.
- Virtual with AI and Markdown: long streamed chats.
