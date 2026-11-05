# TanStack Architect

Give your coding agent a PRD, and it picks the TanStack libraries that fit your stack. It also rules out the ones that don't. For example, it never suggests TanStack Router in a Next.js app.

This is an unofficial community project, not affiliated with TanStack.

## What's inside

| Part | Purpose |
| --- | --- |
| `tanstack-selection` skill | Reads the stack, matches requirements to libraries, and rejects anything that conflicts. |
| `tanstack-architect` agent | Turns a PRD into a written architecture proposal: the skill's library choices, the main parts of the app, how data flows through them, and ordered implementation steps. It only proposes and leaves your code unchanged. |

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

Open your project in Claude Code or Codex, and give the agent your PRD:

```text
Use the tanstack-architect agent on this PRD: <your PRD>
```

With the skill alone, ask your agent to plan the architecture from the PRD. The skill also starts on its own when you ask for that kind of plan.

## Maintenance

The agent's instructions exist twice: `agents/tanstack-architect.md` and `codex/agents/tanstack-architect.toml`. Keep them identical, and bump the version in `plugin.json` and `.claude-plugin/plugin.json` together.

Run the evals after changing the skill. They need the Claude Code CLI and use your account:

```bash
node evals/run.mjs
```

## License

MIT.
