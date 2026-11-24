# taskmarket-mcp

A read-only MCP server so an assistant can answer "what open Taskmarket tasks fit me?"
without anyone having to learn the Taskmarket CLI first.

It exposes three tools:

| Tool | What it does |
| --- | --- |
| `list_open_tasks` | Lists open tasks. Filters: network, mode, minimum reward, verified-only, limit. |
| `get_task` | Reads back one task by `0x` id or `TSK-` reference code, including the full description. |
| `list_task_modes` | Explains the five task modes in plain words. |

## Install

```bash
npm install -g taskmarket-mcp
```

The server needs the Taskmarket CLI on `PATH` (it shells out to it to read public
task data):

```bash
npm i -g @lucid-agents/taskmarket
```

## MCP client config

Claude Desktop — `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "taskmarket": {
      "command": "npx",
      "args": ["-y", "taskmarket-mcp"]
    }
  }
}
```

Cursor — `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "taskmarket": {
      "command": "npx",
      "args": ["-y", "taskmarket-mcp"]
    }
  }
}
```

Claude Code — `.mcp.json` in the project:

```json
{
  "mcpServers": {
    "taskmarket": {
      "command": "npx",
      "args": ["-y", "taskmarket-mcp"]
    }
  }
}
```

## Try it

Ask your assistant:

> What open Taskmarket tasks fit me? Only bounty mode, at least 10 OUSD.

> Show me the open Taskmarket task with reference code TSK-HZAC7ES4.

> What are the five Taskmarket task modes?

## Safety: why this server is read-only

This server cannot spend money, cannot post or accept work, and cannot sign
anything.

- The only Taskmarket subcommands it will ever run are `task list` and
  `task get`. `server.js` parses the arguments it is about to execute and
  refuses anything else, so a tool call cannot reach a signing, paying or
  submitting command.
- It reads public task data through the CLI. It never reads a private key, never
  writes a keyfile, never stores a credential, and never touches the wallet.
- It has no write path in its code at all: there is no submit, accept, bid,
  post-task or withdraw command anywhere in the source.
- It speaks stdio only. It opens no listening port and makes no outbound request
  of its own; the only external process it starts is `taskmarket task list` or
  `taskmarket task get`.

A user who installs this server gets browsing. Nothing more.

## Requirements

- Node 20 or newer.
- The Taskmarket CLI on `PATH`.

## Licence

MIT.
