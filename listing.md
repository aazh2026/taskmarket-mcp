# listing.md

Drafts only. Do not publish without the owner's say-so.

---

## Directory 1 — Smithery

**Name**
Taskmarket MCP

**One-line summary**
Browse open Taskmarket tasks from Claude, Cursor or any MCP client — read-only.

**Description (80 words)**
Find paid work without learning a CLI. Taskmarket MCP exposes the open task
list through three read-only tools: list open tasks by mode, reward or network;
read one task in full by id or reference code; and explain the five task modes
in plain words. It never signs, never spends, never touches a private key.
Reads public task data through the Taskmarket CLI. Node 20+, one install
command, no configuration beyond adding a server entry.

**Tags**
`taskmarket` `mcp` `tasks` `marketplace` `read-only` `agents`

---

## Directory 2 — Glama

**Name**
Taskmarket MCP Server

**One-line summary**
Let your assistant ask "what open tasks fit me?" on Taskmarket.

**Description (80 words)**
Taskmarket is a marketplace where agents and people post paid tasks and do
them. This MCP server lets any MCP client browse it. Three tools: list open
tasks filtered by mode, reward, network and verified-worker status; read a
single task in full; and get the five task modes explained plainly. Strictly
read-only — it runs only the CLI's read commands, never signs, never spends,
never stores a key. Built on the official MCP SDK with no other dependency.

**Tags**
`mcp` `mcp-server` `taskmarket` `productivity` `developer-tools`

---

## Directory 3 — PulseMCP

**Name**
Taskmarket

**One-line summary**
Read-only MCP access to the open Taskmarket task board.

**Description (80 words)**
Adds a task browser to Claude, Cursor and other MCP clients. Ask for open
bounties above a reward floor, or for tasks restricted to verified workers, and
get back ids, rewards, deadlines and submission counts as JSON. Pull one task
in full with its complete brief. The five task modes are documented in plain
language for clients that need to explain them. Read-only by construction:
the only commands it can reach are the CLI's task listing and task lookup. No
keys, no signing, no spending.

**Tags**
`taskmarket` `mcp` `read-only` `tasks` `ai-agents`

---

## Notes

- All three drafts describe the same server. The wording differs so the three
  listings do not read as three copies of one paragraph.
- No claim in these drafts goes beyond the Taskmarket fact sheet: it is a
  marketplace where agents and people post paid tasks and do them; rewards are
  held in escrow on-chain until the requester accepts a result or reclaims it;
  rewards are paid in USDC on Base or OUSD on Tempo; there are five task modes
  (bounty, claim, pitch, benchmark, auction); requesters can limit a task to
  verified workers; agents use the command-line tool
  `npm i -g @lucid-agents/taskmarket`.
- No user numbers, earnings, fees, partners or dates appear in any draft.
- No banned words appear in any draft.
