# transcript.md

A real session against this server, run over stdio with the official MCP SDK
client. The client code that produced it is `transcript-run.mjs` in this repo;
the matching `taskmarket` CLI output for each call is printed next to it.

Everything below was captured on 2026-11-24 from the Tempo chain.

---

## 1. Discover the tools

```
>>> client.listTools() -> tool names
[
  "list_open_tasks",
  "get_task",
  "list_task_modes"
]
```

---

## 2. `list_task_modes` — the five modes in plain words

```
>>> client.callTool("list_task_modes")
{
  "modes": [
    {
      "mode": "bounty",
      "plain": "Many people submit work; the requester picks one or more winners."
    },
    {
      "mode": "claim",
      "plain": "One worker reserves the task first, then does it."
    },
    {
      "mode": "pitch",
      "plain": "Workers pitch how they would do it; the requester selects one."
    },
    {
      "mode": "benchmark",
      "plain": "Entries are ranked against a measured metric."
    },
    {
      "mode": "auction",
      "plain": "Workers bid on the price; the lowest accepted bid does the work."
    }
  ]
}
```

---

## 3. `list_open_tasks` — bounty mode, at least 10 OUSD

```
>>> client.callTool("list_open_tasks", {network:"tempo", mode:"bounty", min_reward_tokens:10, limit:5})
{
  "count": 5,
  "tasks": [
    {
      "id": "0x3f6d7b4406bb6d263939514f5612b08e6cec5e9ee9d053d1a601650d446c3947",
      "reference_code": "TSK-BRK611AN",
      "title": "Build and host Taskmarket's live market visualizer (50 OUSD)",
      "mode": "bounty",
      "reward_base_units": "50000000",
      "reward_token": "OUSD",
      "chain": "Tempo",
      "network": "tempo",
      "expiry": "2026-12-01T18:52:41.163Z",
      "submission_count": 0,
      "requires_verified_worker": true,
      "tags": ["growth", "visualizer", "data", "dashboard"]
    },
    {
      "id": "0x7c03bf7ec59b598f3ce220407d377a72da76ef99046245659a6c74c53e366cdd",
      "reference_code": "TSK-XW6AGNNW",
      "title": "Taskmarket MCP server: let Claude, Cursor and other MCP clients browse open tasks, read-only (10 OUSD)",
      "mode": "bounty",
      "reward_base_units": "10000000",
      "reward_token": "OUSD",
      "chain": "Tempo",
      "network": "tempo",
      "expiry": "2026-11-26T20:06:14.952Z",
      "submission_count": 59,
      "requires_verified_worker": true,
      "tags": ["growth", "flywheel", "marketing"]
    },
    {
      "id": "0x80a0585cc32faa6c13c2f43f7fd1c43d236619790dd117b47907349a9230acae",
      "reference_code": "TSK-9WF3H8EZ",
      "title": "Suggest the next Taskmarket marketing task (10 OUSD split among authors of adopted ideas)",
      "mode": "bounty",
      "reward_base_units": "10000000",
      "reward_token": "OUSD",
      "chain": "Tempo",
      "network": "tempo",
      "expiry": "2026-12-01T10:23:05.013Z",
      "submission_count": 58,
      "requires_verified_worker": true,
      "tags": ["growth", "flywheel", "ideas", "marketing"]
    },
    {
      "id": "0x2f1d59898ecd94f01dbaf1034c57f096c6512154cb0c15a6c2e035ada4139303",
      "reference_code": "TSK-Z650DAKT",
      "title": "Jazz-Reggae Vibe Coding Music: Original 60-Second Shorts — $20 Bounty",
      "mode": "bounty",
      "reward_base_units": "20000000",
      "reward_token": "OUSD",
      "chain": "Tempo",
      "network": "tempo",
      "expiry": "2026-11-29T10:16:19.222Z",
      "submission_count": 76,
      "requires_verified_worker": true,
      "tags": ["music", "jazz", "reggae", "video", "shorts"]
    },
    {
      "id": "0xbbbfba707ab89aa0d3caae8b3e5e47eedabadefc877d87baf5739723dbd7e38e",
      "reference_code": "TSK-66YD1X78",
      "title": "Hero illustration (16:9, at least 2400px wide) for a blog post on how ordinary people earn in the AI economy. It should be inspired by this line: 'Given the ...",
      "mode": "bounty",
      "reward_base_units": "20000000",
      "reward_token": "OUSD",
      "chain": "Tempo",
      "network": "tempo",
      "expiry": "2026-11-29T10:15:03.693Z",
      "submission_count": 65,
      "requires_verified_worker": true,
      "tags": ["illustration", "image", "art"]
    }
  ],
  "notes": []
}
```

Matching CLI output for the same filters:

```
$ taskmarket --network tempo task list --status open --mode bounty --reward-min 10 --limit 5
TSK-BRK611AN | 0x3f6d7b4406bb6d263939514f5612b08e6cec5e9ee9d053d1a601650d446c3947 | reward=50000000 | mode=bounty | subs=0 | verifiedBy=["tap:identity:verified"] | tags=["growth","visualizer","data","dashboard"]
TSK-XW6AGNNW | 0x7c03bf7ec59b598f3ce220407d377a72da76ef99046245659a6c74c53e366cdd | reward=10000000 | mode=bounty | subs=59 | verifiedBy=["tap:identity:verified"] | tags=["growth","flywheel","marketing"]
TSK-9WF3H8EZ | 0x80a0585cc32faa6c13c2f43f7fd1c43d236619790dd117b47907349a9230acae | reward=10000000 | mode=bounty | subs=58 | verifiedBy=["tap:identity:verified"] | tags=["growth","flywheel","ideas","marketing"]
TSK-Z650DAKT | 0x2f1d59898ecd94f01dbaf1034c57f096c6512154cb0c15a6c2e035ada4139303 | reward=20000000 | mode=bounty | subs=76 | verifiedBy=["tap:identity:verified"] | tags=["music","jazz","reggae","video","shorts"]
TSK-66YD1X78 | 0xbbbfba707ab89aa0d3caae8b3e5e47eedabadefc877d87baf5739723dbd7e38e | reward=20000000 | mode=bounty | subs=65 | verifiedBy=["tap:identity:verified"] | tags=["illustration","image","art"]
```

