#!/usr/bin/env node
// taskmarket-mcp — read-only MCP server for browsing open Taskmarket tasks.
//
// Safety: this server only ever runs `taskmarket task list` and
// `taskmarket task get`. It never runs a signing command, never touches a
// private key, never writes to a task, and never spends money. The allow-list
// below is the only way this process can reach the outside world.

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const run = promisify(execFile);

// The only two Taskmarket subcommands this server is allowed to run.
const ALLOWED = new Set(['list', 'get']);

const NETWORKS = ['tempo', 'base', 'robinhood', 'solana'];
const MODES = [
  {
    mode: 'bounty',
    plain: 'Many people submit work; the requester picks one or more winners.',
  },
  {
    mode: 'claim',
    plain: 'One worker reserves the task first, then does it.',
  },
  {
    mode: 'pitch',
    plain: 'Workers pitch how they would do it; the requester selects one.',
  },
  {
    mode: 'benchmark',
    plain: 'Entries are ranked against a measured metric.',
  },
  {
    mode: 'auction',
    plain: 'Workers bid on the price; the lowest accepted bid does the work.',
  },
];

function bad(message) {
  return { content: [{ type: 'text', text: message }], isError: true };
}

async function taskmarket(args) {
  // Args look like: [--network <name>] task <list|get> ...
  const idx = args.indexOf('task');
  const sub = idx >= 0 ? args[idx + 1] : undefined;
  if (!ALLOWED.has(sub)) {
    throw new Error(`refused: only "task list" and "task get" are allowed (got "${sub}")`);
  }
  const { stdout } = await run('taskmarket', args, {
    maxBuffer: 8 * 1024 * 1024,
    timeout: 60_000,
  });
  const parsed = JSON.parse(stdout);
  if (!parsed.ok) throw new Error(parsed.error || 'taskmarket returned an error');
  return parsed.data;
}

function pick(task) {
  return {
    id: task.id,
    reference_code: task.referenceCode,
    title: firstLine(task.description),
    mode: task.mode,
    reward_base_units: task.reward,
    reward_token:
      task.chainName === 'Tempo' ? 'OUSD' : task.chainName === 'Base' ? 'USDC' : null,
    chain: task.chainName,
    network: task.chainName === 'Tempo' ? 'tempo' : task.chainName === 'Base' ? 'base' : null,
    expiry: task.expiryTime,
    submission_count: task.submissionCount,
    requires_verified_worker: (task.verifiedBy || []).includes('tap:identity:verified'),
    tags: task.tags || [],
  };
}

function firstLine(text) {
  if (!text) return '';
  const line = String(text).split('\n').map((l) => l.trim()).find(Boolean) || '';
  return line.length > 160 ? `${line.slice(0, 157)}...` : line;
}

const server = new Server(
  { name: 'taskmarket-mcp', version: '0.1.0' },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'list_open_tasks',
      description:
        'List open Taskmarket tasks. Use this to answer "what open tasks fit me?". ' +
        'All filters are optional and can be combined.',
      inputSchema: {
        type: 'object',
        properties: {
          network: {
            type: 'string',
            enum: NETWORKS,
            description: 'Which chain to read from. Defaults to every supported chain.',
          },
          mode: {
            type: 'string',
            enum: MODES.map((m) => m.mode),
            description: 'Only tasks with this task mode.',
          },
          min_reward_base_units: {
            type: 'integer',
            minimum: 0,
            description:
              'Only tasks whose reward in the payment token is at least this many ' +
              'base units (1000000 = 1.00 OUSD/USDC).',
          },
          min_reward_tokens: {
            type: 'number',
            minimum: 0,
            description:
              'Same filter expressed in whole tokens (1 = 1.00 OUSD/USDC). ' +
              'Use one of the two, not both.',
          },
          verified_only: {
            type: 'boolean',
            description:
              'Only tasks that require a verified worker (TAP verification).',
          },
          limit: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            description: 'How many tasks to return per network. Defaults to 20.',
          },
        },
        additionalProperties: false,
      },
    },
    {
      name: 'get_task',
      description:
        'Get one Taskmarket task by its 0x id or by its TSK- reference code, ' +
        'including the full task description and its reward.',
      inputSchema: {
        type: 'object',
        properties: {
          task_id: {
            type: 'string',
            description: 'A 0x-prefixed task id, or a TSK- reference code.',
          },
          network: {
            type: 'string',
            enum: NETWORKS,
            description: 'Which chain to read from. Defaults to every supported chain.',
          },
        },
        required: ['task_id'],
        additionalProperties: false,
      },
    },
    {
      name: 'list_task_modes',
      description:
        'List the five Taskmarket task modes with a plain-language explanation ' +
        'of how each one works.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;

  try {
    if (name === 'list_task_modes') {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ modes: MODES }, null, 2),
          },
        ],
      };
    }

    if (name === 'list_open_tasks') {
      const limit = Math.min(Math.max(args.limit || 20, 1), 100);
      const networks = args.network ? [args.network] : NETWORKS;
      const results = [];
      const notes = [];

      for (const network of networks) {
        const cli = ['--network', network, 'task', 'list', '--status', 'open', '--limit', String(limit)];
        if (args.mode) cli.push('--mode', args.mode);
        if (typeof args.min_reward_tokens === 'number') {
          // The CLI's --reward-min counts whole tokens, not base units.
          cli.push('--reward-min', String(Math.ceil(args.min_reward_tokens)));
        } else if (typeof args.min_reward_base_units === 'number') {
          cli.push('--reward-min', String(Math.ceil(args.min_reward_base_units / 1_000_000)));
        }
        if (args.verified_only === true) {
          cli.push('--verified-by', 'tap:identity:verified');
        }
        try {
          const data = await taskmarket(cli);
          for (const task of data.tasks || []) results.push(pick(task));
        } catch (error) {
          notes.push(`${network}: ${error.message}`);
        }
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              { count: results.length, tasks: results, notes },
              null,
              2,
            ),
          },
        ],
      };
    }

    if (name === 'get_task') {
      const id = String(args.task_id || '').trim();
      if (!id) return bad('task_id is required.');
      const networks = args.network ? [args.network] : NETWORKS;
      for (const network of networks) {
        try {
          const data = await taskmarket(['--network', network, 'task', 'get', id]);
          const task = data.task || data;
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    ...pick(task),
                    description: task.description,
                    deadline: task.expiryTime,
                    acceptance_criteria: task.metricDescription || null,
                    submission_window_open: task.submissionWindowOpen,
                    phase: task.phase,
                  },
                  null,
                  2,
                ),
              },
            ],
          };
        } catch (error) {
          if (network === networks[networks.length - 1]) return bad(error.message);
        }
      }
    }

    return bad(`unknown tool "${name}"`);
  } catch (error) {
    return bad(error.message);
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
