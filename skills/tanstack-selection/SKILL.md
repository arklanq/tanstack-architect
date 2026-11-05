---
name: tanstack-selection
description: Choose which TanStack libraries fit an app, and rule out the ones that conflict with its stack. Use whenever planning or designing the architecture of a web or mobile app or feature from a PRD or product brief, in any framework, and when choosing libraries for data fetching, caching, routing, URL state, forms, tables, long lists, charts, keyboard shortcuts, offline or optimistic UI, or AI chat. Use it even if TanStack is not mentioned. Not for API usage of a library that is already chosen.
---

# TanStack selection

Turn product requirements into a short list of TanStack libraries that this app can actually use. Recommending nothing is a valid result. The stack decides first, the requirements second.

## Workflow

### 1. Establish the stack

For an existing project, read the evidence before reasoning about libraries: `package.json` of the package being changed (not only the monorepo root), framework config files, and the lockfile.

Record the UI framework, the meta-framework, and which library already owns each concern: routing, server state, forms, tables, charts, client state, and AI.

For a new project, use the constraints in the brief. If the brief sets no stack, follow "No stack chosen yet" in [references/stack-compatibility.md](references/stack-compatibility.md) and state the choice as an assumption.

### 2. Extract the requirements

List what the product must do, in product terms. Keep requirements that imply a technical capability, such as "filters survive a page refresh" or "the table holds 100,000 rows". Do not invent requirements to justify a library.

### 3. Match candidates

Match each requirement against [references/libraries.md](references/libraries.md). Respect its "skip when" column: a simple need does not justify a dependency.

### 4. Apply the compatibility gate

Check every candidate in this order against [references/stack-compatibility.md](references/stack-compatibility.md). The first failure rejects it.

1. **Framework support.** The library has an adapter for this UI framework.
2. **Concern ownership.** The framework or meta-framework does not already own this concern.
3. **Existing library.** The project does not already have a working library for this concern.
4. **Runtime.** The library works where the code runs, such as a browser, React Native, or a server.
5. **Maturity.** The risk of a beta or pre-1.0 library is acceptable for this requirement.

A rejected library is never offered as an option, a follow-up, or a "could also". Do not propose changing the framework or replacing an existing library to make a candidate fit, unless the user asked for a migration.

When a library is rejected, solve the requirement with what the stack already provides, and name that solution.

### 5. Verify against current data

These facts change quickly, so check them before answering:

- Frameworks and versions: `https://tanstack.com/api/data/libraries`.
- Library list and docs index: `https://tanstack.com/llms.txt`. Each library also has `https://tanstack.com/<id>/latest/llms.txt`.
- Maturity and limits: the library's overview page, at `https://tanstack.com/<id>/latest/docs/overview.md` where it exists.

Current data overrides the framework lists and maturity notes in the references. Also check it for libraries that the references do not list yet. If the data cannot be reached, continue from the references and say that the result is unverified.

### 6. Report the result

Always use these exact section headings and table columns, because other tools and agents read this report. Write the content in the language of the conversation, and keep the headings in English. Any wider plan goes after this report, not instead of it.

```markdown
## Stack
<UI framework, meta-framework, and who owns routing and data. Mark assumptions.>

## Recommended
| Requirement | Library | Package | Why it fits this stack |

## Handled without TanStack
| Requirement | Solution | Why |

## Rejected by the stack
| Library | Reason |

## Risks
<Beta or pre-1.0 choices and anything not verified.>

## Next steps
<Install commands in the project's package manager, then `npx @tanstack/intent@latest install`. Omit this section when nothing is recommended.>
```

Omit empty sections. List only rejected libraries that someone would reasonably expect, not every library that does not apply.

## After the choice

This skill selects libraries, it does not teach their APIs. After installing the packages, run `npx @tanstack/intent@latest install` so the agent loads the skills shipped with those exact versions. For a library that ships no skills, use its `llms.txt`.
