import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const transport = new StdioClientTransport({ command: 'node', args: ['server.js'] });
const client = new Client({ name: 'probe', version: '0.0.1' }, { capabilities: {} });
await client.connect(transport);

const show = (label, obj) => {
  console.log('\n>>> ' + label);
  console.log(JSON.stringify(obj, null, 2));
};

const t = await client.listTools();
show('client.listTools() -> tool names', t.tools.map(x => x.name));

const modes = await client.callTool({ name: 'list_task_modes', arguments: {} });
show('client.callTool("list_task_modes")', JSON.parse(modes.content[0].text));

const list = await client.callTool({
  name: 'list_open_tasks',
  arguments: { network: 'tempo', mode: 'bounty', min_reward_tokens: 10, limit: 5 },
});
const parsed = JSON.parse(list.content[0].text);
show('client.callTool("list_open_tasks", {network:"tempo", mode:"bounty", min_reward_tokens:10, limit:5})', parsed);

const one = await client.callTool({
  name: 'get_task',
  arguments: { task_id: 'TSK-HZAC7ES4', network: 'tempo' },
});
const got = JSON.parse(one.content[0].text);
show('client.callTool("get_task", {task_id:"TSK-HZAC7ES4", network:"tempo"})', {
  ...got,
  description: got.description.slice(0, 300) + ' ...[truncated]',
});

const ver = await client.callTool({
  name: 'list_open_tasks',
  arguments: { network: 'tempo', verified_only: true, limit: 3 },
});
show('client.callTool("list_open_tasks", {network:"tempo", verified_only:true, limit:3})',
  JSON.parse(ver.content[0].text));

await client.close();
