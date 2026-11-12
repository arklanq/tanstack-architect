# TanStack Architect

Give your coding agent a PRD, a rough idea, or an existing codebase, and it picks the TanStack libraries that fit your stack. It also rules out the ones that don't. For example, it never suggests TanStack Router in a Next.js app.

This is an unofficial community project, not affiliated with TanStack.

## What's inside

| Part | Purpose |
| --- | --- |
| `tanstack-selection` skill | Reads the stack, matches requirements to libraries, and rejects anything that conflicts. |
| `tanstack-architect` agent | Turns a PRD or a rough idea into a written architecture proposal: the skill's library choices, the main parts of the app, how data flows through them, and ordered implementation steps. For an existing codebase, it reviews what is worth moving to TanStack and orders the migration steps. It only proposes and leaves your code unchanged. |

The skill checks current data from `tanstack.com` when it runs. For API usage, it hands over to the skills that ship with TanStack packages, through [TanStack Intent](https://tanstack.com/intent/latest).

## Install

### Skill only, for any agent

```bash
bunx skills add arklanq/tanstack-architect
```

### Plugin for Claude Code

The plugin installs both the skill and the agent. Run these inside Claude Code:

```text
/plugin marketplace add arklanq/tanstack-architect
/plugin install tanstack-architect@tanstack-architect
```

### Plugin for Codex

Codex plugins do not document a way to ship custom agents, so the agent is a separate file.

```bash
codex plugin marketplace add arklanq/tanstack-architect
```

```bash
codex plugin add tanstack-architect@tanstack-architect
```

```bash
mkdir -p ~/.codex/agents && curl -fsSL https://raw.githubusercontent.com/arklanq/tanstack-architect/main/codex/agents/tanstack-architect.toml -o ~/.codex/agents/tanstack-architect.toml
```

The skill works without the agent.

## Usage

Open your project in Claude Code or Codex, and tell the agent what you want. Your prompt sets the goal and the input, for example:

```text
Use the tanstack-architect agent on this PRD: <your PRD>
```

```text
Use the tanstack-architect agent to plan this feature. I only have a rough idea: <your idea>
```

```text
Use the tanstack-architect agent to review this repo and tell me which parts are worth moving to TanStack libraries.
```

With the skill alone, ask your agent the same things without naming the agent. The skill also starts on its own when you ask for that kind of plan or review.

## Maintenance

The agent's instructions exist twice: `agents/tanstack-architect.md` and `codex/agents/tanstack-architect.toml`. Keep them identical, and bump the version in `plugin.json` and `.claude-plugin/plugin.json` together.

To install the plugin from this checkout in Claude Code and Codex, including the Codex agent, run this from the project root. It needs both CLIs, and you can run it again after each change, because Codex keeps a copy of the plugin:

```bash
bun run install:local
```

Run the evals after changing the skill. They need the Claude Code CLI and use your account:

```bash
node evals/run.js
```

## License

MIT.