Same five tasks, same ids, same rewards, same submission counts. The server only
reshapes the CLI's JSON; it does not re-rank or re-filter.

---

## 4. `list_open_tasks` — verified workers only

```
>>> client.callTool("list_open_tasks", {network:"tempo", verified_only:true, limit:3})
{
  "count": 3,
  "tasks": [
    {
      "id": "0x6401c9a9de89787406d226742e50e461178917b6c53084035e47736d84f41d51",
      "reference_code": "TSK-5A5FJXTN",
      "title": "Design a physical progress-tracking board: an art installation you update by hand ($5 bounty)",
      "mode": "bounty",
      "reward_base_units": "5000000",
      "reward_token": "OUSD",
      "chain": "Tempo",
      "network": "tempo",
      "expiry": "2026-12-08T19:01:48.986Z",
      "submission_count": 11,
      "requires_verified_worker": true,
      "tags": ["design", "physical", "prototype", "text"]
    },
    {
      "id": "0x3f6d7b4406bb6d263939514f5612b08e6cec5e9ee9d053d1a601650d446c3947",
      "reference_code": "TSK-BRK611AN",
      "title": "Build and host Taskmarket's live market visualizer (50 OUSD)",
      "mode": "bounty",
      "reward_base_units": "50000000",
      "reward_token": "OUSD",
      "chain": "Tempo",
      "network": "tempo",
      "expiry": "2026-12-01T18:52:41.163Z",
      "submission_count": 0,
      "requires_verified_worker": true,
      "tags": ["growth", "visualizer", "data", "dashboard"]
    },
    {
      "id": "0xc5a730d4e1ab1669b28889f67f06e130433ca163d4981e4787e430060e4fb9ba",
      "reference_code": "TSK-ZJ31CCTJ",
      "title": "Suggest a growth hack for Taskmarket (5 OUSD split among authors of adopted ideas)",
      "mode": "bounty",
      "reward_base_units": "5000000",
      "reward_token": "OUSD",
      "chain": "Tempo",
      "network": "tempo",
      "expiry": "2026-12-01T18:26:00.000Z",
      "submission_count": 19,
      "requires_verified_worker": true,
      "tags": ["growth", "flywheel", "ideas", "marketing"]
    }
  ],
  "notes": []
}
```

Matching CLI output for the same filter:

```
$ taskmarket --network tempo task list --status open --verified-by tap:identity:verified --limit 3
TSK-5A5FJXTN | 0x6401c9a9de89787406d226742e50e461178917b6c53084035e47736d84f41d51 | reward=5000000 | mode=bounty | subs=11 | verifiedBy=["tap:identity:verified"]
TSK-BRK611AN | 0x3f6d7b4406bb6d263939514f5612b08e6cec5e9ee9d053d1a601650d446c3947 | reward=50000000 | mode=bounty | subs=0 | verifiedBy=["tap:identity:verified"]
TSK-ZJ31CCTJ | 0xc5a730d4e1ab1669b28889f67f06e130433ca163d4981e4787e430060e4fb9ba | reward=5000000 | mode=bounty | subs=19 | verifiedBy=["tap:identity:verified"]
```

---

## 5. `get_task` — one task by reference code

```
>>> client.callTool("get_task", {task_id:"TSK-HZAC7ES4", network:"tempo"})
{
  "id": "0x3e74ecc2dbe1d130105422d0d7fc5cff8bc564447ac3b710eb6ecf69fd55e582",
  "reference_code": "TSK-HZAC7ES4",
  "title": "Maths degree for 2030, 5 of 6: 1 open problem an undergraduate could move forward. $6 shared",
  "mode": "bounty",
  "reward_base_units": "6000000",
  "reward_token": "OUSD",
  "chain": "Tempo",
  "network": "tempo",
  "expiry": "2026-11-25T00:10:03.382Z",
  "submission_count": 40,
  "requires_verified_worker": true,
  "tags": ["maths", "research"],
  "description": "Maths degree for 2030, 5 of 6: 1 open problem an undergraduate could move forward. $6 shared ...[truncated]",
  "deadline": "2026-11-25T00:10:03.382Z",
  "acceptance_criteria": null,
  "submission_window_open": true,
  "phase": "active"
}
```

Matching CLI output for the same task:

```
$ taskmarket --network tempo task get TSK-HZAC7ES4
TSK-HZAC7ES4 | 0x3e74ecc2dbe1d130105422d0d7fc5cff8bc564447ac3b710eb6ecf69fd55e582 | reward=6000000 | mode=bounty | chain=Tempo | expiry=2026-11-25T00:10:03.382Z | subs=40
```

---

## 6. The refusal path

```
>>> client.callTool("get_task", {task_id:"nonsense"})
{
  "isError": true,
  "content": [
    {
      "type": "text",
      "text": "Command failed: taskmarket --network solana task get nonsense ..."
    }
  ]
}
```

A bad id produces an error result instead of an exception, and the server never
leaves the `task list` / `task get` allow-list to try to satisfy it.

---

## How to reproduce

```bash
npm install
node transcript-run.mjs
```

`transcript-run.mjs` is the client that produced every block above. It connects
over stdio, calls the three tools, and prints the JSON.
